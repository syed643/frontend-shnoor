import React, { useState, useEffect, useRef, useCallback } from 'react';
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
      const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const debounceTimer = useRef(null);
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

    const performSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        try {
            if (!auth.currentUser) {
                throw new Error("Not authenticated");
            }

            const token = await auth.currentUser.getIdToken();

            const res = await api.get("/api/courses/instructor/search", {
                params: { query },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSearchResults(res.data || []);
            
        } catch (err) {
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearch = useCallback((query) => {
        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (!query.trim()) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);

        // Set new timer for debounced search (300ms delay)
        debounceTimer.current = setTimeout(() => {
            performSearch(query);
        }, 300);
    }, []);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);
    return (
        <InstructorDashboardView
            loading={loading}
            userName={userName}
            stats={stats}
            searchResults={searchResults}
            searchLoading={searchLoading}
            onSearch={handleSearch}
            navigate={navigate}
        />
    );
};

export default InstructorDashboard;
