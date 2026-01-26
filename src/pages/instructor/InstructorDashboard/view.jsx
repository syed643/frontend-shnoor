import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Star,
  Plus,
  Folder,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Mail
} from 'lucide-react';

const InstructorDashboardView = ({ loading, userName, stats, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 font-sans text-primary-900">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-semibold">Instructor Portal</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {userName}. Overview of your teaching activity.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiCard
            title="My Courses"
            value={stats.myCourses}
            trend="Active"
            isPositive
            icon={<BookOpen size={20} />}
          />
          <KpiCard
            title="Total Students"
            value={stats.totalStudents}
            trend="Enrolled"
            isPositive
            icon={<Users size={20} />}
          />
          <KpiCard
            title="Average Rating"
            value={stats.avgRating}
            trend="Platform Avg"
            isPositive={stats.avgRating >= 4}
            icon={<Star size={20} />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg">Quick Actions</h3>

            <ActionButton
              icon={<Plus size={18} />}
              title="Create New Course"
              description="Build new content"
              onClick={() => navigate('/instructor/add-course')}
            />
            <ActionButton
              icon={<Folder size={18} />}
              title="Manage Courses"
              description="Edit your library"
              onClick={() => navigate('/instructor/courses')}
            />
            <ActionButton
              icon={<MessageSquare size={18} />}
              title="Message Students"
              description="Send announcements"
              onClick={() => navigate('/instructor/chat')}
            />
          </div>

          {/* Placeholder Analytics */}
          <div className="lg:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Analytics</h3>
            <div className="h-48 flex items-center justify-center text-slate-400">
              Analytics coming soon
            </div>
          </div>
        </div>

        {/* Student Table Placeholder */}
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="font-semibold text-lg">Students</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-md"
              />
            </div>
          </div>

          <div className="p-10 text-center text-slate-400">
            No student data available
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboardView;

/* ---------- Sub Components ---------- */

const KpiCard = ({ title, value, trend, isPositive, icon }) => (
  <div className="bg-white border rounded-lg p-6 shadow-sm">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-3xl font-semibold">{value}</h3>
      </div>
      <div className="text-slate-400">{icon}</div>
    </div>
    <div className="flex items-center gap-2 mt-4 text-sm">
      {isPositive ? (
        <ArrowUpRight className="text-emerald-600" size={16} />
      ) : (
        <ArrowDownRight className="text-rose-600" size={16} />
      )}
      <span className="text-slate-500">{trend}</span>
    </div>
  </div>
);

const ActionButton = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-lg border hover:shadow-sm transition bg-slate-50 hover:bg-white"
  >
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
      {icon}
    </div>
    <div className="text-left">
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-slate-500">{description}</div>
    </div>
  </button>
);
