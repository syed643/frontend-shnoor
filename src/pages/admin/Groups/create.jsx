import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    group_name: "",
    start_date: "",
    end_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (isManual) {
      const fetchStudents = async () => {
        try {
          const res = await api.get('/api/admin/users');
          setAllStudents(res.data.filter(u => u.role === 'student') || []);
        } catch (err) {
          console.error('Failed to fetch students', err);
        }
      };
      fetchStudents();
    }
  }, [isManual]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.group_name) return setError("Group name is required");
    if (!isManual && (!form.start_date || !form.end_date))
      return setError("Start and end dates are required");

    if (!isManual && new Date(form.start_date) >= new Date(form.end_date))
      return setError("Start date must be before end date");

    try {
      setLoading(true);
      const groupData = isManual ? { group_name: form.group_name } : form;
      const res = await api.post("/api/admin/groups", groupData);
      const groupId = res.data.group_id;

      if (isManual && selectedStudents.length > 0) {
        // Add selected students
        await Promise.all(selectedStudents.map(studentId =>
          api.post(`/api/admin/groups/${groupId}/users/${studentId}`)
        ));
      }

      navigate("/admin/groups");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Create Group</h1>
      <p className="text-sm text-gray-600">Timestamp Group: Create a group based on student registration dates.</p>

      {error && <div className="text-red-600">{error}</div>}

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isManual}
            onChange={(e) => setIsManual(e.target.checked)}
            className="mr-2"
          />
          Manual student selection
        </label>
      </div>

      <input
        required
        placeholder="Group Name"
        className="w-full border p-3 rounded"
        value={form.group_name}
        onChange={(e) => setForm({ ...form, group_name: e.target.value })}
      />

      {!isManual && (
        <>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            required
            type="date"
            className="w-full border p-3 rounded"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />

          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            required
            type="date"
            className="w-full border p-3 rounded"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
        </>
      )}

      {isManual && (
        <div>
          <h3 className="text-lg font-medium mb-2">Select Students</h3>
          <div className="max-h-64 overflow-y-auto border rounded p-2">
            {allStudents.map((student) => (
              <label key={student.user_id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.user_id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents([...selectedStudents, student.user_id]);
                    } else {
                      setSelectedStudents(selectedStudents.filter(id => id !== student.user_id));
                    }
                  }}
                  className="mr-2"
                />
                {student.full_name} ({student.email})
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        disabled={loading}
        className="px-4 py-2 bg-primary-900 text-white rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Group"}
      </button>
    </form>
  );
};

export default CreateGroup;
