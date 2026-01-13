import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaCheckCircle, FaTimesCircle, FaUserClock } from "react-icons/fa";
import "../../styles/Dashboard.css";

const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/users/pending");
      setPendingUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action, fullName) => {
    const confirmMessage =
      action === "active"
        ? `Approve access for ${fullName}?`
        : `Reject access for ${fullName}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await api.patch(`/api/admin/users/${userId}/status`, {
        status: action,
      });

      setPendingUsers((prev) =>
        prev.filter((user) => user.user_id !== userId)
      );

      alert(
        `User ${action === "active" ? "approve" : "rejected"} successfully`
      );
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user status.");
    }
  };

  if (loading) {
    return <div className="p-8">Loading pending requests...</div>;
  }

  return (
    <div className="p-6">
      <div className="approval-header">
        <div>
          <h2
            className="text-2xl font-bold text-gray-800"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <FaUserClock /> User Approval Queue
          </h2>
          <p style={{ color: "#6b7280", marginTop: "5px" }}>
            Review and manage new account requests.
          </p>
        </div>

        {pendingUsers.length > 0 && (
          <div className="pending-badge">
            {pendingUsers.length} Pending
          </div>
        )}
      </div>

      <div className="table-container table-scroll-container">
        <table style={{ width: "100%" }}>
          <thead className="sticky-thead">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Registered On</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "50px",
                    color: "#9ca3af",
                  }}
                >
                  <FaCheckCircle size={40} style={{ opacity: 0.2 }} />
                  <p>No pending user requests.</p>
                </td>
              </tr>
            ) : (
              pendingUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>
                        {user.full_name}
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                        {user.email}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`role-badge ${user.role}`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {new Date(user.created_at).toLocaleDateString()}
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {new Date(user.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleAction(
                            user.user_id,
                            "rejected",
                            user.full_name
                          )
                        }
                        style={{
                          background: "#fee2e2",
                          color: "#ef4444",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      >
                        <FaTimesCircle />
                      </button>

                      <button
                        onClick={() =>
                          handleAction(
                            user.user_id,
                            "active",
                            user.full_name
                          )
                        }
                        style={{
                          background: "#dcfce7",
                          color: "#166534",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      >
                        <FaCheckCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproveUsers;
