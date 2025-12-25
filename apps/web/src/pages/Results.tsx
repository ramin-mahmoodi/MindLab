import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMySessions, Session } from '../lib/api';
import { useLanguage } from '../components/LanguageContext';

export default function Results() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { t, language } = useLanguage();

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const data = await getMySessions();
            setSessions(data);
        } catch (err) {
            setError(language === 'fa' ? 'خطا در بارگذاری نتایج' : 'Error loading results');
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

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">
                    {language === 'fa' ? (
                        <><span className="gradient-text">نتایج</span> من</>
                    ) : (
                        <>My <span className="gradient-text">Results</span></>
                    )}
                </h1>
                <p className="page-subtitle">{t('results.subtitle')}</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{error}</span>
                </div>
            )}

            {sessions.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <h3>{t('results.empty')}</h3>
                    <p>
                        {language === 'fa'
                            ? 'برای شروع، یکی از تست‌های موجود را انتخاب کنید.'
                            : 'To start, choose one of the available tests.'
                        }
                    </p>
                    <Link to="/tests" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        {t('nav.tests')} →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-2" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {sessions.map((session) => (
                        <div key={session.id} className="card">
                            {session.category && (
                                <span className="category-badge">{session.category}</span>
                            )}
                            <h4>{session.test_name}</h4>

                            <div style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <div>📅 {formatDate(session.created_at)}</div>
                                {session.finished_at ? (
                                    <div style={{ color: 'var(--color-success)', marginTop: '0.5rem' }}>
                                        ✅ {language === 'fa' ? 'تکمیل شده' : 'Completed'}
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--color-warning)', marginTop: '0.5rem' }}>
                                        ⏳ {language === 'fa' ? 'در حال انجام' : 'In Progress'}
                                    </div>
                                )}
                            </div>

                            {session.finished_at && session.total_score !== undefined && (
                                <div style={{
                                    background: 'rgba(45, 212, 191, 0.1)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    border: '1px solid rgba(45, 212, 191, 0.2)',
                                    textAlign: 'center'
                                }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>
                                        {t('results.score')}:
                                    </span>
                                    <strong className="gradient-text" style={{ fontSize: '1.25rem', marginLeft: '0.5rem' }}>
                                        {session.total_score}
                                    </strong>
                                </div>
                            )}

                            {session.finished_at ? (
                                <Link to={`/results/${session.id}`} className="btn btn-primary btn-block">
                                    {t('results.view')} →
                                </Link>
                            ) : (
                                <Link to={`/test/${session.test_id}`} className="btn btn-secondary btn-block">
                                    {language === 'fa' ? 'ادامه تست' : 'Continue Test'}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
