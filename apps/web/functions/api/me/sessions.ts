// GET /api/me/sessions - Get user's sessions
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
}

export const onRequestGet: PagesFunction<Env, string, AuthContext> = async ({ env, data }) => {
    const uid = data.uid;

    if (!uid) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { results } = await env.DB.prepare(`
      SELECT 
        s.id,
        s.test_id,
        t.name as test_name,
        t.category,
        s.created_at,
        s.finished_at,
        (SELECT COALESCE(SUM(score), 0) FROM answers WHERE session_id = s.id) as total_score
      FROM sessions s
      JOIN tests t ON s.test_id = t.id
      WHERE s.user_uid = ?
      ORDER BY s.created_at DESC
    `).bind(uid).all();

        return new Response(JSON.stringify({ sessions: results }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch sessions' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
