/* eslint-disable react-hooks/static-components */
import React, { useEffect, useRef, useState } from "react";
import {
  Users,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Search,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DateRangeFilter from "../../../components/DateRangeFilter";
import Papa from "papaparse";

const AdminDashboardView = ({
  stats,
  chartData,
  loading,
  onSearch,
  searchResults,
  searchLoading,
  dateRange,
  setDateRange,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef(null);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchExpanded(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  if (loading)
    return (
      <div className="p-10 text-slate-400 animate-pulse font-medium">
        Syncing data...
      </div>
    );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) onSearch(value);
    }, 400);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchExpanded(false);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: "bg-green-100 text-green-700",
      Intermediate: "bg-yellow-100 text-yellow-700",
      Advanced: "bg-red-100 text-red-700",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // eslint-disable-next-line no-unused-vars
  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm group hover:border-indigo-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={22} />
        </div>
        {stats?.change !== undefined && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            <TrendingUp size={12} /> {stats.change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <h3 className="text-3xl font-semibold text-primary-900 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );

  const handleDownload = () => {
    const csv = Papa.unparse([stats]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-dashboard.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-6 font-sans text-primary-900">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Analytics Overview
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-base">
              Real-time performance metrics across the platform.
            </p>
          </div>
          <div className="flex items-end gap-4">
            {/* Search Component */}
            <div className="relative">
              <div
                className={`relative transition-all duration-300 ${isSearchExpanded ? "w-96" : "w-64"}`}
              >
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full transition-all shadow-sm"
                  placeholder="Search parameters..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchExpanded(true)}
                />
              </div>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}

            {/* Search Results Dropdown */}
            {isSearchExpanded && searchQuery && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center text-slate-500">
                    Searching...
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => {
                          window.location.href =
                            result.type === "course"
                              ? `/admin/courses/${result.id}`
                              : `/admin/modules/${result.id}`;
                        }}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          {result.thumbnail_url ? (
                            <img
                              src={result.thumbnail_url}
                              alt={result.title}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="text-indigo-600" size={24} />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-slate-900 truncate">
                                {result.title}
                              </h4>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${result.type === "module" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                              >
                                {result.type === "module" ? "Module" : "Course"}
                              </span>
                            </div>

                            {result.instructor_name && (
                              <p className="text-xs text-indigo-600 font-medium mb-1">
                                👤 {result.instructor_name}
                              </p>
                            )}

                            {result.type === "module" &&
                              result.course_title && (
                                <p className="text-xs text-slate-500 font-medium mb-1">
                                  📚 In Course: {result.course_title}
                                </p>
                              )}

                            <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                              {result.description || "No description available"}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                              {result.category && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                                  {result.category}
                                </span>
                              )}
                              {result.difficulty && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(result.difficulty)}`}
                                >
                                  {result.difficulty}
                                </span>
                              )}
                              {result.status && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(result.status)}`}
                                >
                                  {result.status}
                                </span>
                              )}
                            </div>

                            {result.validity_value && result.validity_unit && (
                              <p className="text-xs text-slate-500 mt-2">
                                Valid for: {result.validity_value}{" "}
                                {result.validity_unit}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500">
                    No courses or modules found
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>

      {/* Click outside to close search */}
      {isSearchExpanded && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsSearchExpanded(false)}
        />
      )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Total Students"
          value={stats?.totalStudents ?? 0}
          icon={Users}
          color="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            label="Completion Rates"
            value={`${stats?.completionRate ?? 0}%`}
            icon={BookOpen}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Total Learning Hours"
            value={stats?.totalHours ?? 0}
            icon={Clock}
            color="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Certificates Issued"
            value={stats?.certificates ?? 0}
            icon={Award}
            color="bg-rose-50 text-rose-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[420px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Learning Activity
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  Lessons Completed
                </div>
              </div>
            </div>
            <div className="flex-1">
              {(!chartData || chartData.length === 0) && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No activity in selected date range
                </div>
              )}
              {chartData?.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                      dy={10}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="lessons"
                      fill="#0f172a"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Download Analytics
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Export reports for selected date range.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <DateRangeFilter value={dateRange} onChange={setDateRange} />
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
            >
              Download CSV Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
