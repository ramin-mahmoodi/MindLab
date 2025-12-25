import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

interface SyncResult {
    testsInserted: number;
    testsUpdated: number;
    scalesCreated: number;
    questionsCreated: number;
    optionsCreated: number;
    cutoffsCreated: number;
    templatesCreated: number;
    riskRulesCreated: number;
    categories: Record<string, number>;
    errors: string[];
}

export default function SyncTests() {
    const [syncing, setSyncing] = useState(false);
    const [result, setResult] = useState<SyncResult | null>(null);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleSync = async () => {
        setSyncing(true);
        setError('');
        setResult(null);

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
                        <li>تست‌های جدید اضافه می‌شوند</li>
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

            {result && (
                <div className="card" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>✅ Sync Complete</h3>

                    <div className="grid grid-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            background: 'var(--color-bg-tertiary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}>
                            <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                {result.testsInserted}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Tests Added</div>
                        </div>
                        <div style={{
                            background: 'var(--color-bg-tertiary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}>
                            <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                {result.testsUpdated}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Tests Updated</div>
                        </div>
                        <div style={{
                            background: 'var(--color-bg-tertiary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}>
                            <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                {result.questionsCreated}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Questions</div>
                        </div>
                        <div style={{
                            background: 'var(--color-bg-tertiary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}>
                            <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                {result.templatesCreated}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Templates</div>
                        </div>
                    </div>

                    <h4 style={{ marginBottom: '0.75rem' }}>Categories</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {Object.entries(result.categories).map(([cat, count]) => (
                            <span key={cat} className="category-badge">
                                {cat}: {count}
                            </span>
                        ))}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <div>Scales: <strong>{result.scalesCreated}</strong></div>
                        <div>Options: <strong>{result.optionsCreated}</strong></div>
                        <div>Cutoffs: <strong>{result.cutoffsCreated}</strong></div>
                        <div>Risk Rules: <strong>{result.riskRulesCreated}</strong></div>
                    </div>

                    {result.errors.length > 0 && (
                        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                            <span className="alert-icon">⚠️</span>
                            <div>
                                <strong>Errors:</strong>
                                <ul style={{ margin: '0.5rem 0 0 1rem' }}>
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
