import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaCheck, FaAngleLeft, FaAngleRight, FaTimesCircle, FaTrophy } from 'react-icons/fa';
import { auth } from '../../auth/firebase';
import '../../styles/Dashboard.css';

const ExamRunner = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (!auth.currentUser) return;

            try {

                const mockAssessment = {
                    title: 'Mock Final Exam',
                    questions: [
                        { id: 1, text: 'What is React?', type: 'mcq', options: ['Library', 'Framework', 'Language'], correctAnswer: 'Library', marks: 5 },
                        { id: 2, text: 'What does JSX stands for?', type: 'mcq', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Xylophone'], correctAnswer: 'JavaScript XML', marks: 5 },
                        { id: 3, text: 'Hooks were introduced in which version?', type: 'mcq', options: ['16.8', '15.0', '17.0'], correctAnswer: '16.8', marks: 5 },
                        { id: 4, text: 'Which method is used for side effects?', type: 'mcq', options: ['useEffect', 'useState', 'useReducer'], correctAnswer: 'useEffect', marks: 5 },
                        { id: 5, text: 'How do you pass data to child components?', type: 'mcq', options: ['Props', 'State', 'Context'], correctAnswer: 'Props', marks: 5 }
                    ],
                    duration: 30
                };
                setAssessment(mockAssessment);
                setTimeLeft((mockAssessment.duration || 30) * 60);

                setTimeout(() => {
                    setAuthorized(true);
                    setEnrollmentId('mock-enrollment-id');
                    setLoading(false);
                }, 800);

            } catch (err) {
                console.error("Error initializing exam:", err);
                setLoading(false);
            }
        };

        init();
    }, [examId, navigate]);

    useEffect(() => {
        if (!authorized || isSubmitted || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted, authorized]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAnswer = (val) => {
        setAnswers(prev => ({ ...prev, [currentQIndex]: val }));
    };

    const calculateScore = () => {
        let gainedPoints = 0;
        let totalPoints = 0;

        assessment.questions.forEach((q, index) => {
            const pointVal = q.marks || 1;
            totalPoints += pointVal;
            if (answers[index] === q.correctAnswer) {
                gainedPoints += pointVal;
            }
        });

        const perc = Math.round((gainedPoints / totalPoints) * 100);
        return { gainedPoints, perc };
    };

    const handleSubmit = async () => {
        const { gainedPoints, perc } = calculateScore();
        setScore(gainedPoints);
        setPercentage(perc);
        setIsSubmitted(true);
    };

    if (loading) return <div className="p-8">Loading Exam...</div>;
    if (!authorized) return <div className="p-8">Verifying access...</div>;

    if (isSubmitted) {
        const passed = percentage >= 70;
        return (
            <div className="content-area" style={{ textAlign: 'center', padding: '50px', maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '12px', marginTop: '50px' }}>
                {passed ? (
                    <div style={{ color: '#059669' }}>
                        <FaTrophy size={60} style={{ marginBottom: '20px', color: '#fbbf24' }} />
                        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Congratulations!</h2>
                        <p style={{ fontSize: '1.2rem', color: '#374151' }}>You passed with <strong>{percentage}%</strong>.</p>
                        <p className="mb-6">You are now certified.</p>
                        <button
                            className="btn-primary"
                            style={{ fontSize: '1.1rem', padding: '12px 24px' }}
                            onClick={() => navigate('/student/certificate')}
                        >
                            View Certificate
                        </button>
                    </div>
                ) : (
                    <div style={{ color: '#dc2626' }}>
                        <FaTimesCircle size={60} style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Exam Failed</h2>
                        <p style={{ fontSize: '1.2rem', color: '#374151' }}>You scored <strong>{percentage}%</strong>. You need 70% to pass.</p>
                        <p className="mb-6">Don't give up! Review the course material and try again.</p>
                        <button
                            className="btn-secondary"
                            style={{ fontSize: '1.1rem', padding: '12px 24px' }}
                            onClick={() => window.location.reload()}
                        >
                            Retake Exam
                        </button>
                    </div>
                )}
                <div style={{ marginTop: '20px' }}>
                    <button className="btn-secondary" onClick={() => navigate('/student/dashboard')}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const currentQ = assessment.questions[currentQIndex];

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#f3f4f6', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>

            <div style={{ height: '60px', background: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{assessment.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: timeLeft < 300 ? '#ef4444' : 'white' }}>
                        <FaClock /> {formatTime(timeLeft)}
                    </span>
                    <button className="btn-primary" style={{ padding: '5px 15px', background: '#ef4444' }} onClick={handleSubmit}>Finish Test</button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                <div style={{ width: '250px', background: 'white', borderRight: '1px solid #e5e7eb', padding: '20px', overflowY: 'auto' }}>
                    <h4 style={{ marginTop: 0 }}>Questions</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {assessment.questions.map((q, idx) => (
                            <button
                                key={q.id || idx}
                                onClick={() => setCurrentQIndex(idx)}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: idx === currentQIndex ? '#1e293b' : answers[idx] ? '#dcfce7' : 'white',
                                    color: idx === currentQIndex ? 'white' : 'inherit',
                                    cursor: 'pointer'
                                }}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    {currentQ ? (
                        <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#374151' }}>Question {currentQIndex + 1}</span>
                                <span className="status-badge neutral">{currentQ.marks || 1} Marks</span>
                            </div>

                            <div style={{ fontSize: '1.05rem', marginBottom: '25px', lineHeight: '1.6' }}>
                                {currentQ.text}
                            </div>

                            {currentQ.type === 'mcq' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {currentQ.options.map((opt, i) => (
                                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', background: answers[currentQIndex] === opt ? '#f0f9ff' : 'white', borderColor: answers[currentQIndex] === opt ? '#003366' : '#e5e7eb' }}>
                                            <input
                                                type="radio"
                                                name={`q-${currentQ.id || currentQIndex}`}
                                                value={opt}
                                                checked={answers[currentQIndex] === opt}
                                                onChange={() => handleAnswer(opt)}
                                                style={{ width: '20px', height: '20px' }}
                                            />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                                <button
                                    className="btn-secondary"
                                    disabled={currentQIndex === 0}
                                    onClick={() => setCurrentQIndex(prev => prev - 1)}
                                >
                                    <FaAngleLeft /> Previous
                                </button>
                                {currentQIndex < assessment.questions.length - 1 ? (
                                    <button
                                        className="btn-primary"
                                        onClick={() => setCurrentQIndex(prev => prev + 1)}
                                    >
                                        Next <FaAngleRight />
                                    </button>
                                ) : (
                                    <button className="btn-primary" style={{ background: '#ef4444' }} onClick={handleSubmit}>Submit Test</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>No questions in this assessment.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamRunner;