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
    TrendingUp,
    Search,
    Clock,
    MoreVertical,
    Mail
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const InstructorDashboardView = ({ loading, userName, stats, navigate }) => {
    // TODO: [Backend] Fetch performance chart data from /api/instructor/analytics/performance
    // Expected JSON Shape: [{ subject: string, score: number }]
    const performanceData = [];

    const [searchTerm, setSearchTerm] = useState('');

    // TODO: [Backend] Fetch student performance matrix from /api/instructor/analytics/students
    // Expected JSON Shape: 
    // [{ 
    //   id: string, 
    //   name: string, 
    //   course: string, 
    //   progress: number, 
    //   score: number, 
    //   status: 'Active' | 'At Risk' | 'Excellent' | 'Inactive' 
    // }]
    const students = [];

    const filteredStudents = [];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium animate-pulse">
            Loading dashboard...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-2 font-sans text-primary-900 flex flex-col">
            <div className="w-full space-y-8 flex-1 flex flex-col">

                {/* --- Header Section --- */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 border-b border-slate-200 pb-6 shrink-0">
                    <div>
                        <h1 className="text-3xl font-semibold text-primary-900 tracking-tight">Instructor Portal</h1>
                        <p className="text-slate-500 text-base mt-1">Welcome back, {userName}. Overview of your course performance.</p>
                    </div>
                </div>

                {/* --- KPI Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 shrink-0">
                    <KpiCard
                        title="My Courses"
                        value={stats.myCourses}
                        trend="Active"
                        isPositive={true}
                        icon={<BookOpen size={20} />}
                    />
                    <KpiCard
                        title="Total Students"
                        value={stats.totalStudents}
                        trend="12% vs last month"
                        isPositive={true}
                        icon={<Users size={20} />}
                    />
                    <KpiCard
                        title="Average Rating"
                        value={stats.avgRating}
                        trend="4.8 Target"
                        isPositive={stats.avgRating >= 4.0}
                        icon={<Star size={20} />}
                    />
                </div>

                {/* --- Main Content Area --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 shrink-0">

                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col h-[400px]">
                        <div className="flex justify-between items-center mb-8 shrink-0">
                            <div>
                                <h3 className="text-base font-semibold text-primary-900">Engagement Trends</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-0.5 bg-indigo-600"></span>
                                <span className="text-xs font-medium text-slate-500">Student Activity</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="subject"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            padding: '8px 12px',
                                            fontSize: '12px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                        itemStyle={{ padding: 0 }}
                                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#4f46e5"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, fill: '#4f46e5' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col h-[400px]">
                        <h3 className="text-base font-semibold text-primary-900 mb-6">Quick Actions</h3>
                        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                            <ActionButton
                                icon={<Plus size={18} />}
                                title="Create New Course"
                                description="Start building content"
                                onClick={() => navigate('/instructor/add-course')}
                                colorClass="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                            />
                            <ActionButton
                                icon={<Folder size={18} />}
                                title="Manage Courses"
                                description="View and edit library"
                                onClick={() => navigate('/instructor/courses')}
                                colorClass="bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white"
                            />
                            <ActionButton
                                icon={<MessageSquare size={18} />}
                                title="Message Students"
                                description="Broadcast announcements"
                                onClick={() => navigate('/instructor/chat')}
                                colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Student Performance Matrix (Merged Feature) --- */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                        <h3 className="text-base font-semibold text-primary-900">Student Performance Matrix</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Filter students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-md focus:border-slate-400 focus:ring-0 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left border-collapse h-full">
                            <thead className="bg-[#f8fafc] border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Student Name</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Course</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Progress</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wide">Avg. Score</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wide text-right">Status</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wide text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-[#f8fafc] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-primary-900 text-base">{student.name}</div>
                                            <div className="text-sm text-slate-500 mt-0.5">ID: {student.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-base text-slate-700">
                                            {student.course}
                                        </td>
                                        <td className="px-6 py-4 text-base text-slate-700 w-1/5">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs text-slate-600">
                                                    <span>Completed</span>
                                                    <span>{student.progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${student.progress < 30 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                                                        style={{ width: `${student.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-base text-slate-700 tabular-nums">
                                            <span className={`font-bold ${student.score < 70 ? 'text-rose-600' : 'text-slate-700'}`}>
                                                {student.score}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end">
                                                <StatusBadge status={student.status} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate('/instructor/chat')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded hover:bg-indigo-100 transition-colors"
                                            >
                                                <Mail size={12} /> Message
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                                            No student data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Sub-components ---

const KpiCard = ({ title, value, trend, isPositive, icon }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between h-[150px]">
        <div className="flex justify-between items-start">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-semibold text-primary-900 tracking-tight">{value}</h3>
            </div>
            <div className="text-slate-400">{icon}</div>
        </div>
        <div className="flex items-center gap-1.5 mt-4">
            {isPositive ? <ArrowUpRight size={16} className="text-emerald-600" /> : <ArrowDownRight size={16} className="text-rose-600" />}
            <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-slate-500'}`}>{trend}</span>
        </div>
    </div>
);

const ActionButton = ({ icon, title, description, onClick, colorClass }) => (
    <button
        onClick={onClick}
        className="w-full p-4 rounded-lg border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all flex items-center gap-4 text-left group bg-slate-50/50 hover:bg-white"
    >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${colorClass}`}>
            {icon}
        </div>
        <div>
            <div className="font-semibold text-primary-900 text-sm group-hover:text-indigo-600 transition-colors">{title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        </div>
    </button>
);

const StatusBadge = ({ status }) => {
    const styles = {
        Active: 'bg-emerald-100 text-emerald-700',
        'At Risk': 'bg-rose-100 text-rose-700',
        Excellent: 'bg-indigo-100 text-indigo-700',
        Inactive: 'bg-slate-100 text-slate-600'
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status] || styles.Inactive}`}>
            {status}
        </span>
    );
};

export default InstructorDashboardView;
