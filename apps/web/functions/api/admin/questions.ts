// Admin CRUD for questions
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
    isAdmin?: boolean;
}

interface QuestionInput {
    id?: number;
    testId: number;
    text: string;
    orderIndex?: number;
    scaleIds?: number[];
}

// GET - List questions by test
export const onRequestGet: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const url = new URL(request.url);
        const testId = url.searchParams.get('testId');

        if (!testId) {
            return new Response(JSON.stringify({ error: 'testId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { results: questions } = await env.DB.prepare(`
      SELECT q.id, q.text, q.order_index
      FROM questions q
      WHERE q.test_id = ?
      ORDER BY q.order_index
    `).bind(testId).all();

        // Get options for each question
        const questionIds = questions.map((q: any) => q.id);
        let optionsByQuestion: Record<number, any[]> = {};
        let scalesByQuestion: Record<number, any[]> = {};

        if (questionIds.length > 0) {
            const placeholders = questionIds.map(() => '?').join(',');

            const { results: options } = await env.DB.prepare(`
        SELECT id, question_id, text, score, order_index
        FROM options
        WHERE question_id IN (${placeholders})
        ORDER BY question_id, order_index
      `).bind(...questionIds).all();

            for (const opt of options as any[]) {
                if (!optionsByQuestion[opt.question_id]) {
                    optionsByQuestion[opt.question_id] = [];
                }
                optionsByQuestion[opt.question_id].push(opt);
            }

            // Get scale mappings
            const { results: scaleMaps } = await env.DB.prepare(`
        SELECT qsm.question_id, s.id as scale_id, s.name as scale_name
        FROM question_scale_map qsm
        JOIN scales s ON qsm.scale_id = s.id
        WHERE qsm.question_id IN (${placeholders})
      `).bind(...questionIds).all();

            for (const sm of scaleMaps as any[]) {
                if (!scalesByQuestion[sm.question_id]) {
                    scalesByQuestion[sm.question_id] = [];
                }
                scalesByQuestion[sm.question_id].push({ id: sm.scale_id, name: sm.scale_name });
            }
        }

        const questionsWithDetails = questions.map((q: any) => ({
            ...q,
            options: optionsByQuestion[q.id] || [],
            scales: scalesByQuestion[q.id] || []
        }));

        // Get available scales for this test
        const { results: scales } = await env.DB.prepare(`
      SELECT id, name FROM scales WHERE test_id = ?
    `).bind(testId).all();

        return new Response(JSON.stringify({ questions: questionsWithDetails, scales }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch questions' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// POST - Create question
export const onRequestPost: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json() as QuestionInput;
        const { testId, text, orderIndex, scaleIds } = body;

        if (!testId || !text) {
            return new Response(JSON.stringify({ error: 'testId and text are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get max order_index if not provided
        let order = orderIndex;
        if (order === undefined) {
            const maxOrder = await env.DB.prepare(`
        SELECT MAX(order_index) as max_order FROM questions WHERE test_id = ?
      `).bind(testId).first() as { max_order: number | null };
            order = (maxOrder?.max_order || 0) + 1;
        }

        const result = await env.DB.prepare(`
      INSERT INTO questions (test_id, text, order_index)
      VALUES (?, ?, ?)
    `).bind(testId, text, order).run();

        const questionId = result.meta.last_row_id;

        // Add scale mappings
        if (scaleIds && scaleIds.length > 0) {
            for (const scaleId of scaleIds) {
                await env.DB.prepare(`
          INSERT INTO question_scale_map (question_id, scale_id) VALUES (?, ?)
        `).bind(questionId, scaleId).run();
            }
        }

        return new Response(JSON.stringify({ success: true, id: questionId }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to create question' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// PUT - Update question
export const onRequestPut: PagesFunction<Env, string, AuthContext> = async ({ request, env, data }) => {
    if (!data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json() as QuestionInput;
        const { id, text, orderIndex, scaleIds } = body;

        if (!id || !text) {
            return new Response(JSON.stringify({ error: 'id and text are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await env.DB.prepare(`
      UPDATE questions SET text = ?, order_index = COALESCE(?, order_index) WHERE id = ?
    `).bind(text, orderIndex || null, id).run();

        // Update scale mappings if provided
        if (scaleIds !== undefined) {
            await env.DB.prepare(`DELETE FROM question_scale_map WHERE question_id = ?`).bind(id).run();
            for (const scaleId of scaleIds) {
                await env.DB.prepare(`
          INSERT INTO question_scale_map (question_id, scale_id) VALUES (?, ?)
        `).bind(id, scaleId).run();
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to update question' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// DELETE - Delete question
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

        await env.DB.prepare(`DELETE FROM questions WHERE id = ?`).bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete question' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
