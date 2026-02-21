import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import ExamRunnerView from "./view.jsx";
import api from "../../../api/axios";
import { onAuthStateChanged } from "firebase/auth";
import useExamSecurity from "../../../hooks/useExamSecurity";
import { io } from "socket.io-client";



const ExamRunner = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  // New state for drift-proof timer
  const [startTime, setStartTime] = useState(null);
  const [isExamLocked, setIsExamLocked] = useState(false);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  /* =========================
     LOAD EXAM FROM BACKEND
  ========================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Use cached token to avoid Firebase quota issues
        const token = await user.getIdToken(false);

        const res = await api.get(
          `/api/student/exams/${examId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const examData = res.data;
        setExam(examData);

        // Timer Logic Initialization
        if (examData.duration > 0) {
          // 1. Try to get start time from backend (not currently available, but ready for future)
          // 2. Fallback to localStorage
          const storageKey = `exam_start_${examId}_${user.uid}`;
          const storedStart = localStorage.getItem(storageKey);

          let effectiveStart;
          if (examData.started_at) {
            effectiveStart = new Date(examData.started_at).getTime();
          } else if (storedStart) {
            effectiveStart = parseInt(storedStart, 10);
          } else {
            effectiveStart = Date.now();
            localStorage.setItem(storageKey, effectiveStart.toString());
          }

          setStartTime(effectiveStart);

          // Initial calculation for immediate UI feedback
          const durationMs = examData.duration * 60 * 1000;
          const targetEndTime = effectiveStart + durationMs;
          const secondsRemaining = Math.floor((targetEndTime - Date.now()) / 1000);

          setTimeLeft(Math.max(0, secondsRemaining));
        }

      } catch (err) {
        console.error("Failed to load exam:", err);

        const status = err.response?.status;

        if (status === 403) {
          alert("You are not enrolled in this exam.");
          navigate("/student/exams");
        } else if (status === 404) {
          alert("Exam not found.");
          navigate("/student/exams");
        } else {
          alert("Unable to load exam.");
          navigate(-1);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [examId, navigate]);

  /* =========================
   SOCKET CONNECTION
========================= */
useEffect(() => {
  if (!exam || isSubmitted) return;

  const connectSocket = async () => {
    try {
      // Use cached token for socket connection
      const token = await auth.currentUser.getIdToken(false);

      const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity
      });

      socketRef.current = socket;

      // Initial connection
      socket.on("connect", () => {
        console.log("🔌 Connected to server, socket ID:", socket.id);
        console.log("📝 Emitting exam:start for examId:", examId);

        socket.emit("exam:start", {
          examId: examId
        });
      });

      // Handle reconnection
      socket.io.on("reconnect", (attempt) => {
        console.log("✅ Reconnected after", attempt, "attempts");
        console.log("📝 Re-emitting exam:start for examId:", examId);
        
        socket.emit("exam:start", {
          examId: examId
        });
      });

      // Handle disconnection
      socket.on("disconnect", (reason) => {
        console.warn("❌ Disconnected from server. Reason:", reason);
        if (reason === "io server disconnect") {
          // Server disconnected, need to reconnect manually
          socket.connect();
        }
      });

      // Handle connection error
      socket.on("connect_error", (error) => {
        console.error("🚫 Connection error:", error.message);
      });

      // Handle auto-submit event from server
      socket.on("exam:autoSubmitted", (data) => {
        console.log("🚨 Received exam:autoSubmitted event:", data);
        alert("Exam auto-submitted due to disconnection.");
        setIsExamLocked(true);
        setIsSubmitted(true);
      });

    } catch (error) {
      console.error("Socket connection error:", error);
    }
  };

  connectSocket();

  return () => {
    if (socketRef.current) {
      console.log("🔌 Disconnecting socket...");
      socketRef.current.disconnect();
    }
  };

}, [exam, examId, isSubmitted]);


  /* =========================
     DRIFT-PROOF TIMER
  ========================= */
  useEffect(() => {
    if (!exam || isSubmitted || exam.duration === 0 || !startTime || isExamLocked) return;

    const durationMs = exam.duration * 60 * 1000;
    const targetEndTime = startTime + durationMs;

    const timer = setInterval(() => {
      const now = Date.now();
      const secondsRemaining = Math.floor((targetEndTime - now) / 1000);

      if (secondsRemaining <= 0) {
        setTimeLeft(0);
        setIsExamLocked(true); // Lock the exam locally
        clearInterval(timer);
        handleSubmit(); // Trigger auto-submit
      } else {
        setTimeLeft(secondsRemaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, startTime, isSubmitted, isExamLocked]);

  const formatTime = (seconds) => {
    if (seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    }
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* =========================
     ANSWER HANDLING
     (KEYED BY QUESTION_ID)
  ========================= */
const handleAnswer = async (question, value) => {
  if (isExamLocked || isSubmitted) return;

  setAnswers(prev => ({
    ...prev,
    [question.id]: value
  }));

  try {
    // Use cached token to avoid quota issues during answer saving
    const token = await auth.currentUser.getIdToken(false);

    if (question.type === "mcq") {
      console.log("💾 Saving MCQ answer:", { questionId: question.id, optionId: value });
      
      const response = await api.post(
        `/api/exams/${examId}/save-answer`,
        {
          questionId: question.id,
          selectedOptionId: value
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("✅ MCQ answer saved:", response.data);
    } else {
      console.log("💾 Saving text answer:", { questionId: question.id, textLength: value?.length });
      
      const response = await api.post(
        `/api/exams/${examId}/save-answer`,
        {
          questionId: question.id,
          answerText: value
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("✅ Text answer saved:", response.data);
    }
  } catch (error) {
    console.error("❌ Failed to save answer:", {
      questionId: question.id,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Don't block the UI, but log the error
    // The answer is still stored locally in state
  }
};



  /* =========================
     SUBMIT EXAM (BACKEND)
  ========================= */
  const handleSubmit = async () => {
    try {
      if (isSubmitted) return;

      // Use cached token to avoid Firebase quota issues
      const token = await auth.currentUser.getIdToken(false);

      console.log("📤 Submitting exam...", {
        examId,
        answersCount: Object.keys(answersRef.current).length,
        answers: answersRef.current
      });

      const res = await api.post(
        `/api/exam/${examId}/submit`,
        { answers: answersRef.current },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Exam submitted successfully:", res.data);

      setResult(res.data);
      setIsSubmitted(true);

      // Cleanup local storage on successful submit
      const storageKey = `exam_start_${examId}_${auth.currentUser.uid}`;
      localStorage.removeItem(storageKey);

    } catch (err) {
      console.error("❌ Exam submission failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        error: err
      });

      // Show user-friendly error message
      const errorMessage = err.response?.data?.message || "Failed to submit exam. Please try again.";
      
      // If it failed because already submitted, assume success state locally to prevent retries
      if (err.response?.status === 400 && err.response?.data?.message === "Exam already submitted") {
        alert("This exam has already been submitted.");
        setIsSubmitted(true);
      } else if (err.message?.includes('auth/quota-exceeded')) {
        alert('Firebase quota exceeded. Please try again in a few minutes or contact support.');
      } else {
        alert(`Submission Error: ${errorMessage}`);
      }
    }
  };

  /* =========================
     EXAM SECURITY HOOK
  ========================= */
  const [securityModal, setSecurityModal] = useState({
    open: false,
    type: 'tab-switch', // 'tab-switch' | 'copy-paste'
    count: 0
  });

  const handleSecurityWarning = (type, count) => {
    setSecurityModal({
      open: true,
      type: type,
      count: count
    });
  };

  const handleResumeExam = () => {
    setSecurityModal(prev => ({ ...prev, open: false }));
    // Re-trigger fullscreen just in case
    triggerFullscreen();
  };

  // Only enable security if exam is loaded and NOT submitted and NOT practice
  const { securityHandlers, triggerFullscreen, isTerminated } = useExamSecurity(handleSubmit, handleSecurityWarning);


  return (
    <ExamRunnerView
      loading={loading}
      exam={exam}
      currentQIndex={currentQIndex}
      setCurrentQIndex={setCurrentQIndex}
      answers={answers}
      handleAnswer={handleAnswer}
      timeLeft={timeLeft}
      isSubmitted={isSubmitted}
      result={result}
      handleSubmit={handleSubmit}
      formatTime={formatTime}
      navigate={navigate}
      securityHandlers={securityHandlers}
      triggerFullscreen={triggerFullscreen}
      securityModal={securityModal}
      handleResumeExam={handleResumeExam}
      isExamLocked={isExamLocked}
      isTerminated={isTerminated}
    />
  );
};

export default ExamRunner;