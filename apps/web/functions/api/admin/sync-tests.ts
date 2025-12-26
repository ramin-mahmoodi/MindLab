// Admin endpoint to sync test definitions from code to D1 database
// Ultra-optimized version - minimal API calls
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

    if (!(data as any).isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

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

        // Process tests one at a time with minimal queries
        for (const testDef of testsToSync) {
            try {
                await syncTestMinimal(env.DB, testDef);
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

async function syncTestMinimal(db: D1Database, testDef: TestDefinition): Promise<void> {
    // Step 1: Upsert test (1 query)
    const existingTest = await db.prepare('SELECT id FROM tests WHERE slug = ?').bind(testDef.slug).first<{ id: number }>();

    let testId: number;
    if (existingTest) {
        testId = existingTest.id;
        await db.prepare(`UPDATE tests SET name = ?, description = ?, category = ?, analysis_type = ?, warning = ? WHERE id = ?`)
            .bind(testDef.nameFa, testDef.descriptionFa, testDef.category, testDef.analysis_type, testDef.warning, testId).run();
    } else {
        const insertResult = await db.prepare(`INSERT INTO tests (name, description, category, analysis_type, warning, slug) VALUES (?, ?, ?, ?, ?, ?)`)
            .bind(testDef.nameFa, testDef.descriptionFa, testDef.category, testDef.analysis_type, testDef.warning, testDef.slug).run();
        testId = insertResult.meta.last_row_id as number;
    }

    // Step 2: Single batch to delete all old data (1 batch call)
    await db.batch([
        db.prepare('DELETE FROM question_scales WHERE question_id IN (SELECT id FROM questions WHERE test_id = ?)').bind(testId),
        db.prepare('DELETE FROM options WHERE question_id IN (SELECT id FROM questions WHERE test_id = ?)').bind(testId),
        db.prepare('DELETE FROM questions WHERE test_id = ?').bind(testId),
        db.prepare('DELETE FROM cutoffs WHERE scale_id IN (SELECT id FROM scales WHERE test_id = ?)').bind(testId),
        db.prepare('DELETE FROM scales WHERE test_id = ?').bind(testId),
        db.prepare('DELETE FROM analysis_templates WHERE test_id = ?').bind(testId),
        db.prepare('DELETE FROM risk_rules WHERE test_id = ?').bind(testId),
    ]);

    // Step 3: Insert all scales in one batch (1 batch call)
    const scaleStmts = testDef.scales.map(scale =>
        db.prepare('INSERT INTO scales (test_id, name) VALUES (?, ?)').bind(testId, scale.nameFa)
    );
    const scaleResults = await db.batch(scaleStmts);

    // Build scale ID map
    const scaleIdMap: Record<string, number> = {};
    testDef.scales.forEach((scale, i) => {
        scaleIdMap[scale.key] = scaleResults[i].meta.last_row_id as number;
    });

    // Step 4: Insert all questions in one batch (1 batch call)
    const questionStmts = testDef.questions.map(q =>
        db.prepare('INSERT INTO questions (test_id, text, order_index) VALUES (?, ?, ?)').bind(testId, q.text, q.order)
    );
    const questionResults = await db.batch(questionStmts);

    // Build question ID map
    const questionIds = questionResults.map(r => r.meta.last_row_id as number);

    // Step 5: Build all options and question_scales, then batch insert
    const allOptionStmts: D1PreparedStatement[] = [];
    const allQScaleStmts: D1PreparedStatement[] = [];

    testDef.questions.forEach((q, idx) => {
        const questionId = questionIds[idx];
        const scaleId = scaleIdMap[q.scaleKey];

        // Link question to scale
        if (scaleId) {
            allQScaleStmts.push(
                db.prepare('INSERT INTO question_scales (question_id, scale_id) VALUES (?, ?)').bind(questionId, scaleId)
            );
        }

        // Add options
        q.options.forEach((opt, optIdx) => {
            allOptionStmts.push(
                db.prepare('INSERT INTO options (question_id, text, score, order_index) VALUES (?, ?, ?, ?)').bind(questionId, opt.text, opt.score, optIdx)
            );
        });
    });

    // Batch insert question_scales (1 batch)
    if (allQScaleStmts.length > 0) {
        await db.batch(allQScaleStmts);
    }

    // Batch insert options in chunks of 50 to avoid limits (multiple batches)
    const CHUNK_SIZE = 50;
    for (let i = 0; i < allOptionStmts.length; i += CHUNK_SIZE) {
        const chunk = allOptionStmts.slice(i, i + CHUNK_SIZE);
        await db.batch(chunk);
    }

    // Step 6: Insert cutoffs (1 batch)
    const cutoffStmts = testDef.cutoffs.map(c => {
        const scaleId = scaleIdMap[c.scaleKey];
        return db.prepare('INSERT INTO cutoffs (scale_id, min_score, max_score, label, description) VALUES (?, ?, ?, ?, ?)')
            .bind(scaleId, c.min, c.max, c.labelFa, c.label);
    });
    if (cutoffStmts.length > 0) {
        await db.batch(cutoffStmts);
    }

    // Step 7: Insert analysis templates (1 batch)
    const templateStmts = testDef.analysis_templates.map(t => {
        const scaleId = scaleIdMap[t.scaleKey] || null;
        return db.prepare('INSERT INTO analysis_templates (test_id, scale_id, level_label, title, summary, details, recommendations, disclaimer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(testId, scaleId, t.level_label, t.title, t.summary, t.details, t.recommendations, t.disclaimer);
    });
    if (templateStmts.length > 0) {
        await db.batch(templateStmts);
    }

    // Step 8: Insert risk rules (1 batch)
    const riskStmts = testDef.risk_rules.map(r =>
        db.prepare('INSERT INTO risk_rules (test_id, condition_expr, message, severity) VALUES (?, ?, ?, ?)')
            .bind(testId, r.condition, r.message, r.severity)
    );
    if (riskStmts.length > 0) {
        await db.batch(riskStmts);
    }
}
