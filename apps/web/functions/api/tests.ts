// GET /api/tests - List all tests (public)
interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
    try {
        const { results } = await env.DB.prepare(`
      SELECT id, name, description, category, warning
      FROM tests
      ORDER BY name
    `).all();

        return new Response(JSON.stringify({ tests: results }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching tests:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch tests' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
