import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaBuilding,
  FaMoneyBillWave,
  FaClock,
  FaExclamationTriangle,
  FaChartPie,
  FaChartBar,
  FaChartLine,
  FaUserTie,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { auth } from "../../auth/firebase";
import api from "../../api/axios";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingCourses: 0,
    totalInstructors: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

 const fetchStats = async () => {
    try {
      setLoading(true);

      if (!auth.currentUser) {
        throw new Error("Not authenticated");
      }

      const token = await auth.currentUser.getIdToken();

      const res = await api.get("/api/admin/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div>
      <div className="admin-welcome" style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#1f2937" }}>Admin Overview</h2>
        <p style={{ color: "#6b7280" }}>Manage your LMS ecosystem from here.</p>
      </div>

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        <div className="stat-card blue">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span className="stat-label">Total Students</span>
              <div className="stat-number">{stats.totalStudents}</div>
            </div>
            <div className="icon-circle blue">
              <FaUserTie size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card yellow">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span className="stat-label">Pending Courses</span>
              <div className="stat-number">{stats.pendingCourses}</div>
            </div>
            <div className="icon-circle yellow">
              <FaExclamationTriangle size={20} />
            </div>
          </div>
          {stats.pendingCourses > 0 && (
            <div
              style={{ fontSize: "0.8rem", color: "#ca8a04", marginTop: "5px" }}
            >
              Action Required
            </div>
          )}
        </div>

        <div className="stat-card indigo">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span className="stat-label">Instructors</span>
              <div className="stat-number">{stats.totalInstructors}</div>
            </div>
            <div className="icon-circle indigo">
              <FaChalkboardTeacher size={20} />
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: "2rem", marginBottom: "1rem", color: "#374151" }}>
        Quick Actions
      </h3>
      <div
        className="action-buttons-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => navigate("/admin/add-instructor")}
          className="btn-action"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            height: "auto",
            justifyContent: "center",
          }}
        >
          <div className="icon-circle indigo" style={{ marginBottom: "5px" }}>
            <FaChalkboardTeacher size={24} />
          </div>
          <span>Add Instructor</span>
        </button>

        <button
          onClick={() => navigate("/admin/approve-courses")}
          className="btn-action"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            height: "auto",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div className="icon-circle yellow" style={{ marginBottom: "5px" }}>
            <FaClock size={24} />
          </div>
          <span>Approve Courses</span>
          {stats.pendingCourses > 0 && (
            <span
              className="badge-count"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#ef4444",
                color: "white",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "0.8rem",
              }}
            >
              {stats.pendingCourses}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/admin/assign-course")}
          className="btn-action"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            height: "auto",
            justifyContent: "center",
          }}
        >
          <div className="icon-circle blue" style={{ marginBottom: "5px" }}>
            <FaUserTie size={24} />
          </div>
          <span>Assign Content</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
