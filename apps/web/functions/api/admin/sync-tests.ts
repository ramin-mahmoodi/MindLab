// Admin endpoint to sync test definitions from code to D1 database
import { TEST_DEFINITIONS, TestDefinition } from '../../../src/data/tests/index';

interface Env {
    DB: D1Database;
    ADMIN_UIDS: string;
}

interface SyncResult {
    testsInserted: number;
    testsUpdated: number;
    scalesCreated: number;
    questionsCreated: number;
    optionsCreated: number;
    cutoffsCreated: number;
    templatesCreated: number;
    riskRulesCreated: number;
    categories: Record<string, number>;
    errors: string[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { data, env } = context;

    // Check admin auth (middleware should have set this)
    if (!(data as any).isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const result: SyncResult = {
        testsInserted: 0,
        testsUpdated: 0,
        scalesCreated: 0,
        questionsCreated: 0,
        optionsCreated: 0,
        cutoffsCreated: 0,
        templatesCreated: 0,
        riskRulesCreated: 0,
        categories: {},
        errors: []
    };

    try {
        for (const testDef of TEST_DEFINITIONS) {
            try {
                await syncTest(env.DB, testDef, result);

                // Track categories
                if (!result.categories[testDef.category]) {
                    result.categories[testDef.category] = 0;
                }
                result.categories[testDef.category]++;
            } catch (err: any) {
                result.errors.push(`Error syncing ${testDef.slug}: ${err.message}`);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: `Synced ${TEST_DEFINITIONS.length} tests`,
            result
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({
            success: false,
            error: err.message,
            result
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

async function syncTest(db: D1Database, testDef: TestDefinition, result: SyncResult): Promise<void> {
    // 1. Upsert the test
    const existingTest = await db.prepare(
        'SELECT id FROM tests WHERE slug = ?'
    ).bind(testDef.slug).first<{ id: number }>();

    let testId: number;

    if (existingTest) {
        // Update existing test
        await db.prepare(`
      UPDATE tests SET 
        name = ?, 
        description = ?, 
        category = ?, 
        analysis_type = ?,
        warning = ?
      WHERE slug = ?
    `).bind(
            testDef.nameFa,
            testDef.descriptionFa,
            testDef.category,
            testDef.analysis_type,
            testDef.warning,
            testDef.slug
        ).run();
        testId = existingTest.id;
        result.testsUpdated++;
    } else {
        // Insert new test
        const insertResult = await db.prepare(`
      INSERT INTO tests (name, description, category, analysis_type, warning, slug)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
            testDef.nameFa,
            testDef.descriptionFa,
            testDef.category,
            testDef.analysis_type,
            testDef.warning,
            testDef.slug
        ).run();
        testId = insertResult.meta.last_row_id as number;
        result.testsInserted++;
    }

    // 2. Sync scales - delete old and insert new
    await db.prepare('DELETE FROM scales WHERE test_id = ?').bind(testId).run();

    const scaleIdMap: Record<string, number> = {};

    for (const scale of testDef.scales) {
        const scaleResult = await db.prepare(`
      INSERT INTO scales (test_id, name) VALUES (?, ?)
    `).bind(testId, scale.nameFa).run();
        scaleIdMap[scale.key] = scaleResult.meta.last_row_id as number;
        result.scalesCreated++;
    }

    // 3. Delete old questions (cascade deletes options and question_scales)
    await db.prepare('DELETE FROM questions WHERE test_id = ?').bind(testId).run();

    // 4. Sync questions and options
    for (const question of testDef.questions) {
        const questionResult = await db.prepare(`
      INSERT INTO questions (test_id, text, order_index)
      VALUES (?, ?, ?)
    `).bind(testId, question.text, question.order).run();

        const questionId = questionResult.meta.last_row_id as number;
        result.questionsCreated++;

        // Link question to scale
        const scaleId = scaleIdMap[question.scaleKey];
        if (scaleId) {
            await db.prepare(`
        INSERT INTO question_scales (question_id, scale_id)
        VALUES (?, ?)
      `).bind(questionId, scaleId).run();
        }

        // Insert options
        for (let i = 0; i < question.options.length; i++) {
            const option = question.options[i];
            await db.prepare(`
        INSERT INTO options (question_id, text, score, order_index)
        VALUES (?, ?, ?, ?)
      `).bind(questionId, option.text, option.score, i).run();
            result.optionsCreated++;
        }
    }

    // 5. Sync cutoffs
    await db.prepare('DELETE FROM cutoffs WHERE scale_id IN (SELECT id FROM scales WHERE test_id = ?)').bind(testId).run();

    for (const cutoff of testDef.cutoffs) {
        const scaleId = scaleIdMap[cutoff.scaleKey];
        if (scaleId) {
            await db.prepare(`
        INSERT INTO cutoffs (scale_id, min_score, max_score, label, description)
        VALUES (?, ?, ?, ?, ?)
      `).bind(scaleId, cutoff.min, cutoff.max, cutoff.labelFa, cutoff.label).run();
            result.cutoffsCreated++;
        }
    }

    // 6. Sync analysis templates
    await db.prepare('DELETE FROM analysis_templates WHERE test_id = ?').bind(testId).run();

    for (const template of testDef.analysis_templates) {
        const scaleId = scaleIdMap[template.scaleKey] || null;
        await db.prepare(`
      INSERT INTO analysis_templates (test_id, scale_id, level_label, title, summary, details, recommendations, disclaimer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
            testId,
            scaleId,
            template.level_label,
            template.title,
            template.summary,
            template.details,
            template.recommendations,
            template.disclaimer
        ).run();
        result.templatesCreated++;
    }

    // 7. Sync risk rules
    await db.prepare('DELETE FROM risk_rules WHERE test_id = ?').bind(testId).run();

    for (const rule of testDef.risk_rules) {
        await db.prepare(`
      INSERT INTO risk_rules (test_id, condition_expr, message, severity)
      VALUES (?, ?, ?, ?)
    `).bind(testId, rule.condition, rule.message, rule.severity).run();
        result.riskRulesCreated++;
    }
}
