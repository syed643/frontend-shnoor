import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { FaUserCircle, FaBuilding, FaThLarge, FaSignOutAlt, FaCog, FaPlusCircle, FaChalkboardTeacher, FaCheckCircle, FaUserGraduate } from 'react-icons/fa';
import logo from '../../assets/SHnoor_logo_1.jpg';
import '../../styles/Dashboard.css';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../api/axios';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
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
            <div className="sidebar">
                <div className="sidebar-header" style={{ justifyContent: 'center', padding: '10px' }}>
                    <img src={logo} alt="Shnoor Logo" style={{ maxWidth: '80%', maxHeight: '50px', borderRadius: '4px' }} />
                </div>

                <div className="sidebar-section-header">
                    MAIN MENU
                </div>

                <ul className="nav-links">
                    <li
                        className={`nav-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        <FaThLarge className="nav-icon" /> Dashboard
                    </li>

                    <li
                        className={`nav-item ${location.pathname.includes('add-instructor') ? 'active' : ''}`}
                        onClick={() => navigate('/admin/add-instructor')}
                    >
                        <FaChalkboardTeacher className="nav-icon" /> Add Instructor
                    </li>
                </ul>

                <div className="sidebar-section-header">
                    MANAGEMENT
                </div>

                <ul className="nav-links">
                    <li
                        className={`nav-item ${location.pathname.includes('approve-courses') ? 'active' : ''}`}
                        onClick={() => navigate('/admin/approve-courses')}
                    >
                        <FaCheckCircle className="nav-icon" /> Approve Courses
                    </li>
                    <li
                        className={`nav-item ${location.pathname.includes('assign-course') ? 'active' : ''}`}
                        onClick={() => navigate('/admin/assign-course')}
                    >
                        <FaUserGraduate className="nav-icon" /> Assign Courses
                    </li>
                    <li
                        className={`nav-item ${location.pathname.includes('approve-users') ? 'active' : ''}`}
                        onClick={() => navigate('/admin/approve-users')}
                    >
                        <FaUserCircle className="nav-icon" /> Approve Users
                    </li>
                    <li
                        className={`nav-item ${location.pathname.includes('certificates') ? 'active' : ''}`}
                        onClick={() => navigate('/admin/certificates')}
                    >
                        <FaCog className="nav-icon" /> Certificates
                    </li>



                    <li
                        className={`nav-item ${location.pathname.includes('profile-management') ? 'active' : ''}`}
                        onClick={() => navigate('/admin/profile-management')}
                    >
                        <FaCog className="nav-icon" /> Settings
                    </li>
                </ul>
            </div>

            <div className="main-content">
                <div className="top-bar">
                    <div className="page-title">
                        <h2>Admin Console</h2>
                    </div>

                    <div className="user-profile-section">
                        <div className="user-info">
                            <span className="user-name">{adminName}</span>
                            <span className="user-role">Super Admin</span>
                        </div>
                        <FaUserCircle className="user-avatar" />
                        <button onClick={handleLogout} className="logout-btn" title="Logout">
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
