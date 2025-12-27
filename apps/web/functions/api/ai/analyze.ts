// POST /api/ai/analyze - Generate AI-powered psychological analysis
interface Env {
    DB: D1Database;
    AI: any; // Cloudflare AI binding
}

interface AuthContext {
    uid?: string;
}

interface AnalyzeRequest {
    sessionId: number;
}

interface TestResult {
    testName: string;
    category: string;
    totalScore: number;
    scales: {
        name: string;
        score: number;
        level: string;
    }[];
    standardAnalysis?: string;
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
        const body = await request.json() as AnalyzeRequest;
        const { sessionId } = body;

        if (!sessionId) {
            return new Response(JSON.stringify({ error: 'sessionId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if AI binding is available
        if (!env.AI) {
            return new Response(JSON.stringify({
                error: 'AI service not configured',
                message: 'لطفاً تنظیمات AI را در پنل Cloudflare انجام دهید.'
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get session data
        const session = await env.DB.prepare(`
            SELECT s.id, s.test_id, t.name as test_name, t.category, t.slug
            FROM sessions s
            JOIN tests t ON s.test_id = t.id
            WHERE s.id = ? AND s.user_uid = ? AND s.finished_at IS NOT NULL
        `).bind(sessionId, uid).first<{
            id: number;
            test_id: number;
            test_name: string;
            category: string;
            slug: string;
        }>();

        if (!session) {
            return new Response(JSON.stringify({ error: 'Session not found or not finished' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get results
        const { results: scaleResults } = await env.DB.prepare(`
            SELECT r.score, r.interpretation, sc.name as scale_name
            FROM results r
            JOIN scales sc ON r.scale_id = sc.id
            WHERE r.session_id = ?
        `).bind(sessionId).all();

        // Get total score
        const totalResult = await env.DB.prepare(`
            SELECT COALESCE(SUM(score), 0) as total FROM answers WHERE session_id = ?
        `).bind(sessionId).first<{ total: number }>();

        // Get existing report for context
        const reportResult = await env.DB.prepare(`
            SELECT report_json FROM result_reports WHERE session_id = ?
        `).bind(sessionId).first<{ report_json: string }>();

        let standardAnalysis = '';
        if (reportResult?.report_json) {
            try {
                const report = JSON.parse(reportResult.report_json);
                if (report.analysis?.overall) {
                    standardAnalysis = `${report.analysis.overall.title}: ${report.analysis.overall.summary}`;
                }
            } catch { }
        }

        // Build prompt for AI
        const scaleInfo = (scaleResults as any[]).map(r =>
            `- ${r.scale_name}: نمره ${r.score} (${r.interpretation})`
        ).join('\n');

        const prompt = `تو یک روان‌شناس بالینی هستی که نتایج یک آزمون روان‌شناختی را تحلیل می‌کنی.

اطلاعات آزمون:
- نام آزمون: ${session.test_name}
- دسته‌بندی: ${session.category}
- نمره کل: ${totalResult?.total || 0}

نتایج زیرمقیاس‌ها:
${scaleInfo}

${standardAnalysis ? `تحلیل استاندارد: ${standardAnalysis}` : ''}

لطفاً یک تحلیل شخصی‌سازی‌شده و حمایتی به زبان فارسی ارائه بده که شامل:
1. توضیح ساده نتایج برای فرد غیرمتخصص
2. نقاط قوت احتمالی
3. پیشنهادات عملی برای بهبود (اگر نیاز است)
4. پیام امیدبخش و حمایتی

مهم: پاسخ باید کوتاه (حداکثر 200 کلمه)، گرم و حمایتی باشد. از اصطلاحات پزشکی پیچیده استفاده نکن.`;

        // Call Cloudflare AI
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            prompt: prompt,
            max_tokens: 500,
            temperature: 0.7
        });

        const aiAnalysis = aiResponse.response || aiResponse.text || 'متأسفانه در حال حاضر امکان تحلیل هوش مصنوعی وجود ندارد.';

        // Save AI analysis to database
        await env.DB.prepare(`
            INSERT INTO ai_analyses (session_id, analysis_text, model, created_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(session_id) DO UPDATE SET 
                analysis_text = excluded.analysis_text,
                model = excluded.model,
                created_at = datetime('now')
        `).bind(sessionId, aiAnalysis, '@cf/meta/llama-3.1-8b-instruct').run();

        return new Response(JSON.stringify({
            success: true,
            analysis: aiAnalysis,
            model: 'llama-3.1-8b-instruct'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error generating AI analysis:', error);
        return new Response(JSON.stringify({
            error: 'Failed to generate AI analysis',
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
