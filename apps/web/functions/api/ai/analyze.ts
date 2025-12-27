// POST /api/ai/analyze - Generate AI-powered psychological analysis using REST API
interface Env {
    DB: D1Database;
    CF_ACCOUNT_ID: string;
    CF_API_TOKEN: string;
}

interface AuthContext {
    uid?: string;
}

interface AnalyzeRequest {
    sessionId: number;
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

        // Check if API credentials are configured
        if (!env.CF_ACCOUNT_ID || !env.CF_API_TOKEN) {
            return new Response(JSON.stringify({
                error: 'AI service not configured',
                message: 'لطفاً تنظیمات CF_ACCOUNT_ID و CF_API_TOKEN را انجام دهید.'
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
        let analysisDetails = '';
        let recommendations = '';
        if (reportResult?.report_json) {
            try {
                const report = JSON.parse(reportResult.report_json);
                if (report.analysis?.overall) {
                    standardAnalysis = `${report.analysis.overall.title}: ${report.analysis.overall.summary}`;
                    analysisDetails = report.analysis.overall.details || '';
                    recommendations = report.analysis.overall.recommendations || '';
                }
            } catch { }
        }

        // Build prompt for AI
        const scaleInfo = (scaleResults as any[]).map(r =>
            `- ${r.scale_name}: نمره ${r.score} (${r.interpretation})`
        ).join('\n');

        const prompt = `تو یک روان‌شناس بالینی ایرانی هستی. لطفاً فقط و فقط به زبان فارسی پاسخ بده. از هیچ کلمه انگلیسی یا زبان دیگری استفاده نکن.

اطلاعات آزمون روان‌شناختی:
نام آزمون: ${session.test_name}
دسته‌بندی: ${session.category}
نمره کل: ${totalResult?.total || 0}

نتایج زیرمقیاس‌ها:
${scaleInfo || 'اطلاعاتی موجود نیست'}

تفسیر استاندارد: ${standardAnalysis || 'اطلاعاتی موجود نیست'}

جزئیات تفسیر: ${analysisDetails || 'اطلاعاتی موجود نیست'}

توصیه‌های استاندارد: ${recommendations || 'اطلاعاتی موجود نیست'}

لطفاً یک تحلیل شخصی‌سازی‌شده و حمایتی ارائه بده که شامل این موارد باشد:
۱. توضیح ساده و قابل فهم نتایج
۲. نقاط قوت فرد بر اساس این نتایج  
۳. پیشنهادات عملی و کاربردی
۴. پیام امیدبخش و دلگرم‌کننده

قوانین مهم:
- فقط به زبان فارسی بنویس
- از اعداد فارسی استفاده کن (۱، ۲، ۳)
- حداکثر ۲۰۰ کلمه
- لحن گرم و حمایتی داشته باش
- از اصطلاحات پزشکی پیچیده استفاده نکن`;

        // Call Cloudflare AI via REST API
        const aiResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.CF_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 500,
                    temperature: 0.7
                })
            }
        );

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            console.error('AI API error:', errorText);
            return new Response(JSON.stringify({
                error: 'AI API request failed',
                message: 'خطا در ارتباط با سرویس هوش مصنوعی'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const aiResult = await aiResponse.json() as any;
        const aiAnalysis = aiResult.result?.response || 'متأسفانه در حال حاضر امکان تحلیل هوش مصنوعی وجود ندارد.';

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
