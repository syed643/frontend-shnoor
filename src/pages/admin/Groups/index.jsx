/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import GroupsView from "./view";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/api/admin/groups");
        setGroups(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    }; 

    fetchGroups();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await api.delete(`/api/admin/groups/${id}`);
      setGroups(groups.filter(g => g.group_id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete group");
    }
  };



  return (
    <div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <GroupsView
        groups={groups}
        loading={loading}
        onCreate={() => navigate("/admin/groups/create")}
        onSelectGroup={(id) => navigate(`/admin/groups/${id}/users`)}
        onEdit={(id) => navigate(`/admin/groups/edit/${id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Groups;
