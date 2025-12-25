import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTest, startSession, submitAnswer, finishSession, Question } from '../lib/api';

export default function RunTest() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [testInfo, setTestInfo] = useState<{ name: string; description?: string; warning?: string } | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showWarning, setShowWarning] = useState(true);

    useEffect(() => {
        loadTest();
    }, [id]);

    const loadTest = async () => {
        if (!id) return;

        try {
            const { test } = await getTest(parseInt(id));
            setTestInfo({
                name: test.name,
                description: test.description,
                warning: test.warning
            });
            setQuestions(test.questions || []);
        } catch (err) {
            setError('خطا در بارگذاری تست');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const result = await startSession(parseInt(id));
            setSessionId(result.sessionId);
            if (result.questions.length > 0) {
                setQuestions(result.questions);
            }
            setShowWarning(false);
        } catch (err) {
            setError('خطا در شروع تست');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = async (optionId: number) => {
        if (!sessionId) return;

        const currentQuestion = questions[currentQuestionIndex];
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));

        try {
            await submitAnswer(sessionId, currentQuestion.id, optionId);

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            }
        } catch (err) {
            setError('خطا در ثبت پاسخ');
            console.error(err);
        }
    };

    const handleFinish = async () => {
        if (!sessionId) return;

        setSubmitting(true);
        try {
            await finishSession(sessionId);
            navigate(`/results/${sessionId}`);
        } catch (err) {
            setError('خطا در پایان تست');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-error persian">
                    <span className="alert-icon">❌</span>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    // Show warning before starting
    if (showWarning && testInfo) {
        return (
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="card">
                    <h2>{testInfo.name}</h2>
                    {testInfo.description && (
                        <p className="persian" style={{ marginBottom: '1.5rem' }}>{testInfo.description}</p>
                    )}

                    {testInfo.warning && (
                        <div className="alert alert-warning persian">
                            <span className="alert-icon">⚠️</span>
                            <span>{testInfo.warning}</span>
                        </div>
                    )}

                    <div className="alert alert-info persian">
                        <span className="alert-icon">ℹ️</span>
                        <div>
                            <strong>نکات مهم:</strong>
                            <ul style={{ margin: '0.5rem 0 0 0', paddingRight: '1.5rem' }}>
                                <li>این تست شامل {questions.length} سوال است</li>
                                <li>هر سوال را با دقت بخوانید و صادقانه پاسخ دهید</li>
                                <li>در هر لحظه می‌توانید به سوالات قبلی برگردید</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleStartTest}
                        className="btn btn-primary btn-large btn-block"
                        style={{ marginTop: '1.5rem' }}
                    >
                        شروع تست →
                    </button>
                </div>
            </div>
        );
    }

    // Show test questions
    if (sessionId && questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        const allAnswered = Object.keys(answers).length === questions.length;

        return (
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="card">
                    {/* Progress */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                            <span className="text-muted">سوال {currentQuestionIndex + 1} از {questions.length}</span>
                            <span className="text-muted">{Math.round(progress)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {/* Question */}
                    <h3 className="persian" style={{ marginBottom: '1.5rem', lineHeight: '1.8', direction: 'rtl' }}>
                        {currentQuestion.text}
                    </h3>

                    {/* Options */}
                    <div className="options-list">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.id}
                                className={`option-btn ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}
                                onClick={() => handleSelectOption(option.id)}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                        <button
                            onClick={handlePrevious}
                            className="btn btn-secondary"
                            disabled={currentQuestionIndex === 0}
                        >
                            → قبلی
                        </button>

                        {isLastQuestion && allAnswered ? (
                            <button
                                onClick={handleFinish}
                                className="btn btn-primary btn-large"
                                disabled={submitting}
                            >
                                {submitting ? 'در حال پردازش...' : 'پایان و مشاهده نتیجه'}
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="btn btn-primary"
                                disabled={!answers[currentQuestion.id] || isLastQuestion}
                            >
                                بعدی ←
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
