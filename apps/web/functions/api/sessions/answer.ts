// POST /api/sessions/answer - Record an answer
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
}

interface AnswerRequest {
    sessionId: number;
    questionId: number;
    optionId: number;
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
        const body = await request.json() as AnswerRequest;
        const { sessionId, questionId, optionId } = body;

        if (!sessionId || !questionId || !optionId) {
            return new Response(JSON.stringify({ error: 'sessionId, questionId, and optionId are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify session belongs to user and is not finished
        const session = await env.DB.prepare(`
      SELECT id, finished_at FROM sessions WHERE id = ? AND user_uid = ?
    `).bind(sessionId, uid).first();

        if (!session) {
            return new Response(JSON.stringify({ error: 'Session not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (session.finished_at) {
            return new Response(JSON.stringify({ error: 'Session already finished' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get option score
        const option = await env.DB.prepare(`
      SELECT score FROM options WHERE id = ? AND question_id = ?
    `).bind(optionId, questionId).first();

        if (!option) {
            return new Response(JSON.stringify({ error: 'Invalid option for question' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Upsert answer (replace if exists)
        await env.DB.prepare(`
      INSERT INTO answers (session_id, question_id, option_id, score)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(session_id, question_id) DO UPDATE SET
        option_id = excluded.option_id,
        score = excluded.score,
        answered_at = datetime('now')
    `).bind(sessionId, questionId, optionId, option.score).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error recording answer:', error);
        return new Response(JSON.stringify({ error: 'Failed to record answer' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
