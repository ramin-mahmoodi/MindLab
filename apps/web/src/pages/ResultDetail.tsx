import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSessionDetail, SessionDetail } from '../lib/api';
import { useLanguage } from '../components/LanguageContext';

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
    const { t, language } = useLanguage();
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
            setError(language === 'fa' ? 'خطا در بارگذاری نتیجه' : 'Error loading result');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language === 'fa' ? 'fa-IR' : 'en-US', {
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
                <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{error || (language === 'fa' ? 'نتیجه یافت نشد' : 'Result not found')}</span>
                </div>
                <Link to="/results" className="btn btn-secondary">
                    ← {t('result.back')}
                </Link>
            </div>
        );
    }

    const emergencyRisks = report?.riskFlags?.filter(r => r.severity === 'emergency') || [];
    const criticalRisks = report?.riskFlags?.filter(r => r.severity === 'critical') || [];
    const warningRisks = report?.riskFlags?.filter(r => r.severity === 'warning') || [];

    // Determine score to display
    const totalScore = report?.scores?.total ?? session.totalScore;

    return (
        <div className="container" style={{ maxWidth: '850px' }}>
            {/* Header */}
            <div className="page-header" style={{ textAlign: 'center' }}>
                <Link to="/results" style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', display: 'inline-block' }}>
                    ← {t('result.back')}
                </Link>
                <h1 className="page-title">{report?.test?.name || session.test_name}</h1>
                <p className="page-subtitle">
                    {language === 'fa' ? 'تاریخ انجام:' : 'Completed:'} {formatDate(session.created_at)}
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
                    <h3 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>
                        🚨 {language === 'fa' ? 'هشدار اورژانسی' : 'Emergency Alert'}
                    </h3>
                    {emergencyRisks.map((risk, i) => (
                        <p key={i} style={{
                            marginBottom: i === emergencyRisks.length - 1 ? 0 : '0.75rem',
                            fontSize: '1.1rem'
                        }}>
                            {risk.message}
                        </p>
                    ))}
                </div>
            )}

            {/* Critical Risk Alerts */}
            {criticalRisks.length > 0 && (
                <div className="alert alert-error">
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
                <div className="alert alert-warning">
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

            {/* Total Score */}
            <section style={{ marginBottom: '2rem' }}>
                <div className="result-score">
                    <div className="score-value">{totalScore}</div>
                    <div className="score-label">{t('result.total.score')}</div>
                </div>
            </section>

            {/* Analysis Section - Only if report exists */}
            {report?.analysis && (report.analysis.overall || report.analysis.highlights?.length > 0) && (
                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>📊 {t('result.analysis')}</h3>

                    {/* Overall Analysis */}
                    {report.analysis.overall && (
                        <div className="card" style={{ marginBottom: '1rem' }}>
                            <h4 style={{ marginBottom: '1rem' }}>
                                {report.analysis.overall.title}
                            </h4>

                            <div>
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
                                    <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        💡 {t('result.recommendations')}:
                                    </strong>
                                    <p style={{ marginBottom: 0 }}>{report.analysis.overall.recommendations}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Disclaimer */}
            <div className="alert alert-info" style={{ marginTop: '2rem' }}>
                <span className="alert-icon">ℹ️</span>
                <span>{t('result.disclaimer')}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2" style={{ marginTop: '2rem', justifyContent: 'center' }}>
                <Link to={`/test/${session.test_id}`} className="btn btn-primary">
                    {t('result.retake')}
                </Link>
                <Link to="/tests" className="btn btn-secondary">
                    {t('result.other.tests')}
                </Link>
            </div>
        </div>
    );
}
