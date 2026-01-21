import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  FaUserCircle,
  FaBuilding,
  FaThLarge,
  FaSignOutAlt,
  FaCog,
  FaPlusCircle,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaUserGraduate,
  FaUsers,
  FaBars,
} from "react-icons/fa";
import markLogo from "../../assets/just_logo.jpeg";
import "../../styles/Dashboard.css";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/axios";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const [adminName, setAdminName] = useState("");

  // fetch DB profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/api/users/me");
      setAdminName(res.data.name);
    };
    fetchProfile();
  }, []);

  return (
    <div className="dashboard-container bg-background-muted text-slate-900">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={markLogo} alt="SHNOOR International" />
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">SHNOOR</span>
              <span className="sidebar-brand-subtitle">International</span>
            </div>
          </div>
        </div>

        <div className="sidebar-section-header">MAIN MENU</div>

        <ul className="nav-links">
          <li
            className={`nav-item ${location.pathname.includes("dashboard") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/dashboard");
              setIsSidebarOpen(false);
            }}
          >
            <FaThLarge className="nav-icon" /> Dashboard
          </li>

          <li
            className={`nav-item ${location.pathname.includes("add-instructor") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/add-instructor");
              setIsSidebarOpen(false);
            }}
          >
            <FaChalkboardTeacher className="nav-icon" /> Add Instructor
          </li>
        </ul>

        <div className="sidebar-section-header">MANAGEMENT</div>
        <ul className="nav-links">
          <li
            className={`nav-item ${location.pathname.includes("manage-users") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/manage-users");
              setIsSidebarOpen(false);
            }}
          >
            <FaUsers className="nav-icon" /> Manage Users
          </li>

          <li
            className={`nav-item ${location.pathname.includes("approve-courses") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/approve-courses");
              setIsSidebarOpen(false);
            }}
          >
            <FaCheckCircle className="nav-icon" /> Approve Courses
          </li>

          <li
            className={`nav-item ${location.pathname.includes("assign-course") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/assign-course");
              setIsSidebarOpen(false);
            }}
          >
            <FaUserGraduate className="nav-icon" /> Assign Courses
          </li>

          <li
            className={`nav-item ${location.pathname.includes("approve-users") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/approve-users");
              setIsSidebarOpen(false);
            }}
          >
            <FaUserCircle className="nav-icon" /> Approve Users
          </li>

          <li
            className={`nav-item ${location.pathname.includes("certificates") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/certificates");
              setIsSidebarOpen(false);
            }}
          >
            <FaCog className="nav-icon" /> Certificates
          </li>

          <li
            className={`nav-item ${location.pathname.includes("profile-management") ? "active" : ""}`}
            onClick={() => {
              navigate("/admin/profile-management");
              setIsSidebarOpen(false);
            }}
          >
            <FaCog className="nav-icon" /> Settings
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="flex items-center gap-3">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FaBars />
            </button>
            <div className="page-title">
              <h2 className="text-lg font-semibold text-primary">
                Admin Console
              </h2>
            </div>
          </div>

          <div className="user-profile-section">
            <div className="user-info">
              <span className="user-name">{adminName}</span>
              <span className="user-role">Super Admin</span>
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

export default AdminLayout;
