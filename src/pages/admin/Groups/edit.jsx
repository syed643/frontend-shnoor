import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";

const EditGroup = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [form, setForm] = useState({
    group_name: "",
    start_date: "",
    end_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCollegeGroup, setIsCollegeGroup] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get(`/api/admin/groups/${groupId}`);
        const group = res.data;
        setForm({
          group_name: group.group_name,
          start_date: group.start_date.split('T')[0],
          end_date: group.end_date ? group.end_date.split('T')[0] : "",
        });
        setIsCollegeGroup(group.created_by === null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch group");
      }
    };
    fetchGroup();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.group_name) return setError("Group name is required");
    if (!form.start_date) return setError("Start date is required");
    if (!isCollegeGroup && !form.end_date) return setError("End date is required");

    if (!isCollegeGroup && new Date(form.start_date) >= new Date(form.end_date))
      return setError("Start date must be before end date");

    try {
      setLoading(true);
      await api.put(`/api/admin/groups/${groupId}`, form);
      navigate("/admin/groups");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Edit Group</h1>

      {error && <div className="text-red-600">{error}</div>}

      <input
        required
        placeholder="Group Name"
        className="w-full border p-3 rounded"
        value={form.group_name}
        onChange={(e) => setForm({ ...form, group_name: e.target.value })}
      />

      <input
        required
        type="date"
        className="w-full border p-3 rounded"
        value={form.start_date}
        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
      />

      <input
        required={!isCollegeGroup}
        type="date"
        className="w-full border p-3 rounded"
        value={form.end_date}
        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
      />

      <button
        disabled={loading}
        className="px-4 py-2 bg-primary-900 text-white rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Update Group"}
      </button>
    </form>
  );
};

export default EditGroup;