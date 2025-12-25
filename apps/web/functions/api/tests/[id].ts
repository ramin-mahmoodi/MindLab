// GET /api/tests/:id - Get test details with questions and options (public)
interface Env {
    DB: D1Database;
}

interface Question {
    id: number;
    text: string;
    order_index: number;
    options: Option[];
}

interface Option {
    id: number;
    text: string;
    order_index: number;
}

export const onRequestGet: PagesFunction<Env, 'id'> = async ({ env, params }) => {
    const testId = params.id;

    if (!testId) {
        return new Response(JSON.stringify({ error: 'Test ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Get test info
        const test = await env.DB.prepare(`
      SELECT id, name, description, category, warning
      FROM tests
      WHERE id = ?
    `).bind(testId).first();

        if (!test) {
            return new Response(JSON.stringify({ error: 'Test not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get questions
        const { results: questions } = await env.DB.prepare(`
      SELECT id, text, order_index
      FROM questions
      WHERE test_id = ?
      ORDER BY order_index
    `).bind(testId).all();

        // Get options for all questions
        const questionIds = questions.map((q: any) => q.id);

        if (questionIds.length > 0) {
            const placeholders = questionIds.map(() => '?').join(',');
            const { results: options } = await env.DB.prepare(`
        SELECT id, question_id, text, order_index
        FROM options
        WHERE question_id IN (${placeholders})
        ORDER BY question_id, order_index
      `).bind(...questionIds).all();

            // Group options by question
            const optionsByQuestion: Record<number, Option[]> = {};
            for (const opt of options as any[]) {
                if (!optionsByQuestion[opt.question_id]) {
                    optionsByQuestion[opt.question_id] = [];
                }
                optionsByQuestion[opt.question_id].push({
                    id: opt.id,
                    text: opt.text,
                    order_index: opt.order_index
                });
            }

            // Attach options to questions
            const questionsWithOptions: Question[] = questions.map((q: any) => ({
                id: q.id,
                text: q.text,
                order_index: q.order_index,
                options: optionsByQuestion[q.id] || []
            }));

            return new Response(JSON.stringify({
                test: {
                    ...test,
                    questions: questionsWithOptions
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            test: {
                ...test,
                questions: []
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching test:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch test' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
