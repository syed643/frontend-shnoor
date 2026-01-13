import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookReader, FaSearch, FaBookOpen } from "react-icons/fa";
import { auth } from "../../auth/firebase";
import api from "../../api/axios";
import "../../styles/Dashboard.css";
import "../../styles/Student.css";
import "../../styles/StudentGrid.css";

const StudentCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
     FETCH ASSIGNED COURSES
  ========================= */
  useEffect(() => {
    const fetchAssignedCourses = async () => {
      if (!auth.currentUser) return; // 🔥 IMPORTANT

      try {
        setLoading(true);

        const token = await auth.currentUser.getIdToken(true);

        const res = await api.get("/api/assignments/my-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch student courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCourses();
  }, []);

  /* =========================
     FILTER COURSES
  ========================= */
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8">Loading your courses...</div>;
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="student-page-header">
        <div>
          <h3>My Learning</h3>
          <p className="text-gray-500 text-sm">
            Courses assigned by your instructor.
          </p>
        </div>

        <div
          className="search-bar-container"
          style={{ position: "relative", maxWidth: "400px", width: "100%" }}
        >
          <FaSearch
            className="search-icon"
            style={{
              position: "absolute",
              left: "15px",
              top: "12px",
              color: "#9ca3af",
            }}
          />
          <input
            className="search-input"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: "35px",
              width: "100%",
              height: "40px",
              borderRadius: "20px",
              border: "1px solid #e5e7eb",
            }}
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredCourses.length === 0 ? (
        <div className="empty-state-card">
          <FaBookOpen
            className="empty-state-icon"
            style={{
              fontSize: "4rem",
              color: "#e2e8f0",
              marginBottom: "1.5rem",
              display: "block",
              margin: "0 auto 1.5rem auto",
            }}
          />
          <h3 className="empty-state-title">No Courses Assigned</h3>
          <p className="empty-state-text">
            Your instructor hasn’t assigned any courses yet.
          </p>
        </div>
      ) : (
        /* COURSE GRID */
        <div className="student-course-grid">
          {filteredCourses.map((course, index) => (
            <div key={course.courses_id} className="student-course-card">
              <div
                className={`course-thumbnail course-thumbnail-gradient-${
                  index % 4
                }`}
                style={{
                  height: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaBookReader
                  style={{
                    fontSize: "3.5rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                />
              </div>

              <div className="course-details" style={{ padding: "15px" }}>
                <span className="category-badge" style={{ fontSize: "0.7rem" }}>
                  {course.category}
                </span>

                <h4
                  className="course-title"
                  style={{ fontSize: "1rem", margin: "5px 0" }}
                >
                  {course.title}
                </h4>

                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    marginBottom: "15px",
                  }}
                >
                  By {course.instructor_name || "Instructor"}
                </div>

                <button
                  className={`w-100 ${
                    course.isCompleted ? "btn-secondary" : "btn-primary"
                  }`}
                  onClick={() =>
                    navigate(`/student/course/${course.courses_id}`)
                  }
                >
                  {course.isCompleted ? "Completed" : "Continue"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
