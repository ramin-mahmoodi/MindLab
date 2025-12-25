import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Admin <span className="gradient-text">Dashboard</span></h1>
                <p className="page-subtitle">
                    Manage tests, questions, and system data
                </p>
            </div>

            <div className="grid grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/admin/sync" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔄</div>
                    <h3>Sync Tests</h3>
                    <p className="persian" style={{ direction: 'rtl' }}>همگام‌سازی تست‌های تعریف‌شده در کد با دیتابیس</p>
                    <span className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Sync Now →
                    </span>
                </Link>

                <Link to="/admin/tests" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                    <h3>Manage Tests</h3>
                    <p>Add, edit, and delete psychological assessments</p>
                    <span className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                        View →
                    </span>
                </Link>

                <Link to="/admin/import-export" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
                    <h3>Import / Export</h3>
                    <p>Import or export test data in JSON format</p>
                    <span className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                        View →
                    </span>
                </Link>

                <div className="card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
                    <h3>Analytics</h3>
                    <p>View system statistics and reports</p>
                    <span className="btn btn-secondary" style={{ marginTop: '1rem', opacity: 0.5 }}>
                        Coming Soon
                    </span>
                </div>
            </div>

            <div className="alert alert-info persian" style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto', direction: 'rtl' }}>
                <span className="alert-icon">💡</span>
                <div>
                    <strong>راهنمای سریع:</strong>
                    <p style={{ marginBottom: 0 }}>
                        برای اضافه کردن تست‌های جدید، ابتدا فایل‌های JSON را در <code>src/data/tests/</code> قرار دهید و
                        سپس از بخش "Sync Tests" برای همگام‌سازی با دیتابیس استفاده کنید.
                    </p>
                </div>
            </div>
        </div>
    );
}
