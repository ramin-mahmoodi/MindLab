// POST /api/admin/import - Import test data from JSON
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
    isAdmin?: boolean;
}

interface ImportData {
    tests: {
        name: string;
        description?: string;
        category?: string;
        warning?: string;
        scales: {
            name: string;
            description?: string;
            cutoffs: {
                minScore: number;
                maxScore: number;
                label: string;
                description?: string;
            }[];
        }[];
        questions: {
            text: string;
            orderIndex: number;
            scaleNames?: string[];
            options: {
                text: string;
                score: number;
                orderIndex: number;
            }[];
        }[];
    }[];
}

export const onRequestPost: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const importData = await request.json() as ImportData;

        if (!importData.tests || !Array.isArray(importData.tests)) {
            return new Response(JSON.stringify({ error: 'Invalid import data format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const results = {
            testsCreated: 0,
            scalesCreated: 0,
            questionsCreated: 0,
            optionsCreated: 0,
            cutoffsCreated: 0
        };

        for (const test of importData.tests) {
            // Create test
            const testResult = await env.DB.prepare(`
        INSERT INTO tests (name, description, category, warning)
        VALUES (?, ?, ?, ?)
      `).bind(
                test.name,
                test.description || null,
                test.category || null,
                test.warning || null
            ).run();

            const testId = testResult.meta.last_row_id;
            results.testsCreated++;

            // Create scales and track their IDs by name
            const scaleIdMap: Record<string, number> = {};

            if (test.scales) {
                for (const scale of test.scales) {
                    const scaleResult = await env.DB.prepare(`
            INSERT INTO scales (test_id, name, description)
            VALUES (?, ?, ?)
          `).bind(testId, scale.name, scale.description || null).run();

                    const scaleId = scaleResult.meta.last_row_id as number;
                    scaleIdMap[scale.name] = scaleId;
                    results.scalesCreated++;

                    // Create cutoffs for this scale
                    if (scale.cutoffs) {
                        for (const cutoff of scale.cutoffs) {
                            await env.DB.prepare(`
                INSERT INTO cutoffs (scale_id, min_score, max_score, label, description)
                VALUES (?, ?, ?, ?, ?)
              `).bind(
                                scaleId,
                                cutoff.minScore,
                                cutoff.maxScore,
                                cutoff.label,
                                cutoff.description || null
                            ).run();
                            results.cutoffsCreated++;
                        }
                    }
                }
            }

            // Create questions with options
            if (test.questions) {
                for (const question of test.questions) {
                    const questionResult = await env.DB.prepare(`
            INSERT INTO questions (test_id, text, order_index)
            VALUES (?, ?, ?)
          `).bind(testId, question.text, question.orderIndex).run();

                    const questionId = questionResult.meta.last_row_id;
                    results.questionsCreated++;

                    // Map question to scales
                    if (question.scaleNames) {
                        for (const scaleName of question.scaleNames) {
                            const scaleId = scaleIdMap[scaleName];
                            if (scaleId) {
                                await env.DB.prepare(`
                  INSERT INTO question_scale_map (question_id, scale_id)
                  VALUES (?, ?)
                `).bind(questionId, scaleId).run();
                            }
                        }
                    }

                    // Create options
                    if (question.options) {
                        for (const option of question.options) {
                            await env.DB.prepare(`
                INSERT INTO options (question_id, text, score, order_index)
                VALUES (?, ?, ?, ?)
              `).bind(questionId, option.text, option.score, option.orderIndex).run();
                            results.optionsCreated++;
                        }
                    }
                }
            }
        }

        return new Response(JSON.stringify({ success: true, results }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Import error:', error);
        return new Response(JSON.stringify({ error: 'Import failed: ' + (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
