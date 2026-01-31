import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import StudentDashboardView from "./view";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [enrolledcount, setEnrolledCount] = useState(0);
  const [lastCourse, setLastCourse] = useState(null);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [deadlines, setDeadlines] = useState([]);

  const [gamification, setGamification] = useState({
    xp: 0,
    rank: "Novice",
    streak: 0,
    progress: 0,
    nextLevelXP: 100,
  });

  // Fetch dashboard data
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

        setLastCourse(res.data.last_learning || null);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get("/api/student/recommendations");
        const freeCourses = res.data.filter((c) => c.price_type === "free");

        const mapped = freeCourses.map((c) => ({
          id: c.courses_id || c.courses_id,
          title: c.title,
          course: c.category || c.description || "",
          due: c.created_at ? new Date(c.created_at).toLocaleDateString() : "Available now",
          isUrgent: false,
        }));

        setDeadlines(mapped);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      }
    };

    fetchRecommendations();
  }, []);

  // Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/me");
        setStudentName(res.data.name);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <StudentDashboardView
      navigate={navigate}
      enrolledCount={enrolledcount}
      lastCourse={lastCourse}
      assignmentsCount={assignmentsCount}
      studentName={studentName}
      gamification={gamification}
      deadlines={deadlines}
    />
  );
};

export default StudentDashboard;