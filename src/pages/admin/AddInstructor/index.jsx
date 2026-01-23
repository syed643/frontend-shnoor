import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import api from "../../../api/axios";
import AddInstructorView from "./view";

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

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await auth.currentUser.getIdToken();

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
      setError(err.response?.data?.message || "Failed to add instructor");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/dashboard");
  };

  return (
    <AddInstructorView
      data={data}
      loading={loading}
      error={error}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
    />
  );
};

export default AddInstructor;
