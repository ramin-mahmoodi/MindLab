import { Link } from 'react-router-dom';
import { useLanguage } from '../../components/LanguageContext';

export default function AdminDashboard() {
    const { language } = useLanguage();
    const isFA = language === 'fa';

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">
                    {isFA ? (
                        <>پنل <span className="gradient-text">مدیریت</span></>
                    ) : (
                        <>Admin <span className="gradient-text">Dashboard</span></>
                    )}
                </h1>
                <p className="page-subtitle">
                    {isFA ? 'مدیریت تست‌ها، سوالات و داده‌های سیستم' : 'Manage tests, questions, and system data'}
                </p>
            </div>

            <div className="grid grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/admin/sync" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔄</div>
                    <h3>{isFA ? 'همگام‌سازی تست‌ها' : 'Sync Tests'}</h3>
                    <p>{isFA ? 'همگام‌سازی تست‌های تعریف‌شده در کد با دیتابیس' : 'Sync code-defined tests with database'}</p>
                    <span className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        {isFA ? 'همگام‌سازی ←' : 'Sync Now →'}
                    </span>
                </Link>

                <Link to="/admin/tests" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                    <h3>{isFA ? 'مدیریت تست‌ها' : 'Manage Tests'}</h3>
                    <p>{isFA ? 'افزودن، ویرایش و حذف آزمون‌های روان‌شناسی' : 'Add, edit, and delete psychological assessments'}</p>
                    <span className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                        {isFA ? 'مشاهده ←' : 'View →'}
                    </span>
                </Link>

                <Link to="/admin/import-export" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
                    <h3>{isFA ? 'ورود / خروج داده' : 'Import / Export'}</h3>
                    <p>{isFA ? 'وارد کردن یا خارج کردن داده تست‌ها به فرمت JSON' : 'Import or export test data in JSON format'}</p>
                    <span className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                        {isFA ? 'مشاهده ←' : 'View →'}
                    </span>
                </Link>

                <div className="card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
                    <h3>{isFA ? 'آمار و گزارش' : 'Analytics'}</h3>
                    <p>{isFA ? 'مشاهده آمار سیستم و گزارش‌ها' : 'View system statistics and reports'}</p>
                    <span className="btn btn-secondary" style={{ marginTop: '1rem', opacity: 0.5 }}>
                        {isFA ? 'به زودی' : 'Coming Soon'}
                    </span>
                </div>
            </div>

            <div className="alert alert-info" style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
                <span className="alert-icon">💡</span>
                <div>
                    <strong>{isFA ? 'راهنمای سریع:' : 'Quick Guide:'}</strong>
                    <p style={{ marginBottom: 0 }}>
                        {isFA
                            ? 'برای اضافه کردن تست‌های جدید، ابتدا فایل‌های JSON را در src/data/tests/ قرار دهید و سپس از بخش "همگام‌سازی تست‌ها" استفاده کنید.'
                            : 'To add new tests, place JSON files in src/data/tests/ and then use "Sync Tests" to sync with database.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
