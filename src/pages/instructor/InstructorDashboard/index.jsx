import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../auth/firebase';
import api from '../../../api/axios';
import InstructorDashboardView from './view';

export const InstructorDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        myCourses: 0,
        totalStudents: 0,
        avgRating: 0
    });
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Instructor');
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const token = await auth.currentUser.getIdToken(true);

        const [courseRes, studentRes] = await Promise.all([
          api.get("/api/courses/instructor/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/assignments/instructor/students/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          myCourses: Number(courseRes.data.total_courses),
          totalStudents: Number(studentRes.data.total_students),
          avgRating: 4.8, // keep static
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) fetchDashboardStats();
  }, []);


    return (
        <InstructorDashboardView
            loading={loading}
            userName={userName}
            stats={stats}
            navigate={navigate}
        />
    );
};

export default InstructorDashboard;
