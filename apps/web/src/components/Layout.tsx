import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
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
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
                <div className="container navbar-content">
                    <Link to="/" className="navbar-brand">
                        <div className="brand-icon-wrapper">
                            <Brain className="brand-icon" />
                            <div className="brand-icon-glow" />
                        </div>
                        <span>Mind<span className="brand-highlight">Lab</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="navbar-nav desktop-nav">
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
                                    <button onClick={handleLogout} className="btn btn-ghost">
                                        {t('nav.logout')}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link to="/login" className="btn btn-hero">
                                    {t('nav.login')}
                                </Link>
                            </li>
                        )}

                        <li>
                            <LanguageSwitcher />
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <Link to="/tests" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        {t('nav.tests')}
                    </Link>

                    {user ? (
                        <>
                            <Link to="/results" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                {t('nav.results')}
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    {t('nav.admin')}
                                </Link>
                            )}
                            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn btn-ghost">
                                {t('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-hero" onClick={() => setIsMobileMenuOpen(false)}>
                            {t('nav.login')}
                        </Link>
                    )}

                    <LanguageSwitcher />
                </div>
            </nav>

            <main className="page">
                {children}
            </main>

            <footer className="footer">
                <div className="footer-brand">
                    <Brain className="footer-icon" />
                    <span className="footer-logo">
                        Mind<span className="brand-highlight">Lab</span>
                    </span>
                </div>
                <p className="footer-disclaimer" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                    ⚠️ {t('tests.disclaimer')}
                </p>
                <p className="footer-copyright">
                    © 2024 MindLab. Discover Your Psychology.
                </p>
            </footer>
        </>
    );
}
