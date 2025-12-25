// GET /api/me/sessions/:id - Get session details with results
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
}

export const onRequestGet: PagesFunction<Env, 'id', AuthContext> = async ({ env, params, data }) => {
    const uid = data.uid;
    const sessionId = params.id;

    if (!uid) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Session ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Get session with test info
        const session = await env.DB.prepare(`
      SELECT 
        s.id,
        s.test_id,
        t.name as test_name,
        t.description as test_description,
        t.category,
        t.warning,
        s.created_at,
        s.finished_at
      FROM sessions s
      JOIN tests t ON s.test_id = t.id
      WHERE s.id = ? AND s.user_uid = ?
    `).bind(sessionId, uid).first();

        if (!session) {
            return new Response(JSON.stringify({ error: 'Session not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get results with scale info
        const { results: scaleResults } = await env.DB.prepare(`
      SELECT 
        r.id,
        r.score,
        r.interpretation,
        sc.name as scale_name,
        sc.description as scale_description
      FROM results r
      JOIN scales sc ON r.scale_id = sc.id
      WHERE r.session_id = ?
    `).bind(sessionId).all();

        // Get total score
        const totalScoreResult = await env.DB.prepare(`
      SELECT COALESCE(SUM(score), 0) as total FROM answers WHERE session_id = ?
    `).bind(sessionId).first() as { total: number } | null;

        // Get answers with question and option text
        const { results: answers } = await env.DB.prepare(`
      SELECT 
        a.id,
        a.score,
        q.text as question_text,
        q.order_index,
        o.text as answer_text
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      JOIN options o ON a.option_id = o.id
      WHERE a.session_id = ?
      ORDER BY q.order_index
    `).bind(sessionId).all();

        // Get result report if exists
        const reportResult = await env.DB.prepare(`
      SELECT report_json FROM result_reports WHERE session_id = ?
    `).bind(sessionId).first<{ report_json: string }>();

        let report_json = null;
        if (reportResult?.report_json) {
            try {
                report_json = JSON.parse(reportResult.report_json);
            } catch {
                report_json = reportResult.report_json;
            }
        }

        return new Response(JSON.stringify({
            session: {
                ...session,
                totalScore: totalScoreResult?.total || 0,
                results: scaleResults,
                answers,
                report_json
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching session:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch session' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
