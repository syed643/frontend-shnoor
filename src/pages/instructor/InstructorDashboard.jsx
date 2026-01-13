
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaPlus, FaChalkboardTeacher, FaEdit, FaTrash, FaClipboardList, FaCheckCircle, FaTimesCircle, FaChartLine, FaTasks, FaCalendarAlt } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../auth/firebase';
import '../../styles/Dashboard.css';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    pendingApproval: 0,
    liveCourses: 0,
    rejectedCourses: 0,
    totalStudents: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCourses(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCourses = async (uid) => {
    try {
      setTimeout(() => {
        const fetchedCourses = [
          { id: '1', title: 'Introduction to React', createdAt: new Date().toISOString(), status: 'published', instructorId: uid },
          { id: '2', title: 'Advanced NodeJS', createdAt: new Date().toISOString(), status: 'pending_approval', instructorId: uid },
          { id: '3', title: 'Python for Beginners', createdAt: new Date().toISOString(), status: 'draft', instructorId: uid }
        ];
        setCourses(fetchedCourses);
        setStats({
          totalCourses: 3,
          pendingApproval: 1,
          liveCourses: 1,
          rejectedCourses: 0,
          totalStudents: 150
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        setStats(prev => ({ ...prev, totalCourses: prev.totalCourses - 1 }));
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course.");
      }
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="flex-between-center">
            <div>
              <span className="stat-label">Total Courses</span>
              <div className="stat-number">{stats.totalCourses}</div>
            </div>
            <div className="icon-circle blue"><FaBook size={20} /></div>
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="flex-between-center">
            <div>
              <span className="stat-label">Pending Approval</span>
              <div className="stat-number">{stats.pendingApproval}</div>
            </div>
            <div className="icon-circle yellow"><FaTasks size={20} /></div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="flex-between-center">
            <div>
              <span className="stat-label">Live Courses</span>
              <div className="stat-number">{stats.liveCourses}</div>
            </div>
            <div className="icon-circle green"><FaChartLine size={20} /></div>
          </div>
        </div>
        <div className="stat-card red">
          <div className="flex-between-center">
            <div>
              <span className="stat-label">Rejected</span>
              <div className="stat-number">{stats.rejectedCourses}</div>
            </div>
            <div className="icon-circle red"><FaCalendarAlt size={20} /></div>
          </div>
        </div>
      </div>

      <div className="actions-grid">
        <button onClick={() => navigate('/instructor/add-course')} className="btn-action"><FaPlus /> Create New Course</button>
      </div>

      <h3 className="section-title">My Courses</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-table-cell">No courses found. Start creating!</td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id}>
                  <td style={{ fontWeight: '500' }}>{course.title}</td>
                  <td>{course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${course.status === 'published' ? 'active' : course.status === 'pending_approval' ? 'pending' : 'neutral'}`}>
                      {course.status ? course.status.replace('_', ' ').toUpperCase() : 'DRAFT'}
                    </span>
                  </td>
                  <td>
                    <div className="flex-center-gap">
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`/instructor/add-course?edit=${course.id}`)}
                        title="Edit Course"
                      >
                        <FaEdit color="#003366" />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`/instructor/add-exam/${course.id}`)}
                        title="Manage Exam"
                      >
                        <FaTasks color="#d97706" />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(course.id)}
                        title="Delete Course"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorDashboard;