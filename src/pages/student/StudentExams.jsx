import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaPlay,
  FaClock,
  FaRedo,
} from "react-icons/fa";
import { getStudentData } from "../../utils/studentData";
import "../../styles/Dashboard.css";
import "../../styles/Student.css";

const MOCK_EXAM_DEF = {
  id: "exam_001",
  title: "React.js Certification Exam",
  questions: new Array(5).fill(null),
  duration: 45,
  passScore: 60,
};

const StudentExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passedExams, setPassedExams] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const data = getStudentData();
      const allExams = [MOCK_EXAM_DEF, ...(data.exams || [])];

      const uniqueExams = Array.from(
        new Map(allExams.map((item) => [item.id, item])).values()
      );

      setExams(uniqueExams);

      const passed = JSON.parse(localStorage.getItem("passedExams")) || [];
      setPassedExams(passed);

      setLoading(false);
    }, 500);
  }, []);

  const isPassed = (examId) => passedExams.includes(examId);

  if (loading) return <div className="p-8">Loading exams...</div>;

  return (
    <div>
      <div className="student-page-header">
        <div>
          <h3>My Exams</h3>
          <p className="text-gray-500">
            Take assessments to prove your skills.
          </p>
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="empty-state-card">
          <FaClipboardList className="empty-state-icon" />
          <h3>No Exams Available</h3>
          <p className="empty-state-text">
            You don't have any assigned exams yet.
          </p>
        </div>
      ) : (
        <div className="student-course-grid">
          {exams.map((exam, index) => {
            const passed = isPassed(exam.id);
            return (
              <div
                key={exam.id}
                className="student-course-card"
                style={{ cursor: "default" }}
              >
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
                  {passed ? (
                    <FaCheckCircle
                      style={{
                        fontSize: "4rem",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    />
                  ) : (
                    <FaClipboardList
                      style={{
                        fontSize: "3.5rem",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    />
                  )}
                </div>

                <div className="course-details" style={{ padding: "20px" }}>
                  <h4
                    className="course-title"
                    style={{ fontSize: "1.1rem", marginBottom: "5px" }}
                  >
                    {exam.title}
                  </h4>

                  <div className="course-meta" style={{ marginBottom: "15px" }}>
                    <span>{exam.questions.length} Questions</span>
                    <span>
                      <FaClock /> {exam.duration} mins
                    </span>
                  </div>

                  {passed ? (
                    <div style={{ marginTop: "auto" }}>
                      <div
                        className="status-badge success w-100 flex-center"
                        style={{
                          marginBottom: "10px",
                          justifyContent: "center",
                        }}
                      >
                        <FaCheckCircle /> Passed
                      </div>
                      <button
                        className="btn-secondary w-100"
                        onClick={() => navigate("/student/certificates")}
                      >
                        View Certificate
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: "auto" }}>
                      <div className="flex-between-center text-sm text-gray-500 mb-sm">
                        <span>Pass Score: {exam.passScore}%</span>
                      </div>
                      <button
                        className="btn-primary w-100"
                        onClick={() => navigate(`/student/exam/${exam.id}`)}
                      >
                        <FaPlay size={10} style={{ marginRight: "5px" }} />{" "}
                        Start Exam
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentExams;
