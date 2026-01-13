import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookReader,
  FaStar,
  FaFire,
  FaMedal,
  FaPlayCircle,
  FaTrophy,
  FaBolt,
  FaClock,
  FaExclamationCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import api from "../../api/axios";
import "../../styles/Dashboard.css";
import "../../styles/Student.css";
import "../../styles/StudentGrid.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [enrolledcount, setEnrolledCount] = useState(0);
  const [lastCourse, setLastCourse] = useState(null);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [gamification, setGamification] = useState({
    xp: 0,
    rank: "Novice",
    streak: 0,
    progress: 0,
    nextLevelXP: 100,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/student/dashboard");

        setEnrolledCount(res.data.enrolled_count);

        setGamification({
          xp: res.data.xp,
          streak: res.data.streak,
          rank:
            res.data.xp >= 500
              ? "Expert"
              : res.data.xp >= 200
              ? "Intermediate"
              : "Novice",
          progress: Math.min((res.data.xp / 500) * 100, 100),
          nextLevelXP: 500,
        });

        if (res.data.last_learning) {
          setLastCourse(res.data.last_learning);
        } else {
          setLastCourse(null);
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchDashboard();
  }, []);

  const [studentName, setStudentName] = useState("");

  // fetch DB profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/api/users/me");
      setStudentName(res.data.name);
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <div className="student-welcome flex justify-between items-start">
        <div>
          <h2>Welcome back, {studentName}! 👋</h2>
          <p>Ready to level up? You have {enrolledcount} active courses.</p>
        </div>
        <div
          onClick={() => navigate("/student/leaderboard")}
          className="bg-white p-3 rounded-xl shadow-sm border border-indigo-100 items-center gap-4 cursor-pointer hover:shadow-md transition-all hidden md:flex"
          style={{ minWidth: "200px", justifyContent: "space-between" }}
        >
          <div className="flex flex-col items-end grow">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Current Rank
            </div>
            <div className="text-indigo-600 font-bold whitespace-nowrap">
              {gamification.rank}
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
            <FaTrophy />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div
          className="stat-card cursor-pointer transform transition hover:-translate-y-1 relative overflow-hidden"
          onClick={() => navigate("/student/leaderboard")}
          style={{ borderLeft: "4px solid #8b5cf6" }}
        >
          <div className="flex-between-center z-10 relative">
            <div>
              <span className="stat-label flex items-center gap-1">
                <FaBolt className="text-yellow-500" /> Daily Streak
              </span>
              <div className="stat-number flex items-end gap-2 text-gray-800">
                {gamification.streak}{" "}
                <span className="text-sm text-gray-400 font-normal mb-1">
                  days
                </span>
              </div>
            </div>
            <div className="student-stat-icon-red bg-orange-50 text-orange-500">
              <FaFire size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>XP Progress</span>
              <span>
                {gamification.xp} / {gamification.nextLevelXP}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${gamification.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card student-stat-card-gold">
          <div className="flex-between-center">
            <div>
              <span className="stat-label">Enrolled Courses</span>
              <div className="stat-number">{enrolledcount}</div>
            </div>
            <div className="student-stat-icon-gold">
              <FaBookReader size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card student-stat-card-purple">
          <div className="flex-between-center">
            <div>
              <span className="stat-label">Assignments</span>
              <div className="stat-number">{assignmentsCount}</div>
            </div>
            <div className="student-stat-icon-purple">
              <FaMedal size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="deadlines-section">
        <h3 className="section-title">Upcoming Deadlines</h3>
        <div className="deadlines-grid">
          <div
            className="deadline-card"
            onClick={() => navigate("/student/course/mock1/learn")}
          >
            <div className="deadline-icon urgent">
              <FaExclamationCircle />
            </div>
            <div className="deadline-info">
              <h4>React Final Project</h4>
              <p>Web Development</p>
              <span className="deadline-date urgent-text">
                Due: Tomorrow, 11:59 PM
              </span>
            </div>
          </div>

          <div
            className="deadline-card"
            onClick={() => navigate("/student/course/mock5/learn")}
          >
            <div className="deadline-icon medium">
              <FaClock />
            </div>
            <div className="deadline-info">
              <h4>DevOps Pipeline Quiz</h4>
              <p>DevOps</p>
              <span className="deadline-date">Due: Jan 15, 2026</span>
            </div>
          </div>

          <div
            className="deadline-card"
            onClick={() => navigate("/student/course/mock3/learn")}
          >
            <div className="deadline-icon normal">
              <FaCalendarAlt />
            </div>
            <div className="deadline-info">
              <h4>UX Research Paper</h4>
              <p>Design</p>
              <span className="deadline-date">Due: Jan 20, 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-between-center" style={{ marginBottom: "20px" }}>
        <h3 className="section-title" style={{ margin: 0 }}>
          Continue Watching
        </h3>
        <button
          className="btn-secondary"
          onClick={() => navigate("/student/courses")}
        >
          My Learning
        </button>
      </div>

      {lastCourse ? (
        <div
          style={{
            background: "linear-gradient(to right, #1e3a8a, #3b82f6)",
            borderRadius: "12px",
            padding: "30px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.5rem" }}>
              Jump back in!
            </h3>
            <p style={{ margin: "0 0 20px 0", opacity: 0.9 }}>
              Continue where you left off.
            </p>
            <button
              className="btn-primary"
              style={{ background: "white", color: "#1e3a8a", border: "none" }}
              onClick={() =>
                navigate(
                  `/student/course/${lastCourse.courseId}`
                )
              }
            >
              <FaPlayCircle style={{ marginRight: "8px" }} /> Resume Course
            </button>
          </div>
          <div style={{ opacity: 0.2 }}>
            <FaPlayCircle size={100} />
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: "white",
            borderRadius: "12px",
            border: "1px dashed #e5e7eb",
            color: "#6b7280",
          }}
        >
          <p>You haven't started any courses yet.</p>
          <button
            className="btn-primary mt-sm"
            onClick={() => navigate("/student/courses")}
          >
            Browse Catalog
          </button>
        </div>
      )}
    </div>
  );
};
export default StudentDashboard;
