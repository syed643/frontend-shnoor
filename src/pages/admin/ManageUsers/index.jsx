import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import ManageUsersView from "./view";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ===============================
     FETCH USERS FROM BACKEND
  =============================== */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UPDATE USER STATUS (SUSPEND)
  =============================== */
  const handleStatusChange = async (userId, newStatus) => {
    const action = newStatus === "blocked" ? "suspend" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await api.put(`/api/admin/users/${userId}/status`, {
        status: newStatus,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === userId
            ? { ...user, status: newStatus }
            : user
        )
      );

      alert(`User ${action}d successfully.`);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status.");
    }
  };

  /* ===============================
     FILTER USERS
  =============================== */
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <ManageUsersView
      loading={loading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterRole={filterRole}
      setFilterRole={setFilterRole}
      filteredUsers={filteredUsers}
      handleStatusChange={handleStatusChange}
    />
  );
};

export default ManageUsers;
