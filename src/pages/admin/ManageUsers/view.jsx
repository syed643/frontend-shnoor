import React from "react";
import {
  FaSearch,
  FaBan,
  FaCheckCircle,
  FaUserShield,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
} from "react-icons/fa";

const ManageUsersView = ({
  loading,
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filteredUsers,
  handleStatusChange,
}) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-blue-600" />;
      case "instructor":
        return <FaChalkboardTeacher className="text-purple-600" />;
      case "company":
        return <FaBuilding className="text-amber-500" />;
      default:
        return <FaUserGraduate className="text-emerald-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">
            Active
          </span>
        );
      case "blocked":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide">
            Blocked
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-6rem)] flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">
          User Management
        </h2>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium min-w-62.5 shadow-sm"
            />
          </div>

          <select
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-slate-600 shadow-sm cursor-pointer"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Join Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.user_id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* USER */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200 shadow-sm">
                          {user.full_name?.charAt(0) ||
                            user.email?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {user.full_name || "No Name"}
                          </div>
                          <div className="text-sm text-slate-500 font-medium">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="capitalize font-medium text-slate-700">
                          {user.role}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-6">
                      {getStatusBadge(user.status)}
                    </td>

                    {/* JOIN DATE */}
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        {user.status === "blocked" ? (
                          <button
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-colors"
                            onClick={() =>
                              handleStatusChange(
                                user.user_id,
                                "active"
                              )
                            }
                          >
                            <FaCheckCircle /> Activate
                          </button>
                        ) : (
                          <button
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              user.role === "admin"
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                            onClick={() =>
                              handleStatusChange(
                                user.user_id,
                                "blocked"
                              )
                            }
                            disabled={user.role === "admin"}
                          >
                            <FaBan /> Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-16 text-slate-400"
                  >
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-500 text-right">
          Total Users: {filteredUsers.length}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersView;
