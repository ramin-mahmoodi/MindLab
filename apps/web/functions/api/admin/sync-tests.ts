// Admin endpoint to sync test definitions from code to D1 database
// Optimized version with batched queries
import { TEST_DEFINITIONS, TestDefinition } from '../../../src/data/tests/index';

interface Env {
    DB: D1Database;
    ADMIN_UIDS: string;
}

interface SyncResult {
    testsProcessed: number;
    errors: string[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { data, env, request } = context;

    // Check admin auth
    if (!(data as any).isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Get optional slug parameter to sync single test
    const url = new URL(request.url);
    const singleSlug = url.searchParams.get('slug');

    const result: SyncResult = {
        testsProcessed: 0,
        errors: []
    };

    try {
        const testsToSync = singleSlug
            ? TEST_DEFINITIONS.filter(t => t.slug === singleSlug)
            : TEST_DEFINITIONS;

        for (const testDef of testsToSync) {
            try {
                await syncTestBatched(env.DB, testDef);
                result.testsProcessed++;
            } catch (err: any) {
                result.errors.push(`${testDef.slug}: ${err.message}`);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: `Synced ${result.testsProcessed}/${testsToSync.length} tests`,
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

async function syncTestBatched(db: D1Database, testDef: TestDefinition): Promise<void> {
    // Use a single batch for all operations
    const statements: D1PreparedStatement[] = [];

    // 1. Check if test exists
    const existingTest = await db.prepare(
        'SELECT id FROM tests WHERE slug = ?'
    ).bind(testDef.slug).first<{ id: number }>();

    let testId: number;

    if (existingTest) {
        testId = existingTest.id;
        statements.push(
            db.prepare(`UPDATE tests SET name = ?, description = ?, category = ?, analysis_type = ?, warning = ? WHERE slug = ?`)
                .bind(testDef.nameFa, testDef.descriptionFa, testDef.category, testDef.analysis_type, testDef.warning, testDef.slug)
        );
    } else {
        // Insert test first to get ID
        const insertResult = await db.prepare(`
      INSERT INTO tests (name, description, category, analysis_type, warning, slug)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(testDef.nameFa, testDef.descriptionFa, testDef.category, testDef.analysis_type, testDef.warning, testDef.slug).run();
        testId = insertResult.meta.last_row_id as number;
    }

    // 2. Delete old data
    statements.push(db.prepare('DELETE FROM question_scales WHERE question_id IN (SELECT id FROM questions WHERE test_id = ?)').bind(testId));
    statements.push(db.prepare('DELETE FROM options WHERE question_id IN (SELECT id FROM questions WHERE test_id = ?)').bind(testId));
    statements.push(db.prepare('DELETE FROM questions WHERE test_id = ?').bind(testId));
    statements.push(db.prepare('DELETE FROM cutoffs WHERE scale_id IN (SELECT id FROM scales WHERE test_id = ?)').bind(testId));
    statements.push(db.prepare('DELETE FROM scales WHERE test_id = ?').bind(testId));
    statements.push(db.prepare('DELETE FROM analysis_templates WHERE test_id = ?').bind(testId));
    statements.push(db.prepare('DELETE FROM risk_rules WHERE test_id = ?').bind(testId));

    // Execute deletes
    if (statements.length > 0) {
        await db.batch(statements);
    }

    // 3. Insert scales and get IDs
    const scaleIdMap: Record<string, number> = {};
    for (const scale of testDef.scales) {
        const scaleResult = await db.prepare(
            'INSERT INTO scales (test_id, name) VALUES (?, ?)'
        ).bind(testId, scale.nameFa).run();
        scaleIdMap[scale.key] = scaleResult.meta.last_row_id as number;
    }

    // 4. Insert questions, options, and question_scales
    for (const question of testDef.questions) {
        const qResult = await db.prepare(
            'INSERT INTO questions (test_id, text, order_index) VALUES (?, ?, ?)'
        ).bind(testId, question.text, question.order).run();
        const questionId = qResult.meta.last_row_id as number;

        // Link to scale
        const scaleId = scaleIdMap[question.scaleKey];
        if (scaleId) {
            await db.prepare('INSERT INTO question_scales (question_id, scale_id) VALUES (?, ?)').bind(questionId, scaleId).run();
        }

        // Insert options in batch
        const optionStmts = question.options.map((opt, i) =>
            db.prepare('INSERT INTO options (question_id, text, score, order_index) VALUES (?, ?, ?, ?)').bind(questionId, opt.text, opt.score, i)
        );
        if (optionStmts.length > 0) {
            await db.batch(optionStmts);
        }
    }

    // 5. Insert cutoffs
    const cutoffStmts = testDef.cutoffs.map(cutoff => {
        const scaleId = scaleIdMap[cutoff.scaleKey];
        return db.prepare('INSERT INTO cutoffs (scale_id, min_score, max_score, label, description) VALUES (?, ?, ?, ?, ?)')
            .bind(scaleId, cutoff.min, cutoff.max, cutoff.labelFa, cutoff.label);
    }).filter(s => s);

    if (cutoffStmts.length > 0) {
        await db.batch(cutoffStmts);
    }

    // 6. Insert analysis templates
    const templateStmts = testDef.analysis_templates.map(template => {
        const scaleId = scaleIdMap[template.scaleKey] || null;
        return db.prepare('INSERT INTO analysis_templates (test_id, scale_id, level_label, title, summary, details, recommendations, disclaimer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(testId, scaleId, template.level_label, template.title, template.summary, template.details, template.recommendations, template.disclaimer);
    });

    if (templateStmts.length > 0) {
        await db.batch(templateStmts);
    }

    // 7. Insert risk rules
    const riskStmts = testDef.risk_rules.map(rule =>
        db.prepare('INSERT INTO risk_rules (test_id, condition_expr, message, severity) VALUES (?, ?, ?, ?)')
            .bind(testId, rule.condition, rule.message, rule.severity)
    );

    if (riskStmts.length > 0) {
        await db.batch(riskStmts);
    }
}
