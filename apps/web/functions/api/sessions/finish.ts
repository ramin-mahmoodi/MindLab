// POST /api/sessions/finish - Finish session, calculate results, generate analysis report
interface Env {
    DB: D1Database;
}

interface AuthContext {
    uid?: string;
}

interface FinishRequest {
    sessionId: number;
}

interface ScaleResult {
    scale_id: number;
    scale_name: string;
    score: number;
    level: string;
    levelFa: string;
}

interface AnalysisSection {
    title: string;
    summary: string;
    details: string;
    recommendations: string;
}

interface RiskFlag {
    message: string;
    severity: string;
}

interface ResultReport {
    test: {
        id: number;
        slug: string;
        name: string;
        category: string;
    };
    scores: {
        total: number;
        scales: ScaleResult[];
    };
    analysis: {
        overall: AnalysisSection | null;
        highlights: AnalysisSection[];
    };
    riskFlags: RiskFlag[];
    disclaimer: string;
    completedAt: string;
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
        const body = await request.json() as FinishRequest;
        const { sessionId } = body;

        if (!sessionId) {
            return new Response(JSON.stringify({ error: 'sessionId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify session belongs to user and is not finished
        const session = await env.DB.prepare(`
            SELECT s.id, s.test_id, s.finished_at, 
                   t.name as test_name, t.slug as test_slug, t.category as test_category, t.warning
            FROM sessions s 
            JOIN tests t ON s.test_id = t.id
            WHERE s.id = ? AND s.user_uid = ?
        `).bind(sessionId, uid).first<{
            id: number;
            test_id: number;
            finished_at: string | null;
            test_name: string;
            test_slug: string;
            test_category: string;
            warning: string;
        }>();

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

        // Get all scales for this test
        const { results: scales } = await env.DB.prepare(`
            SELECT id, name FROM scales WHERE test_id = ?
        `).bind(session.test_id).all();

        // Get all answers with question info for risk evaluation
        const { results: answers } = await env.DB.prepare(`
            SELECT a.question_id, a.option_id, a.score, q.order_index, q.text as question_text
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            WHERE a.session_id = ?
            ORDER BY q.order_index
        `).bind(sessionId).all();

        // Calculate total score
        const totalScore = (answers as any[]).reduce((sum, a) => sum + (a.score || 0), 0);

        // Calculate scores for each scale
        const scaleResults: ScaleResult[] = [];

        for (const scale of scales as any[]) {
            // Get score for questions mapped to this scale
            const scoreResult = await env.DB.prepare(`
                SELECT COALESCE(SUM(a.score), 0) as total_score
                FROM answers a
                JOIN question_scales qs ON a.question_id = qs.question_id
                WHERE a.session_id = ? AND qs.scale_id = ?
            `).bind(sessionId, scale.id).first<{ total_score: number }>();

            const scaleScore = scoreResult?.total_score || 0;

            // Find level from cutoffs
            const cutoff = await env.DB.prepare(`
                SELECT label, description FROM cutoffs
                WHERE scale_id = ? AND min_score <= ? AND max_score >= ?
                LIMIT 1
            `).bind(scale.id, scaleScore, scaleScore).first<{ label: string; description: string }>();

            const level = cutoff?.label || 'Unknown';
            const levelFa = cutoff?.description || level;

            // Insert result into results table
            await env.DB.prepare(`
                INSERT INTO results (session_id, scale_id, score, interpretation)
                VALUES (?, ?, ?, ?)
            `).bind(sessionId, scale.id, scaleScore, `${level}: ${levelFa}`).run();

            scaleResults.push({
                scale_id: scale.id,
                scale_name: scale.name,
                score: scaleScore,
                level,
                levelFa
            });
        }

        // Get analysis templates based on levels
        const analysisHighlights: AnalysisSection[] = [];
        let overallAnalysis: AnalysisSection | null = null;

        for (const sr of scaleResults) {
            const template = await env.DB.prepare(`
                SELECT title, summary, details, recommendations
                FROM analysis_templates
                WHERE test_id = ? AND (scale_id = ? OR scale_id IS NULL) AND level_label = ?
                LIMIT 1
            `).bind(session.test_id, sr.scale_id, sr.level).first<AnalysisSection>();

            if (template) {
                if (scaleResults.length === 1) {
                    overallAnalysis = template;
                } else {
                    analysisHighlights.push({
                        title: `${sr.scale_name}: ${template.title}`,
                        summary: template.summary,
                        details: template.details,
                        recommendations: template.recommendations
                    });
                }
            }
        }

        // If multiple scales but no highlights, try to get overall template
        if (!overallAnalysis && analysisHighlights.length === 0) {
            const mainScale = scaleResults[0];
            if (mainScale) {
                const template = await env.DB.prepare(`
                    SELECT title, summary, details, recommendations
                    FROM analysis_templates
                    WHERE test_id = ? AND level_label = ?
                    LIMIT 1
                `).bind(session.test_id, mainScale.level).first<AnalysisSection>();

                if (template) {
                    overallAnalysis = template;
                }
            }
        }

        // Evaluate risk rules
        const riskFlags: RiskFlag[] = [];

        const { results: riskRules } = await env.DB.prepare(`
            SELECT condition_expr, message, severity FROM risk_rules WHERE test_id = ?
        `).bind(session.test_id).all();

        for (const rule of riskRules as any[]) {
            const triggered = evaluateRiskCondition(rule.condition_expr, answers as any[]);
            if (triggered) {
                riskFlags.push({
                    message: rule.message,
                    severity: rule.severity
                });
            }
        }

        // Build the complete report
        const report: ResultReport = {
            test: {
                id: session.test_id,
                slug: session.test_slug,
                name: session.test_name,
                category: session.test_category
            },
            scores: {
                total: totalScore,
                scales: scaleResults
            },
            analysis: {
                overall: overallAnalysis,
                highlights: analysisHighlights
            },
            riskFlags,
            disclaimer: session.warning || 'این نتیجه جایگزین ارزیابی تخصصی توسط روان‌شناس یا روان‌پزشک نیست.',
            completedAt: new Date().toISOString()
        };

        // Save report to result_reports table
        await env.DB.prepare(`
            INSERT INTO result_reports (session_id, report_json, created_at)
            VALUES (?, ?, datetime('now'))
            ON CONFLICT(session_id) DO UPDATE SET report_json = excluded.report_json
        `).bind(sessionId, JSON.stringify(report)).run();

        // Mark session as finished
        await env.DB.prepare(`
            UPDATE sessions SET finished_at = datetime('now') WHERE id = ?
        `).bind(sessionId).run();

        return new Response(JSON.stringify({
            success: true,
            totalScore,
            results: scaleResults.map(sr => ({
                scaleName: sr.scale_name,
                score: sr.score,
                interpretation: `${sr.level}: ${sr.levelFa}`
            })),
            report
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error finishing session:', error);
        return new Response(JSON.stringify({ error: 'Failed to finish session' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Evaluate risk condition like "q9_score >= 1"
function evaluateRiskCondition(condition: string, answers: { order_index: number; score: number }[]): boolean {
    try {
        // Parse conditions like "q9_score >= 1", "q21_score >= 2"
        const match = condition.match(/q(\d+)_score\s*(>=|>|<=|<|==|=)\s*(\d+)/i);
        if (!match) return false;

        const questionOrder = parseInt(match[1]);
        const operator = match[2];
        const threshold = parseInt(match[3]);

        const answer = answers.find(a => a.order_index === questionOrder);
        if (!answer) return false;

        const score = answer.score;

        switch (operator) {
            case '>=': return score >= threshold;
            case '>': return score > threshold;
            case '<=': return score <= threshold;
            case '<': return score < threshold;
            case '==':
            case '=': return score === threshold;
            default: return false;
        }
    } catch {
        return false;
    }
}
