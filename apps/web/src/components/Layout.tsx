import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { logout } from '../lib/firebase';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, isAdmin } = useAuth();
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
                        <span className="brand-icon">🧠</span>
                        <span>Mind<span className="brand-highlight">Lab</span></span>
                    </Link>

                    <ul className="navbar-nav">
                        <li>
                            <Link to="/tests" className={`nav-link ${isActive('/tests')}`}>
                                Tests
                            </Link>
                        </li>

                        {user ? (
                            <>
                                <li>
                                    <Link to="/results" className={`nav-link ${isActive('/results')}`}>
                                        Results
                                    </Link>
                                </li>

                                {isAdmin && (
                                    <li>
                                        <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                                            Admin
                                        </Link>
                                    </li>
                                )}

                                <li>
                                    <button onClick={handleLogout} className="btn btn-secondary">
                                        خروج
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link to="/login" className="btn btn-primary">
                                    ورود
                                </Link>
                            </li>
                        )}
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
                <p className="persian" style={{ marginBottom: 0, fontSize: '0.875rem' }}>
                    ⚠️ تمامی تست‌های این سایت صرفاً جنبه آموزشی و غربالگری دارند و جایگزین تشخیص پزشکی نیستند.
                </p>
                <p style={{ marginBottom: 0, fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>
                    © 2024 MindLab. Discover Your Psychology.
                </p>
            </footer>
        </>
    );
}
