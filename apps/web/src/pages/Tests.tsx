import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTests, Test } from '../lib/api';
import { useAuth } from '../components/AuthContext';
import { useLanguage } from '../components/LanguageContext';
import { CATEGORIES } from '../data/tests';

interface CategoryGroup {
    key: string;
    name: string;
    nameFa: string;
    icon: string;
    tests: Test[];
}

export default function Tests() {
    const [categories, setCategories] = useState<CategoryGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const { user } = useAuth();
    const { t, language } = useLanguage();

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            const tests = await getTests();

            const grouped = CATEGORIES.map(cat => ({
                ...cat,
                tests: tests.filter((t: Test) => t.category === cat.key)
            })).filter(cat => cat.tests.length > 0);

            setCategories(grouped);

            if (grouped.length > 0) {
                setExpandedCategory(grouped[0].key);
            }
        } catch (err) {
            setError(language === 'fa' ? 'خطا در بارگذاری تست‌ها' : 'Error loading tests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (key: string) => {
        setExpandedCategory(expandedCategory === key ? null : key);
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
                        <><span className="gradient-text">تست‌های</span> روان‌شناسی</>
                    ) : (
                        <>Psychological <span className="gradient-text">Assessments</span></>
                    )}
                </h1>
                <p className="page-subtitle">{t('tests.subtitle')}</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{error}</span>
                </div>
            )}

            {!user && (
                <div className="alert alert-info" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
                    <span className="alert-icon">ℹ️</span>
                    <span>
                        {t('tests.login.prompt')} <Link to="/login" style={{ fontWeight: 600 }}>{t('nav.login')}</Link>
                    </span>
                </div>
            )}

            {categories.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <p>{t('tests.empty')}</p>
                </div>
            ) : (
                <div className="category-list" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {categories.map((cat) => (
                        <div key={cat.key} className="category-section">
                            <button
                                className="category-header"
                                onClick={() => toggleCategory(cat.key)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem 1.5rem',
                                    background: expandedCategory === cat.key
                                        ? 'linear-gradient(135deg, rgba(45, 212, 191, 0.15), rgba(167, 139, 250, 0.15))'
                                        : 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: expandedCategory === cat.key ? 'var(--radius-xl) var(--radius-xl) 0 0' : 'var(--radius-xl)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-normal)',
                                    marginBottom: expandedCategory === cat.key ? 0 : '0.75rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.75rem' }}>{cat.icon}</span>
                                    <div style={{ textAlign: language === 'fa' ? 'right' : 'left' }}>
                                        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
                                            {language === 'fa' ? cat.nameFa : cat.name}
                                        </h3>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            {cat.tests.length} {language === 'fa' ? 'تست' : 'tests'}
                                        </span>
                                    </div>
                                </div>
                                <span style={{
                                    transform: expandedCategory === cat.key ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform var(--transition-normal)',
                                    fontSize: '1.25rem'
                                }}>
                                    ▼
                                </span>
                            </button>

                            {expandedCategory === cat.key && (
                                <div style={{
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderTop: 'none',
                                    borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
                                    padding: '1rem',
                                    marginBottom: '0.75rem'
                                }}>
                                    <div className="grid grid-2" style={{ gap: '1rem' }}>
                                        {cat.tests.map((test) => (
                                            <div key={test.id} className="card test-card" style={{ margin: 0 }}>
                                                <h4 style={{ margin: 0 }}>{test.name}</h4>
                                                {test.description && (
                                                    <p style={{
                                                        fontSize: '0.9rem',
                                                        marginTop: '0.75rem',
                                                        marginBottom: '1rem'
                                                    }}>
                                                        {test.description}
                                                    </p>
                                                )}
                                                {user ? (
                                                    <Link to={`/test/${test.id}`} className="btn btn-primary btn-block">
                                                        {t('tests.start')} →
                                                    </Link>
                                                ) : (
                                                    <Link to="/login" className="btn btn-secondary btn-block">
                                                        {t('tests.login.required')}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Disclaimer */}
            <div className="alert alert-warning" style={{ maxWidth: '700px', margin: '3rem auto' }}>
                <span className="alert-icon">⚠️</span>
                <span>{t('tests.disclaimer')}</span>
            </div>
        </div>
    );
}
