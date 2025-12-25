import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { adminImport, adminExport } from '../../lib/api';

export default function ImportExport() {
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        setExporting(true);
        setMessage(null);

        try {
            const data = await adminExport();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mindlab-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setMessage({ type: 'success', text: 'File downloaded successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Export failed' });
            console.error(err);
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        setMessage(null);

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const result = await adminImport(data);

            setMessage({
                type: 'success',
                text: `Imported: ${result.results.testsCreated} tests, ${result.results.questionsCreated} questions, ${result.results.optionsCreated} options`
            });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Import failed' });
            console.error(err);
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="admin-header">
                <div>
                    <Link to="/admin" style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'inline-block' }}>
                        ← Back to Dashboard
                    </Link>
                    <h1>Import / Export</h1>
                </div>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    <span className="alert-icon">{message.type === 'success' ? '✅' : '❌'}</span>
                    <span>{message.text}</span>
                    <button
                        onClick={() => setMessage(null)}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="grid grid-2">
                {/* Export */}
                <div className="card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
                    <h3>Export Data</h3>
                    <p>Download all tests, questions, options, and settings as a JSON file.</p>

                    <button
                        onClick={handleExport}
                        className="btn btn-primary btn-block"
                        disabled={exporting}
                    >
                        {exporting ? 'Preparing...' : 'Download JSON'}
                    </button>
                </div>

                {/* Import */}
                <div className="card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📥</div>
                    <h3>Import Data</h3>
                    <p>Import new tests from a JSON file. Existing tests will not be modified.</p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                        id="import-file"
                    />
                    <label
                        htmlFor="import-file"
                        className="btn btn-secondary btn-block"
                        style={{ cursor: importing ? 'wait' : 'pointer', opacity: importing ? 0.7 : 1 }}
                    >
                        {importing ? 'Importing...' : 'Select JSON File'}
                    </label>
                </div>
            </div>

            {/* Format Info */}
            <div className="alert alert-info" style={{ marginTop: '2rem' }}>
                <span className="alert-icon">📋</span>
                <div>
                    <strong>JSON Format:</strong>
                    <pre style={{
                        background: 'var(--color-bg-tertiary)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginTop: '0.5rem',
                        overflow: 'auto',
                        fontSize: '0.875rem'
                    }}>
                        {`{
  "tests": [
    {
      "name": "Test Name",
      "description": "Description",
      "category": "Category",
      "warning": "Warning text",
      "scales": [
        {
          "name": "Scale Name",
          "cutoffs": [
            { "minScore": 0, "maxScore": 4, "label": "Label", "description": "Description" }
          ]
        }
      ],
      "questions": [
        {
          "text": "Question text",
          "orderIndex": 1,
          "scaleNames": ["Scale Name"],
          "options": [
            { "text": "Option text", "score": 0, "orderIndex": 0 }
          ]
        }
      ]
    }
  ]
}`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
