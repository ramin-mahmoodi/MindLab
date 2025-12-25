import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminGetTests, adminCreateTest, adminUpdateTest, adminDeleteTest, Test } from '../../lib/api';

interface TestFormData {
    name: string;
    description: string;
    category: string;
    warning: string;
}

const defaultFormData: TestFormData = {
    name: '',
    description: '',
    category: '',
    warning: '⚠️ This test is for educational and screening purposes only and is not a substitute for medical diagnosis.'
};

export default function TestsCrud() {
    const [tests, setTests] = useState<(Test & { question_count?: number; scale_count?: number })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | null>(null);
    const [formData, setFormData] = useState<TestFormData>(defaultFormData);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            const data = await adminGetTests();
            setTests(data);
        } catch (err) {
            setError('Failed to load tests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (test?: Test) => {
        if (test) {
            setEditingTest(test);
            setFormData({
                name: test.name,
                description: test.description || '',
                category: test.category || '',
                warning: test.warning || defaultFormData.warning
            });
        } else {
            setEditingTest(null);
            setFormData(defaultFormData);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTest(null);
        setFormData(defaultFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingTest) {
                await adminUpdateTest({ id: editingTest.id, ...formData });
            } else {
                await adminCreateTest(formData);
            }
            handleCloseModal();
            loadTests();
        } catch (err) {
            setError('Failed to save test');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (test: Test) => {
        if (!confirm(`Are you sure you want to delete "${test.name}"?`)) return;

        try {
            await adminDeleteTest(test.id);
            loadTests();
        } catch (err) {
            setError('Failed to delete test');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="admin-header">
                <div>
                    <Link to="/admin" style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'inline-block' }}>
                        ← Back to Dashboard
                    </Link>
                    <h1>Manage Tests</h1>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">
                    + Add New Test
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {tests.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <p>No tests found. Create your first test!</p>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Add Test
                    </button>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Category</th>
                            <th>Questions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map((test) => (
                            <tr key={test.id}>
                                <td>
                                    <strong>{test.name}</strong>
                                    {test.description && (
                                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                            {test.description.substring(0, 80)}...
                                        </div>
                                    )}
                                </td>
                                <td>{test.category || '-'}</td>
                                <td>{test.question_count || 0}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Link to={`/admin/tests/${test.id}/questions`} className="btn btn-secondary">
                                            Questions
                                        </Link>
                                        <button onClick={() => handleOpenModal(test)} className="btn btn-secondary">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(test)} className="btn btn-danger">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingTest ? 'Edit Test' : 'Add New Test'}</h3>
                            <button className="modal-close" onClick={handleCloseModal}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Test Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., PHQ-9"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the test..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g., Depression, Anxiety"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Warning Text</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.warning}
                                    onChange={(e) => setFormData({ ...formData, warning: e.target.value })}
                                    placeholder="Warning shown before starting the test..."
                                />
                            </div>

                            <div className="flex gap-1">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
