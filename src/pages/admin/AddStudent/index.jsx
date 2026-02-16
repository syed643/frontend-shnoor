import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import api from "../../../api/axios";
import AddStudentView from "./view";

const AddStudent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("single"); // 'single' or 'bulk'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Single student state
  const [data, setData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
  });

  // Bulk upload state
  const [file, setFile] = useState(null);
  const [bulkResults, setBulkResults] = useState(null);

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
        "/api/users/students",
        {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          bio: data.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Error adding student:", err);
      setError(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError("Please select a CSV file");
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
      setBulkResults(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");
    setBulkResults(null);

    try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      formData.append("csv", file);

      const response = await api.post("/api/users/students/bulk", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setBulkResults(response.data);
      setFile(null);
      
      const fileInput = document.getElementById("csv-file-input-student");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setError(err.response?.data?.message || "Failed to upload CSV");
      setBulkResults(err.response?.data || null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `fullName,email,phone,bio
"John Doe","john.doe@student.edu","+1-555-0100","Passionate about learning and technology"
"Jane Smith","jane.smith@college.edu","","Interested in computer science and mathematics"
"Ahmad Khan","ahmad.khan@university.edu","+44-20-1234-5678","Aspiring software engineer"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleBulkReset = () => {
    setFile(null);
    setBulkResults(null);
    setError("");
    const fileInput = document.getElementById("csv-file-input-student");
    if (fileInput) fileInput.value = "";
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    navigate("/admin/dashboard");
  };

  const handleCancel = () => {
    navigate("/admin/dashboard");
  };

  return (
    <AddStudentView
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      data={data}
      loading={loading}
      error={error}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      showSuccessPopup={showSuccessPopup}
      setShowSuccessPopup={handleSuccessClose}
      // Bulk upload props
      file={file}
      bulkResults={bulkResults}
      handleFileSelect={handleFileSelect}
      handleBulkUpload={handleBulkUpload}
      handleDownloadTemplate={handleDownloadTemplate}
      handleBulkReset={handleBulkReset}
    />
  );
};

export default AddStudent;