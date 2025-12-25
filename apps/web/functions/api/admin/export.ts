// GET /api/admin/export - Export all test data as JSON
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
    isAdmin?: boolean;
}

export const onRequestGet: PagesFunction<Env, string, AuthContext> = async ({ env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Get all tests
        const { results: tests } = await env.DB.prepare(`
      SELECT id, name, description, category, warning FROM tests ORDER BY name
    `).all();

        const exportData = {
            exportedAt: new Date().toISOString(),
            tests: [] as any[]
        };

        for (const test of tests as any[]) {
            // Get scales for this test
            const { results: scales } = await env.DB.prepare(`
        SELECT id, name, description FROM scales WHERE test_id = ?
      `).bind(test.id).all();

            const scalesWithCutoffs = [];
            const scaleIdToName: Record<number, string> = {};

            for (const scale of scales as any[]) {
                scaleIdToName[scale.id] = scale.name;

                const { results: cutoffs } = await env.DB.prepare(`
          SELECT min_score, max_score, label, description FROM cutoffs WHERE scale_id = ?
        `).bind(scale.id).all();

                scalesWithCutoffs.push({
                    name: scale.name,
                    description: scale.description,
                    cutoffs: cutoffs.map((c: any) => ({
                        minScore: c.min_score,
                        maxScore: c.max_score,
                        label: c.label,
                        description: c.description
                    }))
                });
            }

            // Get questions
            const { results: questions } = await env.DB.prepare(`
        SELECT id, text, order_index FROM questions WHERE test_id = ? ORDER BY order_index
      `).bind(test.id).all();

            const questionsWithOptions = [];

            for (const question of questions as any[]) {
                // Get options
                const { results: options } = await env.DB.prepare(`
          SELECT text, score, order_index FROM options WHERE question_id = ? ORDER BY order_index
        `).bind(question.id).all();

                // Get scale mappings
                const { results: scaleMappings } = await env.DB.prepare(`
          SELECT scale_id FROM question_scale_map WHERE question_id = ?
        `).bind(question.id).all();

                const scaleNames = scaleMappings
                    .map((sm: any) => scaleIdToName[sm.scale_id])
                    .filter(Boolean);

                questionsWithOptions.push({
                    text: question.text,
                    orderIndex: question.order_index,
                    scaleNames: scaleNames.length > 0 ? scaleNames : undefined,
                    options: options.map((o: any) => ({
                        text: o.text,
                        score: o.score,
                        orderIndex: o.order_index
                    }))
                });
            }

            exportData.tests.push({
                name: test.name,
                description: test.description,
                category: test.category,
                warning: test.warning,
                scales: scalesWithCutoffs,
                questions: questionsWithOptions
            });
        }

        return new Response(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename="psych-tests-export.json"'
            }
        });
    } catch (error) {
        console.error('Export error:', error);
        return new Response(JSON.stringify({ error: 'Export failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
