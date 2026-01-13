import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFolder,
  FaTrash,
  FaArrowLeft,
  FaVideo,
  FaFileAlt,
  FaEdit,
} from "react-icons/fa";
import { auth } from "../../auth/firebase";
import api from "../../api/axios";
import "../../styles/Dashboard.css";

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH COURSES (REAL DATA)
  ========================= */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await api.get("/api/courses/instructor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) fetchCourses();
  }, []);

  /* =========================
     DELETE COURSE
  ========================= */
  const deleteCourse = async (e, courseId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this course?")) return;

    try {
      const token = await auth.currentUser.getIdToken();
      await api.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses((prev) => prev.filter((c) => c.courses_id !== courseId));

      if (selectedCourse?.courses_id === courseId) {
        setSelectedCourse(null);
      }
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  /* =========================
     COURSE DETAILS VIEW
  ========================= */
  if (selectedCourse) {
    return (
      <div>
        <div className="table-header">
          <button
            className="back-button"
            onClick={() => setSelectedCourse(null)}
          >
            <FaArrowLeft /> Back
          </button>

          <h3>{selectedCourse.title}</h3>

          <button
            className="btn-primary"
            onClick={() =>
              navigate(
                `/instructor/add-course?edit=${selectedCourse.courses_id}`,
                { state: { courseData: selectedCourse } }
              )
            }
          >
            <FaEdit /> Edit Course
          </button>
        </div>

        <div className="file-list-container">
          {selectedCourse.modules.length === 0 ? (
            <div className="empty-state-container">No modules added yet.</div>
          ) : (
            selectedCourse.modules.map((m, idx) => (
              <div
                key={m.module_id}
                className="file-list-item clickable"
                onClick={() => window.open(m.content_url, "_blank")}
              >
                <div className="file-index-circle">{idx + 1}</div>

                <div className="file-info">
                  {m.type === "video" ? (
                    <FaVideo className="file-icon-sm video" />
                  ) : (
                    <FaFileAlt className="file-icon-sm pdf" />
                  )}

                  <span className="file-name-row">{m.title}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  /* =========================
     COURSE GRID VIEW
  ========================= */
  if (loading) return <div className="p-8">Loading courses...</div>;

  return (
    <div>
      <div className="table-header">
        <h3>Course Library</h3>
      </div>

      <div className="folder-grid">
        {courses.length === 0 ? (
          <div className="empty-state-container">No courses created yet.</div>
        ) : (
          courses.map((course) => (
            <div
              key={course.courses_id}
              className="folder-card"
              onClick={() => setSelectedCourse(course)}
            >
              <button
                className="btn-icon delete delete-btn-absolute"
                onClick={(e) => deleteCourse(e, course.courses_id)}
              >
                <FaTrash />
              </button>

              <FaFolder className="folder-icon" />
              <h4>{course.title}</h4>

              <span className="folder-count">
                {course.modules.length} modules
              </span>

              <span className={`status-badge ${course.status}`}>
                {course.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseList;
