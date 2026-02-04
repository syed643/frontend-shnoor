/* eslint-disable no-undef */
import React from "react";

const GroupsView = ({ groups = [], loading = false, onCreate, onSelectGroup, onDelete, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Groups</h1>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-primary-900 text-white rounded-lg"
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
                <th className="p-4 text-left">Start Date</th>
                <th className="p-4 text-left">End Date</th>
                <th className="p-4 text-left">Students</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr
                  key={g.group_id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4 font-medium text-primary-900 cursor-pointer" onClick={() => onSelectGroup(g.group_id)}>{g.group_name}</td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectGroup(g.group_id)}>{g.start_date ? new Date(g.start_date).toLocaleDateString() : '-'}</td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectGroup(g.group_id)}>{g.end_date ? new Date(g.end_date).toLocaleDateString() : '-'}</td>
                  <td className="p-4 cursor-pointer" onClick={() => onSelectGroup(g.group_id)}>{g.users.length ?? 0}</td>
                  <td className="p-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(g.group_id); }}
                      className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(g.group_id); }}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
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
