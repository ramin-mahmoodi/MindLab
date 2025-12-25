import { Link } from 'react-router-dom';

export default function Home() {
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
                    <span>Discover Your Mind's Potential</span>
                </div>

                <h1 className="hero-title" style={{ position: 'relative', zIndex: 1 }}>
                    Unlock the Secrets of <br />
                    <span className="gradient-text">Your Psychology</span>
                </h1>

                <p className="hero-description persian" style={{ position: 'relative', zIndex: 1 }}>
                    با استفاده از تست‌های استاندارد و علمی، سلامت روان خود را ارزیابی کنید.
                    نتایج شما به صورت امن ذخیره می‌شود و می‌توانید روند تغییرات را پیگیری کنید.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <Link to="/tests" className="btn btn-primary btn-large">
                        شروع تست رایگان →
                    </Link>
                    <Link to="/tests" className="btn btn-secondary btn-large">
                        Explore All Tests
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
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Tests Taken</div>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>15+</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Assessments</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>98%</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Accuracy</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ marginTop: '4rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    Why Choose <span className="gradient-text">MindLab</span>?
                </h2>
                <p className="persian" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    تست‌های روان‌شناسی حرفه‌ای بر اساس تحقیقات علمی معتبر
                </p>

                <div className="grid grid-3">
                    <div className="card">
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧪</div>
                        <h3>Scientific Methodology</h3>
                        <p className="persian">
                            تست‌های معتبر و علمی مانند PHQ-9 و GAD-7 برای غربالگری دقیق
                        </p>
                    </div>

                    <div className="card">
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                        <h3>Complete Privacy</h3>
                        <p className="persian">
                            نتایج شما کاملاً محرمانه است و فقط خودتان به آن‌ها دسترسی دارید
                        </p>
                    </div>

                    <div className="card">
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
                        <h3>Track Progress</h3>
                        <p className="persian">
                            تاریخچه تست‌های خود را ببینید و روند تغییرات را بررسی کنید
                        </p>
                    </div>
                </div>
            </section>

            {/* Available Tests */}
            <section style={{ marginTop: '4rem', textAlign: 'center' }}>
                <h2>
                    Popular <span className="gradient-text">Assessments</span>
                </h2>
                <p className="persian" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                    سفر خودشناسی خود را با این تست‌های معتبر شروع کنید
                </p>

                <div className="grid grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="card test-card">
                        <span className="category-badge">Depression | افسردگی</span>
                        <h4>PHQ-9</h4>
                        <p className="persian">پرسشنامه ۹ سوالی سلامت بیمار برای غربالگری افسردگی</p>
                        <Link to="/tests" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            شروع تست →
                        </Link>
                    </div>
                    <div className="card test-card">
                        <span className="category-badge">Anxiety | اضطراب</span>
                        <h4>GAD-7</h4>
                        <p className="persian">پرسشنامه ۷ سوالی اضطراب فراگیر</p>
                        <Link to="/tests" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            شروع تست →
                        </Link>
                    </div>
                </div>

                <Link to="/tests" className="btn btn-secondary btn-large" style={{ marginTop: '2rem' }}>
                    View All Tests
                </Link>
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
                <h2>Ready to Discover Your <span className="gradient-text">Psychology</span>?</h2>
                <p className="persian" style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                    به هزاران کاربری بپیوندید که درباره سلامت روان خود آگاهی پیدا کرده‌اند
                </p>
                <Link to="/login" className="btn btn-primary btn-large">
                    شروع رایگان →
                </Link>
            </section>

            {/* Disclaimer */}
            <div className="alert alert-warning persian" style={{ marginTop: '3rem' }}>
                <span className="alert-icon">⚠️</span>
                <span>
                    تمامی تست‌های این سایت صرفاً جنبه آموزشی و غربالگری دارند و جایگزین تشخیص پزشکی یا روان‌پزشکی نیستند.
                </span>
            </div>
        </div>
    );
}
