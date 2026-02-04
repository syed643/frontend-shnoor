/* eslint-disable no-undef */
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";

const GroupUsers = () => {
  const { groupId } = useParams();
  const [users, setUsers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      const [usersRes, studentsRes, groupRes] = await Promise.all([
        api.get(`/api/admin/groups/${groupId}/users`),
        api.get(`/api/admin/users`),
        api.get(`/api/admin/groups/${groupId}`)
      ]);
      setUsers(usersRes.data || []);
      setAllStudents(studentsRes.data.filter(u => u.role === 'student') || []);
      setGroup(groupRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddStudent = async () => {
    if (!selectedStudent) return;

    setProcessing(selectedStudent.user_id);
    try {
      const data = {};
      if (startDate) data.start_date = startDate;
      if (endDate) data.end_date = endDate;

      await api.post(`/api/admin/groups/${groupId}/users/${selectedStudent.user_id}`, data);
      setShowAddModal(false);
      setSelectedStudent(null);
      fetchData(); // Refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add student');
    } finally {
      setProcessing(null);
    }
  };

  const handleToggle = async (userId, isInGroup) => {
    if (isInGroup) {
      setProcessing(userId);
      try {
        await api.delete(`/api/admin/groups/${groupId}/users/${userId}`);
        fetchData(); // Refresh
      } catch (err) {
        alert(err.response?.data?.message || `Failed to remove student`);
      } finally {
        setProcessing(null);
      }
    } else {
      // Show modal for adding with dates
      const student = allStudents.find(s => s.user_id === userId);
      setSelectedStudent(student);
      setStartDate('');
      setEndDate('');
      setShowAddModal(true);
    }
  };



  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Manage Group Students</h1>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {loading ? (
        <div className="p-4">Loading...</div>
      ) : group && group.start_date && !group.end_date ? (
        <div>
          {/* Group Details */}
          <div className="bg-white border rounded mb-6 p-4">
            <h2 className="text-xl font-semibold mb-2">{group.group_name}</h2>
            <div className="text-sm text-slate-600">
              {group.start_date && <span>Start Date: {new Date(group.start_date).toLocaleString()}</span>}
              {group.start_date && group.end_date && <span> • </span>}
              {group.end_date && <span>End Date: {new Date(group.end_date).toLocaleString()}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded">
            <div className="p-4 border-b font-medium">Students in Group ({users.length})</div>
            <div className="max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-4">No students assigned to this group yet.</div>
              ) : (
                users.map((u) => (
                  <div key={u.user_id} className="p-4 border-b flex justify-between items-start">
                    <div>
                      <span className="font-medium">{u.full_name}</span>
                      <span className="text-slate-500 ml-2">{u.email}</span>
                      {(u.start_date || u.end_date) && (
                        <div className="text-sm text-slate-600 mt-1">
                          {u.start_date && <span>Start: {new Date(u.start_date).toLocaleString()}</span>}
                          {u.start_date && u.end_date && <span> • </span>}
                          {u.end_date && <span>End: {new Date(u.end_date).toLocaleString()}</span>}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggle(u.user_id, true)}
                      disabled={processing === u.user_id}
                      className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    >
                      {processing === u.user_id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border rounded">
            <div className="p-4 border-b font-medium">All Students</div>
            <div className="max-h-96 overflow-y-auto">
              {allStudents.map((s) => {
                const isInGroup = users.some(u => u.user_id === s.user_id);
                return (
                  <div key={s.user_id} className="p-4 border-b flex justify-between items-center">
                    <div>
                      <span className="font-medium">{s.full_name}</span>
                      <span className="text-slate-500 ml-2">{s.email}</span>
                    </div>
                    {!isInGroup && (
                      <button
                        onClick={() => handleToggle(s.user_id, false)}
                        disabled={processing === s.user_id}
                        className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                      >
                        {processing === s.user_id ? "Adding..." : "Add"}
                      </button>
                    )}
                    {isInGroup && (
                      <span className="text-green-600 font-medium">In Group</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>        </div>
      ) : (
        <div>
          <div className="p-4 bg-yellow-100 border border-yellow-400 rounded mb-4">
            Cannot manually manage students for timestamp-based groups. Students are assigned automatically based on registration dates.
          </div>
          <div className="bg-white border rounded">
            <div className="p-4 border-b font-medium">Students in Group ({users.length})</div>
            <div className="max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-4">No students assigned to this group yet.</div>
              ) : (
                users.map((u) => (
                  <div key={u.user_id} className="p-4 border-b">
                    <span className="font-medium">{u.full_name}</span>
                    <span className="text-slate-500 ml-2">{u.email}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add Student Modal */}
      {showAddModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Student to Group</h3>
            <div className="mb-4">
              <p className="font-medium">{selectedStudent.full_name}</p>
              <p className="text-slate-500">{selectedStudent.email}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={processing === selectedStudent.user_id}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {processing === selectedStudent.user_id ? "Adding..." : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupUsers;
