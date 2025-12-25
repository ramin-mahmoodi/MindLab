// POST /api/sessions/start - Start a new test session
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
}

interface StartSessionRequest {
    testId: number;
}

export const onRequestPost: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    const uid = data.uid;

    if (!uid) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json() as StartSessionRequest;
        const { testId } = body;

        if (!testId) {
            return new Response(JSON.stringify({ error: 'testId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify test exists
        const test = await env.DB.prepare(`
      SELECT id FROM tests WHERE id = ?
    `).bind(testId).first();

        if (!test) {
            return new Response(JSON.stringify({ error: 'Test not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create session
        const result = await env.DB.prepare(`
      INSERT INTO sessions (test_id, user_uid)
      VALUES (?, ?)
    `).bind(testId, uid).run();

        const sessionId = result.meta.last_row_id;

        // Get test with questions for the session
        const { results: questions } = await env.DB.prepare(`
      SELECT q.id, q.text, q.order_index
      FROM questions q
      WHERE q.test_id = ?
      ORDER BY q.order_index
    `).bind(testId).all();

        // Get options
        const questionIds = questions.map((q: any) => q.id);
        let questionsWithOptions = [];

        if (questionIds.length > 0) {
            const placeholders = questionIds.map(() => '?').join(',');
            const { results: options } = await env.DB.prepare(`
        SELECT id, question_id, text, order_index
        FROM options
        WHERE question_id IN (${placeholders})
        ORDER BY question_id, order_index
      `).bind(...questionIds).all();

            const optionsByQuestion: Record<number, any[]> = {};
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

            questionsWithOptions = questions.map((q: any) => ({
                id: q.id,
                text: q.text,
                order_index: q.order_index,
                options: optionsByQuestion[q.id] || []
            }));
        }

        return new Response(JSON.stringify({
            sessionId,
            questions: questionsWithOptions
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error starting session:', error);
        return new Response(JSON.stringify({ error: 'Failed to start session' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
