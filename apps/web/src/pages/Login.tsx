import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../lib/firebase';
import { useLanguage } from '../components/LanguageContext';

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t, language } = useLanguage();

    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isRegister && password !== confirmPassword) {
            setError(language === 'fa' ? 'رمز عبور و تکرار آن باید یکسان باشند' : 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError(language === 'fa' ? 'رمز عبور باید حداقل ۶ کاراکتر باشد' : 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (isRegister) {
                await registerWithEmail(email, password);
            } else {
                await loginWithEmail(email, password);
            }
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error('Auth error:', err);
            const errors: Record<string, string> = {
                'auth/user-not-found': language === 'fa' ? 'کاربری با این ایمیل یافت نشد' : 'User not found',
                'auth/wrong-password': language === 'fa' ? 'رمز عبور اشتباه است' : 'Wrong password',
                'auth/email-already-in-use': language === 'fa' ? 'این ایمیل قبلاً ثبت شده است' : 'Email already in use',
                'auth/invalid-email': language === 'fa' ? 'فرمت ایمیل صحیح نیست' : 'Invalid email format',
            };
            setError(errors[err.code] || (language === 'fa' ? 'خطا در ورود. لطفاً دوباره تلاش کنید.' : 'Login failed. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            await loginWithGoogle();
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error('Google auth error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError(language === 'fa' ? 'پنجره ورود بسته شد' : 'Login popup was closed');
            } else {
                setError(language === 'fa' ? 'خطا در ورود با گوگل' : 'Google login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '450px', margin: '0 auto' }}>
            <div className="card">
                <div className="card-header text-center">
                    <h2>{isRegister ? t('login.register') : t('login.title')}</h2>
                    <p className="text-muted">
                        {isRegister
                            ? (language === 'fa' ? 'یک حساب کاربری جدید بسازید' : 'Create a new account')
                            : (language === 'fa' ? 'وارد حساب کاربری خود شوید' : 'Sign in to your account')}
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">❌</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{t('login.email')}</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            dir="ltr"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('login.password')}</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={language === 'fa' ? 'حداقل ۶ کاراکتر' : 'At least 6 characters'}
                            required
                            dir="ltr"
                        />
                    </div>

                    {isRegister && (
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'fa' ? 'تکرار رمز عبور' : 'Confirm Password'}
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={language === 'fa' ? 'رمز عبور را تکرار کنید' : 'Repeat password'}
                                required
                                dir="ltr"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-large"
                        disabled={loading}
                    >
                        {loading
                            ? (language === 'fa' ? 'لطفاً صبر کنید...' : 'Please wait...')
                            : (isRegister ? t('login.register') : t('login.submit'))}
                    </button>
                </form>

                <div style={{
                    margin: '1.5rem 0',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <span style={{
                        background: 'var(--color-bg-secondary)',
                        padding: '0 1rem',
                        color: 'var(--color-text-muted)'
                    }}>
                        {language === 'fa' ? 'یا' : 'or'}
                    </span>
                    <hr style={{
                        position: 'absolute',
                        width: '100%',
                        top: '50%',
                        border: 'none',
                        borderTop: '1px solid var(--color-border)',
                        zIndex: -1
                    }} />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-secondary btn-block"
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t('login.google')}
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    {isRegister ? t('login.have.account') : t('login.no.account')}
                    {' '}
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontWeight: 500
                        }}
                    >
                        {isRegister ? t('login.submit') : t('login.register')}
                    </button>
                </p>
            </div>
        </div>
    );
}
