import React, { useState, useEffect } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowLeft,
  FaClock,
  FaFilePdf,
} from "react-icons/fa";
import { auth } from "../../auth/firebase";
import api from "../../api/axios";
import "../../styles/Dashboard.css";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { setXp } = useOutletContext();

  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔁 Convert YouTube links to embed-safe URLs */
  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    if (url.includes("m.youtube.com")) {
      return url.replace("m.youtube.com", "www.youtube.com").replace("watch?v=", "embed/");
    }

    return url; // already embed or non-youtube
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!auth.currentUser) return;

      try {
        setLoading(true);

        const res = await api.get(`/api/student/courses/${courseId}`);

        setCourse(res.data);
        setCurrentModule(res.data.modules?.[0] || null);
        setCompletedModules(res.data.completedModules || []);
      } catch (err) {
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

 const markComplete = async () => {
  if (!currentModule) return;

  try {
    // Call backend FIRST
    await api.post(`/api/student/courses/${courseId}/progress`, {
      moduleId: currentModule.id,
    });

    // Update UI only after success
    setCompletedModules((prev) =>
      prev.includes(currentModule.id)
        ? prev
        : [...prev, currentModule.id]
    );

    setXp((prev) => prev + 50);
  } catch (error) {
    console.error("Failed to update progress:", error);
    alert("Failed to mark module as complete");
  }
};


  if (loading) return <div className="p-8">Loading course content...</div>;
  if (!course) return <div className="p-8">Course not found.</div>;

  const isModuleCompleted = completedModules.includes(currentModule?.id);
  const progressPercentage = Math.round(
    (completedModules.length / course.modules.length) * 100
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 350px",
        gap: "20px",
        height: "calc(100vh - 100px)",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <button
          onClick={() => navigate("/student/dashboard")}
          className="btn-secondary"
        >
          <FaArrowLeft /> Back
        </button>

        <div
          style={{
            background: "#000",
            borderRadius: "8px",
            marginTop: "10px",
            overflow: "hidden",
          }}
        >
          {currentModule?.type === "video" ? (
            <iframe
              width="100%"
              height="400"
              src={getEmbedUrl(currentModule.url)}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div style={{ color: "#fff", textAlign: "center", padding: "40px" }}>
              <FaFilePdf size={50} />
              <h3>{currentModule?.title}</h3>
              <a
                href={currentModule?.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                View PDF
              </a>
            </div>
          )}
        </div>

        <h2 style={{ marginTop: "20px" }}>{currentModule?.title}</h2>
        <p>{currentModule?.description}</p>

        <button
          className={isModuleCompleted ? "btn-secondary" : "btn-primary"}
          onClick={markComplete}
          disabled={isModuleCompleted}
        >
          {isModuleCompleted ? "Completed" : "Mark as Complete"}
        </button>

        <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "#6b7280" }}>
          Progress: {progressPercentage}%
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px" }}>
        {course.modules.map((module, idx) => {
          const isActive = currentModule?.id === module.id;
          const isDone = completedModules.includes(module.id);

          return (
            <div
              key={module.id}
              onClick={() => setCurrentModule(module)}
              style={{
                padding: "15px",
                cursor: "pointer",
                background: isActive ? "#eff6ff" : "#fff",
                borderLeft: isActive
                  ? "4px solid #003366"
                  : "4px solid transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span>Module {idx + 1}</span>
                {isDone && <FaCheckCircle color="#16a34a" />}
              </div>
              <h5 style={{ margin: 0 }}>{module.title}</h5>
              <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                <FaClock size={10} /> {module.duration}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePlayer;
