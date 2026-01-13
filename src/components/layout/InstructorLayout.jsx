import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import {
  FaUserCircle,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBook,
  FaSignOutAlt,
  FaThLarge,
  FaList,
  FaCog,
  FaFileUpload,
} from "react-icons/fa";
import "../../styles/Dashboard.css";

const InstructorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const [userName, setUserName] = useState("");

  // fetch DB profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/api/users/me");
      setUserName(res.data.name);
    };
    fetchProfile();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">INSTRUCTOR PORTAL</h3>
        </div>

        <div className="sidebar-section-header">ACADEMIC OPS</div>

        <ul className="nav-links">
          <li
            className={`nav-item ${
              location.pathname.includes("dashboard") ? "active" : ""
            }`}
            onClick={() => navigate("/instructor/dashboard")}
          >
            <FaThLarge className="nav-icon" /> Dashboard
          </li>
          <li
            className={`nav-item ${
              location.pathname.includes("add-course") ? "active" : ""
            }`}
            onClick={() => navigate("/instructor/add-course")}
          >
            <FaFileUpload className="nav-icon" /> Add Course
          </li>
        </ul>

        <div className="sidebar-section-header">MANAGEMENT</div>

        <ul className="nav-links">
          <li
            className={`nav-item ${
              location.pathname.includes("courses") ? "active" : ""
            }`}
            onClick={() => navigate("/instructor/courses")}
          >
            <FaList className="nav-icon" /> My Courses
          </li>
          <li
            className={`nav-item ${
              location.pathname.includes("exams") ? "active" : ""
            }`}
            onClick={() => navigate("/instructor/exams")}
          >
            <FaBook className="nav-icon" /> Exams
          </li>
        </ul>

        <div className="sidebar-section-header">SETTINGS</div>

        <ul className="nav-links">
          <li
            className={`nav-item ${
              location.pathname.includes("settings") ? "active" : ""
            }`}
            onClick={() => navigate("/instructor/settings")}
          >
            <FaCog className="nav-icon" /> Settings
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="page-title">
            <h2>Instructor Dashboard</h2>
          </div>
          <div className="user-profile-section">
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">Instructor</span>
            </div>
            <FaUserCircle className="user-avatar" />
            <button
              onClick={handleLogout}
              className="logout-btn"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InstructorLayout;
