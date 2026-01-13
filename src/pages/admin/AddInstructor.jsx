import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaUser,
  FaEnvelope,
  FaBook,
  FaPhone,
  FaInfoCircle,
} from "react-icons/fa";
import { auth } from "../../auth/firebase";
import api from "../../api/axios"; // axios instance
import "../../styles/Dashboard.css";

const AddInstructor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    fullName: "",
    email: "",
    subject: "",
    phone: "",
    bio: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔑 Get Firebase ID token
      const token = await auth.currentUser.getIdToken();

      // 🔐 Call backend
      await api.post(
        "/api/users/instructors",
        {
          fullName: data.fullName,
          email: data.email,
          subject: data.subject,
          phone: data.phone,
          bio: data.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Instructor "${data.fullName}" added successfully.`);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error adding instructor:", err);
      setError(
        err.response?.data?.message || "Failed to add instructor"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Adding instructor...</div>;

  return (
    <div className="p-6">
      <div className="form-box full-width">
        <div className="form-header-styled">
          <div className="icon-circle indigo">
            <FaChalkboardTeacher size={18} />
          </div>
          Instructor Details
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: "15px" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid-300">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-group-styled">
                <div className="input-icon-wrapper">
                  <FaUser />
                </div>
                <input
                  name="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Dr. Smith"
                  className="form-input-styled"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-group-styled">
                <div className="input-icon-wrapper">
                  <FaEnvelope />
                </div>
                <input
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  placeholder="instructor@shnoor.com"
                  className="form-input-styled"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject / Specialization</label>
              <div className="input-group-styled">
                <div className="input-icon-wrapper">
                  <FaBook />
                </div>
                <input
                  name="subject"
                  value={data.subject}
                  onChange={handleChange}
                  required
                  placeholder="Mathematics, ReactJS..."
                  className="form-input-styled"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone (Optional)</label>
              <div className="input-group-styled">
                <div className="input-icon-wrapper">
                  <FaPhone />
                </div>
                <input
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="+1 234..."
                  className="form-input-styled"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Bio (Optional)</label>
            <div className="input-group-styled">
              <div className="input-icon-wrapper top-align">
                <FaInfoCircle />
              </div>
              <textarea
                name="bio"
                value={data.bio}
                onChange={handleChange}
                rows="5"
                placeholder="Short biography..."
                className="form-input-styled"
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          <div className="form-actions-styled">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ paddingLeft: "30px", paddingRight: "30px" }}
            >
              Add Instructor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstructor;
