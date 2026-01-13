import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaBook,
  FaUser,
  FaCheckCircle,
  FaEnvelope,
} from "react-icons/fa";
import { auth } from "../../auth/firebase";
import api from "../../api/axios";
import "../../styles/Dashboard.css";

const AssignCourse = () => {
  const [students, setStudents] = useState([] );
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [error, setError] = useState("");

  /* =========================
     FETCH STUDENTS + COURSES
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!auth.currentUser) throw new Error("Not authenticated");

        const token = await auth.currentUser.getIdToken();

        const [studentsRes, coursesRes] = await Promise.all([
          api.get("/api/admin/students"),
          api.get("/api/admin/courses?status=approved"),
        ]);

setStudents(studentsRes.data);
        console.log("Students API response:", studentsRes.data);    

        setCourses(coursesRes.data.courses || []);
      } catch (err) {
        console.error("AssignCourse fetch error:", err);
        setError("Failed to load students or courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     TOGGLE SELECTION
  ========================= */
  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleCourse = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  /* =========================
     ASSIGN COURSES
  ========================= */
  const handleAssign = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0 || selectedCourses.length === 0) {
      alert("Select at least one student and one course");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();

      await api.post(
        "/api/admin/assign-courses",
        {
          studentIds: selectedStudents,
          courseIds: selectedCourses,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Courses assigned successfully");

      setSelectedStudents([]);
      setSelectedCourses([]);
    } catch (err) {
      console.error("Assign course error:", err);
      alert("Failed to assign courses");
    }
  };

  const filteredStudents = students.filter(
  (s) =>
    (s.name || "").toLowerCase().includes(searchStudent.toLowerCase()) ||
    (s.email || "").toLowerCase().includes(searchStudent.toLowerCase())
);


  if (loading) return <div className="p-8">Loading assignment data...</div>;
  if (error) return <div className="p-8 error-message">⚠️ {error}</div>;

 return (
  <div className="p-6">
    <div
      className="form-box full-width"
      style={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <form
        onSubmit={handleAssign}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <div className="selection-grid">
          {/* STUDENTS COLUMN */}
          <div className="selection-col selection-col-header">
            <h3>
              <FaUser className="text-primary" /> Select Students
              {selectedStudents.length > 0 && (
                <span>{selectedStudents.length}</span>
              )}
            </h3>

            <div className="search-bar-styled">
              <div className="input-icon-wrapper" style={{ zIndex: 1 }}>
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search student..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="selection-list">
              {filteredStudents.map((s) => (
                <div
                  key={s.user_id}
                  onClick={() => toggleStudent(s.user_id)}
                  className={`selection-item ${
                    selectedStudents.includes(s.user_id) ? "selected" : ""
                  }`}
                >
                  <div className="item-info">
                    <div className="item-name">{s.name}</div>
                    <div className="item-sub">
                      <FaEnvelope size={10} /> {s.email}
                    </div>
                  </div>
                  <div className="check-icon">
                    <FaCheckCircle size={18} />
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                    border: "2px dashed var(--color-border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  No students found matching "{searchStudent}"
                </div>
              )}
            </div>
          </div>

          {/* COURSES COLUMN */}
          <div
            className={`selection-col ${
              selectedStudents.length === 0 ? "disabled" : "enabled"
            }`}
          >
            <h3>
              <FaBook className="text-secondary" /> Select Courses
              {selectedCourses.length > 0 && (
                <span className="badge-secondary">
                  {selectedCourses.length}
                </span>
              )}
            </h3>

            {selectedStudents.length === 0 && (
              <div className="warning-box">
                <FaCheckCircle /> First, select at least one student.
              </div>
            )}

            <div className="selection-list">
              {courses.map((c) => (
                <div
                  key={c.courses_id}
                  onClick={() => toggleCourse(c.courses_id)}
                  className={`selection-item ${
                    selectedCourses.includes(c.courses_id) ? "selected" : ""
                  }`}
                >
                  <div className="item-icon-box">
                    <FaBook size={18} />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{c.title}</div>
                    <div className="item-sub">
                      Instructor: {c.instructor_name}
                    </div>
                  </div>
                  <div className="check-icon">
                    <FaCheckCircle size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky-footer">
          <button
            type="submit"
            className="btn-primary"
            disabled={
              selectedStudents.length === 0 || selectedCourses.length === 0
            }
            style={{
              padding: "12px 36px",
              fontSize: "1rem",
              opacity:
                selectedStudents.length === 0 || selectedCourses.length === 0
                  ? 0.5
                  : 1,
            }}
          >
            <FaCheckCircle className="mr-2" />
            {selectedStudents.length > 0 && selectedCourses.length > 0
              ? `Assign ${selectedCourses.length} Course${
                  selectedCourses.length > 1 ? "s" : ""
                } to ${selectedStudents.length} Student${
                  selectedStudents.length > 1 ? "s" : ""
                }`
              : "Confirm Assignment"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default AssignCourse;
