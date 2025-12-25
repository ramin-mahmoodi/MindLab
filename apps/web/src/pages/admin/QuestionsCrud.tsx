import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    adminGetQuestions,
    adminCreateQuestion,
    adminUpdateQuestion,
    adminDeleteQuestion,
    adminCreateOption,
    adminUpdateOption,
    adminDeleteOption
} from '../../lib/api';

interface Question {
    id: number;
    text: string;
    order_index: number;
    options: Option[];
    scales: { id: number; name: string }[];
}

interface Option {
    id: number;
    text: string;
    score: number;
    order_index: number;
}

interface Scale {
    id: number;
    name: string;
}

export default function QuestionsCrud() {
    const { testId } = useParams<{ testId: string }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [scales, setScales] = useState<Scale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [questionText, setQuestionText] = useState('');
    const [selectedScales, setSelectedScales] = useState<number[]>([]);

    const [showOptionModal, setShowOptionModal] = useState(false);
    const [editingOption, setEditingOption] = useState<Option | null>(null);
    const [optionQuestionId, setOptionQuestionId] = useState<number | null>(null);
    const [optionText, setOptionText] = useState('');
    const [optionScore, setOptionScore] = useState(0);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, [testId]);

    const loadData = async () => {
        if (!testId) return;
        try {
            const data = await adminGetQuestions(parseInt(testId));
            setQuestions(data.questions);
            setScales(data.scales);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenQuestionModal = (question?: Question) => {
        if (question) {
            setEditingQuestion(question);
            setQuestionText(question.text);
            setSelectedScales(question.scales.map(s => s.id));
        } else {
            setEditingQuestion(null);
            setQuestionText('');
            setSelectedScales(scales.length > 0 ? [scales[0].id] : []);
        }
        setShowQuestionModal(true);
    };

    const handleSubmitQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testId) return;
        setSubmitting(true);

        try {
            if (editingQuestion) {
                await adminUpdateQuestion({
                    id: editingQuestion.id,
                    text: questionText,
                    scaleIds: selectedScales
                });
            } else {
                await adminCreateQuestion({
                    testId: parseInt(testId),
                    text: questionText,
                    scaleIds: selectedScales
                });
            }
            setShowQuestionModal(false);
            loadData();
        } catch (err) {
            setError('Failed to save question');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (id: number) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await adminDeleteQuestion(id);
            loadData();
        } catch (err) {
            setError('Failed to delete');
        }
    };

    const handleOpenOptionModal = (questionId: number, option?: Option) => {
        setOptionQuestionId(questionId);
        if (option) {
            setEditingOption(option);
            setOptionText(option.text);
            setOptionScore(option.score);
        } else {
            setEditingOption(null);
            setOptionText('');
            setOptionScore(0);
        }
        setShowOptionModal(true);
    };

    const handleSubmitOption = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!optionQuestionId) return;
        setSubmitting(true);

        try {
            if (editingOption) {
                await adminUpdateOption({
                    id: editingOption.id,
                    text: optionText,
                    score: optionScore
                });
            } else {
                await adminCreateOption({
                    questionId: optionQuestionId,
                    text: optionText,
                    score: optionScore
                });
            }
            setShowOptionModal(false);
            loadData();
        } catch (err) {
            setError('Failed to save option');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteOption = async (id: number) => {
        if (!confirm('Are you sure you want to delete this option?')) return;
        try {
            await adminDeleteOption(id);
            loadData();
        } catch (err) {
            setError('Failed to delete');
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="container">
            <div className="admin-header">
                <div>
                    <Link to="/admin/tests" style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'inline-block' }}>
                        ← Back to Tests
                    </Link>
                    <h1>Manage Questions</h1>
                </div>
                <button onClick={() => handleOpenQuestionModal()} className="btn btn-primary">
                    + Add Question
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {questions.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <p>No questions yet. Add your first question!</p>
                </div>
            ) : (
                <div>
                    {questions.map((q, idx) => (
                        <div key={q.id} className="card" style={{ marginBottom: '1rem' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0 }}>
                                    {idx + 1}. {q.text}
                                </h4>
                                <div className="action-buttons">
                                    <button onClick={() => handleOpenQuestionModal(q)} className="btn btn-secondary">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="btn btn-danger">
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginLeft: '1.5rem' }}>
                                <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                                    <strong style={{ color: 'var(--color-text-muted)' }}>Options:</strong>
                                    <button onClick={() => handleOpenOptionModal(q.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                                        + Option
                                    </button>
                                </div>

                                {q.options.length === 0 ? (
                                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>No options</p>
                                ) : (
                                    <div>
                                        {q.options.map((opt) => (
                                            <div key={opt.id} className="flex justify-between items-center" style={{
                                                padding: '0.5rem 0.75rem',
                                                background: 'var(--color-bg-tertiary)',
                                                borderRadius: 'var(--radius-sm)',
                                                marginBottom: '0.25rem'
                                            }}>
                                                <span>{opt.text} <span className="gradient-text">(Score: {opt.score})</span></span>
                                                <div className="action-buttons">
                                                    <button onClick={() => handleOpenOptionModal(q.id, opt)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>✏️</button>
                                                    <button onClick={() => handleDeleteOption(opt.id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>🗑️</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Question Modal */}
            {showQuestionModal && (
                <div className="modal-overlay" onClick={() => setShowQuestionModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingQuestion ? 'Edit Question' : 'Add Question'}</h3>
                            <button className="modal-close" onClick={() => setShowQuestionModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmitQuestion}>
                            <div className="form-group">
                                <label className="form-label">Question Text *</label>
                                <textarea
                                    className="form-textarea"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    required
                                />
                            </div>

                            {scales.length > 0 && (
                                <div className="form-group">
                                    <label className="form-label">Scales</label>
                                    {scales.map((scale) => (
                                        <label key={scale.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedScales.includes(scale.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedScales([...selectedScales, scale.id]);
                                                    } else {
                                                        setSelectedScales(selectedScales.filter(id => id !== scale.id));
                                                    }
                                                }}
                                            />
                                            {scale.name}
                                        </label>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-1">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowQuestionModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Option Modal */}
            {showOptionModal && (
                <div className="modal-overlay" onClick={() => setShowOptionModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingOption ? 'Edit Option' : 'Add Option'}</h3>
                            <button className="modal-close" onClick={() => setShowOptionModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmitOption}>
                            <div className="form-group">
                                <label className="form-label">Option Text *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={optionText}
                                    onChange={(e) => setOptionText(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Score</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={optionScore}
                                    onChange={(e) => setOptionScore(parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="flex gap-1">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowOptionModal(false)}>Cancel</button>
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
