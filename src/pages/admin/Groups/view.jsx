/* eslint-disable no-undef */
import React from "react";

const GroupsView = ({ groups = [], loading = false, onCreate, onSelectGroup, onDelete, onEdit }) => {
  const getGroupTypeLabel = (group) => {
    if (group.created_by) {
      return "Manual";
    } else if (group.start_date && group.end_date) {
      return "Timestamp";
    } else {
      return "College";
    }
  };

  const getGroupTypeBadgeColor = (group) => {
    if (group.created_by) {
      return "bg-blue-100 text-blue-800";
    } else if (group.start_date && group.end_date) {
      return "bg-purple-100 text-purple-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Groups</h1>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800"
        >
          Create Group
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        {loading ? (
          <div className="p-6">Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="p-6">No groups found. Click "Create Group" to add one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left">Group Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Date Range</th>
                <th className="p-4 text-left">Students</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.group_id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-medium text-primary-900 cursor-pointer" onClick={() => onSelectGroup(g.group_id)}>
                    {g.group_name}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getGroupTypeBadgeColor(g)}`}>
                      {getGroupTypeLabel(g)}
                    </span>
                  </td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectGroup(g.group_id)}>
                    {g.start_date && g.end_date
                      ? `${new Date(g.start_date).toLocaleDateString()} - ${new Date(g.end_date).toLocaleDateString()}`
                      : "-"}
                  </td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectGroup(g.group_id)}>
                    {g.user_count ?? 0}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(g.group_id); }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition"
                        title="Edit group"
                        aria-label="Edit group"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(g.group_id); }}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition"
                        title="Delete group"
                        aria-label="Delete group"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GroupsView;