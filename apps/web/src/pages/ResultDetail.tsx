import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSessionDetail, SessionDetail } from '../lib/api';

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
        scales: {
            scale_id: number;
            scale_name: string;
            score: number;
            level: string;
            levelFa: string;
        }[];
    };
    analysis: {
        overall: AnalysisSection | null;
        highlights: AnalysisSection[];
    };
    riskFlags: RiskFlag[];
    disclaimer: string;
    completedAt: string;
}

export default function ResultDetail() {
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<SessionDetail | null>(null);
    const [report, setReport] = useState<ResultReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSession();
    }, [id]);

    const loadSession = async () => {
        if (!id) return;

        try {
            const data = await getSessionDetail(parseInt(id));
            setSession(data);

            // Parse report if available
            if (data.report_json) {
                try {
                    setReport(typeof data.report_json === 'string'
                        ? JSON.parse(data.report_json)
                        : data.report_json);
                } catch (e) {
                    console.error('Error parsing report:', e);
                }
            }
        } catch (err) {
            setError('خطا در بارگذاری نتیجه');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="container">
                <div className="alert alert-error persian">
                    <span className="alert-icon">❌</span>
                    <span>{error || 'نتیجه یافت نشد'}</span>
                </div>
                <Link to="/results" className="btn btn-secondary">
                    ← بازگشت به نتایج
                </Link>
            </div>
        );
    }

    const emergencyRisks = report?.riskFlags.filter(r => r.severity === 'emergency') || [];
    const criticalRisks = report?.riskFlags.filter(r => r.severity === 'critical') || [];
    const warningRisks = report?.riskFlags.filter(r => r.severity === 'warning') || [];

    return (
        <div className="container" style={{ maxWidth: '850px' }}>
            {/* Header */}
            <div className="page-header" style={{ textAlign: 'center' }}>
                <Link to="/results" style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', display: 'inline-block' }}>
                    ← بازگشت به نتایج
                </Link>
                <h1 className="page-title">{report?.test?.name || session.test_name}</h1>
                <p className="page-subtitle persian">
                    تاریخ انجام: {formatDate(session.created_at)}
                </p>
            </div>

            {/* Emergency Risk Alerts */}
            {emergencyRisks.length > 0 && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '2px solid var(--color-error)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    animation: 'pulse 2s infinite'
                }}>
                    <h3 className="persian" style={{ color: 'var(--color-error)', marginBottom: '1rem', direction: 'rtl' }}>
                        🚨 هشدار اورژانسی
                    </h3>
                    {emergencyRisks.map((risk, i) => (
                        <p key={i} className="persian" style={{
                            marginBottom: i === emergencyRisks.length - 1 ? 0 : '0.75rem',
                            direction: 'rtl',
                            fontSize: '1.1rem'
                        }}>
                            {risk.message}
                        </p>
                    ))}
                </div>
            )}

            {/* Critical Risk Alerts */}
            {criticalRisks.length > 0 && (
                <div className="alert alert-error persian" style={{ direction: 'rtl' }}>
                    <span className="alert-icon">⚠️</span>
                    <div>
                        {criticalRisks.map((risk, i) => (
                            <p key={i} style={{ marginBottom: i === criticalRisks.length - 1 ? 0 : '0.5rem' }}>
                                {risk.message}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Warning Risk Alerts */}
            {warningRisks.length > 0 && (
                <div className="alert alert-warning persian" style={{ direction: 'rtl' }}>
                    <span className="alert-icon">⚠️</span>
                    <div>
                        {warningRisks.map((risk, i) => (
                            <p key={i} style={{ marginBottom: i === warningRisks.length - 1 ? 0 : '0.5rem' }}>
                                {risk.message}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Scores Section */}
            <section style={{ marginBottom: '2rem' }}>
                {/* Total Score */}
                <div className="result-score">
                    <div className="score-value">{report?.scores?.total ?? session.totalScore}</div>
                    <div className="score-label persian">نمره کل</div>
                </div>

                {/* Scale Scores */}
                {report?.scores?.scales && report.scores.scales.length > 0 && (
                    <div className="grid grid-2" style={{ gap: '1rem', marginTop: '1.5rem' }}>
                        {report.scores.scales.map((scale, i) => (
                            <div key={i} style={{
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.25rem',
                                textAlign: 'center'
                            }}>
                                <div className="persian" style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                    {scale.scale_name}
                                </div>
                                <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                                    {scale.score}
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    marginTop: '0.5rem',
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(45, 212, 191, 0.15)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.875rem',
                                    color: 'var(--color-primary)'
                                }}>
                                    {scale.levelFa || scale.level}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Analysis Section */}
            {report?.analysis && (report.analysis.overall || report.analysis.highlights.length > 0) && (
                <section style={{ marginBottom: '2rem' }}>
                    <h3 className="persian" style={{ marginBottom: '1rem', direction: 'rtl' }}>📊 تحلیل نتایج</h3>

                    {/* Overall Analysis */}
                    {report.analysis.overall && (
                        <div className="card" style={{ marginBottom: '1rem' }}>
                            <h4 className="persian" style={{ direction: 'rtl', marginBottom: '1rem' }}>
                                {report.analysis.overall.title}
                            </h4>

                            <div className="persian" style={{ direction: 'rtl' }}>
                                <p style={{ fontWeight: 500, marginBottom: '1rem' }}>
                                    {report.analysis.overall.summary}
                                </p>

                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.8 }}>
                                    {report.analysis.overall.details}
                                </p>

                                <div style={{
                                    background: 'rgba(45, 212, 191, 0.1)',
                                    border: '1px solid rgba(45, 212, 191, 0.3)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <strong style={{ display: 'block', marginBottom: '0.5rem' }}>💡 توصیه‌ها:</strong>
                                    <p style={{ marginBottom: 0 }}>{report.analysis.overall.recommendations}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Highlights for multi-scale tests */}
                    {report.analysis.highlights.map((highlight, i) => (
                        <div key={i} className="scale-result">
                            <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="persian">{highlight.title}</span>
                            </h4>
                            <div className="interpretation persian">
                                <p style={{ marginBottom: '0.75rem' }}>{highlight.summary}</p>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>{highlight.details}</p>
                                <p style={{
                                    background: 'rgba(45, 212, 191, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 0
                                }}>
                                    💡 {highlight.recommendations}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Legacy Results Display (fallback) */}
            {!report && session.results && session.results.length > 0 && (
                <section style={{ marginBottom: '2rem' }}>
                    <h3 className="persian" style={{ marginBottom: '1rem', direction: 'rtl' }}>تفسیر نتایج</h3>
                    {session.results.map((result, index) => (
                        <div key={index} className="scale-result">
                            <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="persian">{result.scale_name}</span>
                                <span style={{
                                    background: 'var(--gradient-primary)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.875rem',
                                    color: 'var(--color-bg)'
                                }}>
                                    {result.score}
                                </span>
                            </h4>
                            {result.interpretation && (
                                <p className="interpretation">{result.interpretation}</p>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Disclaimer */}
            <div className="alert alert-info persian" style={{ direction: 'rtl', marginTop: '2rem' }}>
                <span className="alert-icon">ℹ️</span>
                <span>{report?.disclaimer || session.warning || 'این نتیجه جایگزین ارزیابی تخصصی توسط روان‌شناس یا روان‌پزشک نیست.'}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2" style={{ marginTop: '2rem', justifyContent: 'center' }}>
                <Link to={`/test/${session.test_id}`} className="btn btn-primary">
                    انجام مجدد تست
                </Link>
                <Link to="/tests" className="btn btn-secondary">
                    تست‌های دیگر
                </Link>
            </div>
        </div>
    );
}
