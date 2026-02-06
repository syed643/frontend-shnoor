import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import ExamRunnerView from "./view.jsx";
import api from "../../../api/axios";
import { onAuthStateChanged } from "firebase/auth";

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
  const [submitting, setSubmitting] = useState(false);

  // refs to avoid stale closures in interval/submit
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* =========================
     LOAD EXAM FROM BACKEND (with auth guard)
  ========================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await api.get(`/api/student/exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mountedRef.current) return;
        setExam(res.data);

        if (typeof res.data.duration === "number" && res.data.duration > 0) {
          // duration assumed in minutes
          setTimeLeft(res.data.duration * 60);
        }
      } catch (err) {
        console.error("Failed to load exam:", err);
        if (!mountedRef.current) return;

        const status = err?.response?.status;
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
        if (mountedRef.current) setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [examId, navigate]);

  /* =========================
     TIMER (single interval, stable submit)
  ========================= */
  // keep a stable submit function that uses answersRef
  const submitExam = useCallback(async () => {
    if (isSubmitted || submitting) return;
    setSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You are not authenticated. Please login again.");
        navigate("/login");
        return;
      }

      const token = await user.getIdToken(true);

      const res = await api.post(
        `/api/exam/${examId}/submit`,
        { answers: answersRef.current },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!mountedRef.current) return;
      setResult(res.data);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Exam submission failed:", err);
      if (mountedRef.current) {
        alert(err?.response?.data?.message || "Submission failed");
      }
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  }, [examId, navigate, isSubmitted, submitting]);

  useEffect(() => {
    if (!exam || isSubmitted) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // finalize and clear
          clearInterval(timer);
          // call stable submit function
          submitExam().catch((e) => console.error("submit in timer failed", e));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // only recreate interval when exam or isSubmitted changes
  }, [exam, isSubmitted, submitExam, timeLeft]);

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* =========================
     ANSWER HANDLING
     (KEYED BY QUESTION_ID)
  ========================= */
  const handleAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      answersRef.current = next;
      return next;
    });
  }, []);

  // warn if user tries to close or reload while exam in progress
  useEffect(() => {
    const handler = (e) => {
      if (isSubmitted) return;
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = "Are you sure you want to leave? Your answers may not be saved.";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isSubmitted]);

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
      handleSubmit={submitExam}
      formatTime={formatTime}
      navigate={navigate}
      submitting={submitting}
    />
  );
};

export default ExamRunner;