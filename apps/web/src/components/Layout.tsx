import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { logout } from '../lib/firebase';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, isAdmin } = useAuth();
    const { t, isRTL } = useLanguage();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
    };

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <>
            <nav className="navbar">
                <div className="container navbar-content">
                    <Link to="/" className="navbar-brand">
                        <div className="relative brand-icon-wrapper">
                            <Brain className="brand-icon" />
                            <div className="brand-icon-glow" />
                        </div>
                        <span>Mind<span className="brand-highlight">Lab</span></span>
                    </Link>

                    <ul className="navbar-nav">
                        <li>
                            <Link to="/tests" className={`nav-link ${isActive('/tests')}`}>
                                {t('nav.tests')}
                            </Link>
                        </li>

                        {user ? (
                            <>
                                <li>
                                    <Link to="/results" className={`nav-link ${isActive('/results')}`}>
                                        {t('nav.results')}
                                    </Link>
                                </li>

                                {isAdmin && (
                                    <li>
                                        <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                                            {t('nav.admin')}
                                        </Link>
                                    </li>
                                )}

                                <li>
                                    <button onClick={handleLogout} className="btn btn-secondary">
                                        {t('nav.logout')}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link to="/login" className="btn btn-primary">
                                    {t('nav.login')}
                                </Link>
                            </li>
                        )}

                        <li>
                            <LanguageSwitcher />
                        </li>
                    </ul>
                </div>
            </nav>

            <main className="page">
                {children}
            </main>

            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                borderTop: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                background: 'var(--color-bg-secondary)'
            }}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🧠</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginLeft: '0.5rem' }}>
                        Mind<span style={{ color: 'var(--color-primary)' }}>Lab</span>
                    </span>
                </div>
                <p style={{ marginBottom: 0, fontSize: '0.875rem', direction: isRTL ? 'rtl' : 'ltr' }}>
                    ⚠️ {t('tests.disclaimer')}
                </p>
                <p style={{ marginBottom: 0, fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>
                    © 2024 MindLab. Discover Your Psychology.
                </p>
            </footer>
        </>
    );
}
