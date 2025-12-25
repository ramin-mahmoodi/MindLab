// Admin CRUD for options
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
    isAdmin?: boolean;
}

interface OptionInput {
    id?: number;
    questionId: number;
    text: string;
    score: number;
    orderIndex?: number;
}

// GET - List options by question
export const onRequestGet: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const url = new URL(request.url);
        const questionId = url.searchParams.get('questionId');

        if (!questionId) {
            return new Response(JSON.stringify({ error: 'questionId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { results } = await env.DB.prepare(`
      SELECT id, text, score, order_index
      FROM options
      WHERE question_id = ?
      ORDER BY order_index
    `).bind(questionId).all();

        return new Response(JSON.stringify({ options: results }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch options' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// POST - Create option
export const onRequestPost: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json() as OptionInput;
        const { questionId, text, score, orderIndex } = body;

        if (!questionId || !text || score === undefined) {
            return new Response(JSON.stringify({ error: 'questionId, text, and score are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        let order = orderIndex;
        if (order === undefined) {
            const maxOrder = await env.DB.prepare(`
        SELECT MAX(order_index) as max_order FROM options WHERE question_id = ?
      `).bind(questionId).first() as { max_order: number | null };
            order = (maxOrder?.max_order || 0) + 1;
        }

        const result = await env.DB.prepare(`
      INSERT INTO options (question_id, text, score, order_index)
      VALUES (?, ?, ?, ?)
    `).bind(questionId, text, score, order).run();

        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to create option' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// PUT - Update option
export const onRequestPut: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json() as OptionInput;
        const { id, text, score, orderIndex } = body;

        if (!id || !text || score === undefined) {
            return new Response(JSON.stringify({ error: 'id, text, and score are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await env.DB.prepare(`
      UPDATE options 
      SET text = ?, score = ?, order_index = COALESCE(?, order_index)
      WHERE id = ?
    `).bind(text, score, orderIndex || null, id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to update option' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// DELETE - Delete option
export const onRequestDelete: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'id is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await env.DB.prepare(`DELETE FROM options WHERE id = ?`).bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete option' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
