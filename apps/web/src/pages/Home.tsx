import { Link } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';

export default function Home() {
    const { t, language } = useLanguage();

    return (
        <div className="container">
            {/* Hero Section with Background Effects */}
            <section className="hero">
                {/* Background Effects */}
                <div className="hero-bg">
                    <div className="glow-1"></div>
                    <div className="glow-2"></div>
                    <div className="float-shape float-shape-1"></div>
                    <div className="float-shape float-shape-2"></div>
                    <div className="float-shape float-shape-3"></div>
                    <div className="float-shape float-shape-4"></div>
                </div>

                {/* Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <span>✨</span>
                    <span>{language === 'fa' ? 'کشف توانایی‌های ذهنی شما' : 'Discover Your Mind\'s Potential'}</span>
                </div>

                <h1 className="hero-title" style={{ position: 'relative', zIndex: 1 }}>
                    {language === 'fa' ? (
                        <>
                            <span className="gradient-text">آزمایشگاه ذهن</span>
                            <br />
                            پلتفرم تست‌های روان‌شناسی
                        </>
                    ) : (
                        <>
                            Unlock the Secrets of <br />
                            <span className="gradient-text">Your Psychology</span>
                        </>
                    )}
                </h1>

                <p className="hero-description" style={{ position: 'relative', zIndex: 1 }}>
                    {t('home.description')}
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <Link to="/tests" className="btn btn-primary btn-large">
                        {t('home.cta')} →
                    </Link>
                    <Link to="/tests" className="btn btn-secondary btn-large">
                        {t('nav.tests')}
                    </Link>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2rem',
                    maxWidth: '500px',
                    margin: '3rem auto 0',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div>
                        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>50K+</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {language === 'fa' ? 'تست انجام شده' : 'Tests Taken'}
                        </div>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>15+</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {language === 'fa' ? 'تست معتبر' : 'Assessments'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>98%</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {language === 'fa' ? 'دقت نتایج' : 'Accuracy'}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    {language === 'fa' ? (
                        <>چرا <span className="gradient-text">آزمایشگاه ذهن</span>؟</>
                    ) : (
                        <>Why Choose <span className="gradient-text">MindLab</span>?</>
                    )}
                </h2>
                <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    {language === 'fa'
                        ? 'تست‌های روان‌شناسی حرفه‌ای بر اساس تحقیقات علمی معتبر'
                        : 'Professional psychological assessments based on validated research'
                    }
                </p>

                <div className="grid grid-3">
                    <div className="card">
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧪</div>
                        <h3>{t('home.features.scientific')}</h3>
                        <p>{t('home.features.scientific.desc')}</p>
                    </div>

                    <div className="card">
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                        <h3>{t('home.features.private')}</h3>
                        <p>{t('home.features.private.desc')}</p>
                    </div>

                    <div className="card">
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
                        <h3>{t('home.features.instant')}</h3>
                        <p>{t('home.features.instant.desc')}</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                marginTop: '4rem',
                textAlign: 'center',
                padding: '3rem',
                background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(167, 139, 250, 0.1))',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)'
            }}>
                <h2>
                    {language === 'fa' ? (
                        <>آماده کشف <span className="gradient-text">روان‌شناسی</span> خود هستید؟</>
                    ) : (
                        <>Ready to Discover Your <span className="gradient-text">Psychology</span>?</>
                    )}
                </h2>
                <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                    {language === 'fa'
                        ? 'به هزاران کاربری بپیوندید که درباره سلامت روان خود آگاهی پیدا کرده‌اند'
                        : 'Join thousands of users who have gained insights about their mental health'
                    }
                </p>
                <Link to="/tests" className="btn btn-primary btn-large">
                    {t('home.cta')} →
                </Link>
            </section>

            {/* Disclaimer */}
            <div className="alert alert-warning" style={{ marginTop: '3rem' }}>
                <span className="alert-icon">⚠️</span>
                <span>{t('tests.disclaimer')}</span>
            </div>
        </div>
    );
}
