// Admin CRUD for tests
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
    isAdmin?: boolean;
}

interface TestInput {
    name: string;
    description?: string;
    category?: string;
    warning?: string;
}

// GET - List all tests with details
export const onRequestGet: PagesFunction<Env, string, AuthContext> = async ({ env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { results } = await env.DB.prepare(`
      SELECT 
        t.id, t.name, t.description, t.category, t.warning, t.created_at, t.updated_at,
        (SELECT COUNT(*) FROM questions WHERE test_id = t.id) as question_count,
        (SELECT COUNT(*) FROM scales WHERE test_id = t.id) as scale_count,
        (SELECT COUNT(*) FROM sessions WHERE test_id = t.id) as session_count
      FROM tests t
      ORDER BY t.name
    `).all();

        return new Response(JSON.stringify({ tests: results }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch tests' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// POST - Create test
export const onRequestPost: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json() as TestInput;
        const { name, description, category, warning } = body;

        if (!name) {
            return new Response(JSON.stringify({ error: 'name is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await env.DB.prepare(`
      INSERT INTO tests (name, description, category, warning)
      VALUES (?, ?, ?, ?)
    `).bind(name, description || null, category || null, warning || null).run();

        return new Response(JSON.stringify({
            success: true,
            id: result.meta.last_row_id
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to create test' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// PUT - Update test
export const onRequestPut: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json() as TestInput & { id: number };
        const { id, name, description, category, warning } = body;

        if (!id || !name) {
            return new Response(JSON.stringify({ error: 'id and name are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await env.DB.prepare(`
      UPDATE tests 
      SET name = ?, description = ?, category = ?, warning = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(name, description || null, category || null, warning || null, id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to update test' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// DELETE - Delete test
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

        await env.DB.prepare(`DELETE FROM tests WHERE id = ?`).bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete test' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
