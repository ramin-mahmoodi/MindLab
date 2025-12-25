import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

interface SyncResult {
    testsProcessed: number;
    errors: string[];
}

export default function SyncTests() {
    const [syncing, setSyncing] = useState(false);
    const [result, setResult] = useState<SyncResult | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleSync = async () => {
        setSyncing(true);
        setError('');
        setResult(null);
        setMessage('');

        try {
            const token = await user?.getIdToken();
            const response = await fetch('/api/admin/sync-tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Sync failed');
            }

            setMessage(data.message || 'Sync complete');
            setResult(data.result);
        } catch (err: any) {
            setError(err.message || 'Failed to sync tests');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="admin-header">
                <div>
                    <Link to="/admin" style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'inline-block' }}>
                        ← Back to Dashboard
                    </Link>
                    <h1>Sync Tests</h1>
                    <p className="persian" style={{ color: 'var(--color-text-muted)', margin: 0, direction: 'rtl' }}>
                        همگام‌سازی تست‌های تعریف‌شده در کد با دیتابیس
                    </p>
                </div>
            </div>

            <div className="alert alert-info persian" style={{ direction: 'rtl' }}>
                <span className="alert-icon">ℹ️</span>
                <div>
                    <strong>نحوه کار:</strong>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingRight: '1.5rem' }}>
                        <li>تست‌ها از فایل‌های JSON داخل پروژه خوانده می‌شوند</li>
                        <li>تست‌های موجود بر اساس slug آپدیت می‌شوند</li>
                        <li>سوالات، گزینه‌ها، cutoffs و templates همه sync می‌شوند</li>
                    </ul>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="card text-center" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
                <h3 className="persian" style={{ marginBottom: '1rem' }}>همگام‌سازی تست‌ها</h3>
                <p className="persian" style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    با کلیک روی دکمه زیر، تمام تست‌های تعریف‌شده در کد با دیتابیس همگام‌سازی می‌شوند.
                </p>
                <button
                    onClick={handleSync}
                    className="btn btn-primary btn-large"
                    disabled={syncing}
                    style={{ minWidth: '200px' }}
                >
                    {syncing ? (
                        <>
                            <span className="spinner" style={{ width: '20px', height: '20px' }}></span>
                            در حال همگام‌سازی...
                        </>
                    ) : (
                        'Sync Tests from Code'
                    )}
                </button>
            </div>

            {message && (
                <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                    <span className="alert-icon">✅</span>
                    <span>{message}</span>
                </div>
            )}

            {result && (
                <div className="card" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>✅ Sync Complete</h3>

                    <div style={{
                        background: 'var(--color-bg-tertiary)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        textAlign: 'center',
                        marginBottom: '1rem'
                    }}>
                        <div className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                            {result.testsProcessed}
                        </div>
                        <div style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Tests Synced</div>
                    </div>

                    {result.errors && result.errors.length > 0 && (
                        <div className="alert alert-warning">
                            <span className="alert-icon">⚠️</span>
                            <div>
                                <strong>Errors ({result.errors.length}):</strong>
                                <ul style={{ margin: '0.5rem 0 0 1rem', fontSize: '0.875rem' }}>
                                    {result.errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
