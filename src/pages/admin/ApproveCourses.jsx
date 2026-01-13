import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaPlay,
  FaFileAlt,
} from "react-icons/fa";
import api from "../../api/axios";
import { auth } from "../../auth/firebase";
import "../../styles/Dashboard.css";

const ApproveCourses = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCourses();
  }, []);
  const fetchPendingCourses = async () => {
    try {
      const res = await api.get("/api/admin/courses/pending");

      setPendingCourses(res.data.courses);
    } catch (err) {
      console.error("Failed to load pending courses", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courses_id) => {
    try {
      const res = await api.get(`/api/courses/${courses_id}/modules`);
      setModules(res.data);
    } catch (err) {
      console.error("Failed to load modules", err);
      setModules([]);
    }
  };

  const selectCourse = async (course) => {
    setSelectedCourse(course);
    await fetchModules(course.courses_id);
  };

  const updateStatus = async (status) => {
    if (!selectedCourse) return;

    if (!window.confirm(`Are you sure you want to ${status}?`)) return;

    try {
      await api.patch(
        `/api/admin/courses/${selectedCourse.courses_id}/status`,
        { status }
      );

      setPendingCourses((prev) =>
        prev.filter((c) => c.courses_id !== selectedCourse.courses_id)
      );
      setSelectedCourse(null);
      setModules([]);
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update course status");
    }
  };

  if (loading) return <div className="p-8">Loading courses...</div>;

  return (
    <div className="p-6">
      <div className="approval-header">
        <h2 className="text-2xl font-bold text-gray-800">
          Course Approval Queue
        </h2>
        <div className="pending-badge">{pendingCourses.length} Pending</div>
      </div>

      <div className={`approval-grid ${selectedCourse ? "split" : ""}`}>
        {/* LEFT TABLE */}
        <div className="table-container table-scroll-container">
          <table style={{ width: "100%" }}>
            <thead className="sticky-thead">
              <tr>
                <th>Course Title</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#9ca3af",
                    }}
                  >
                    No courses pending approval.
                  </td>
                </tr>
              ) : (
                pendingCourses.map((course) => (
                  <tr
                    key={course.courses_id}
                    onClick={() => selectCourse(course)}
                    className={`course-row-base hover:bg-gray-50 transition-colors ${
                      selectedCourse?.courses_id === course.courses_id
                        ? "course-row-selected"
                        : ""
                    }`}
                  >
                    <td style={{ fontWeight: 600, color: "#1f2937" }}>
                      {course.title}
                    </td>
                    <td>{course.instructor_name}</td>
                    <td>
                      <span className="category-badge">{course.category}</span>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT DETAILS PANEL */}
        {selectedCourse && (
          <div className="form-box details-panel">
            <div className="details-header">
              <div>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.4rem" }}>
                  {selectedCourse.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: "0.9rem",
                  }}
                >
                  Category: {selectedCourse.category} • Instructor:{" "}
                  {selectedCourse.instructor_name}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() => setSelectedCourse(null)}
              >
                <FaTimesCircle />
              </button>
            </div>

            {/* DESCRIPTION */}
            <div style={{ marginBottom: "25px" }}>
              <h4 className="section-title">Description</h4>
              <p className="description-box">{selectedCourse.description}</p>
            </div>

            {/* MODULES */}
            <div style={{ marginBottom: "25px" }}>
              <h4 className="section-title">
                Course Content ({modules.length} Modules)
              </h4>

              <div className="module-list custom-scrollbar">
                {modules.map((m) => (
                  <div key={m.module_id} className="module-item">
                    <div className={`module-icon ${m.type}`}>
                      {m.type === "video" ? (
                        <FaPlay color="#ef4444" size={12} />
                      ) : (
                        <FaFileAlt color="#3b82f6" size={12} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {m.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#9ca3af",
                        }}
                      >
                        {m.type.toUpperCase()} • {m.duration_mins} mins
                      </div>
                    </div>
                    {m.content_url && (
                      <a
                        href={m.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.8rem",
                          color: "#2563eb",
                          fontWeight: 600,
                        }}
                      >
                        Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="approval-actions">
              <button
                className="btn-secondary btn-reject"
                onClick={() => updateStatus("rejected")}
              >
                <FaTimesCircle style={{ marginRight: "8px" }} />
                Reject
              </button>

              <button
                className="btn-primary btn-approve"
                onClick={() => updateStatus("approved")}
              >
                <FaCheckCircle style={{ marginRight: "8px" }} />
                Approve & Publish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveCourses;
