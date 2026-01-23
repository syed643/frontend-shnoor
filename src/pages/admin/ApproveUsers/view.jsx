import React from 'react';
import { CheckCircle2, XCircle, UserPlus, AlertCircle, ShieldAlert, GraduationCap, Briefcase } from 'lucide-react';

const ApproveUsersView = ({ loading, pendingUsers, handleAction }) => {

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--color-indigo-600)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium tracking-tight">Loading pending requests...</p>
            </div>
        </div>
    );

    return (
        <div className="p-2 h-[calc(100vh-6rem)] flex flex-col font-sans w-full">
            <div className="flex justify-between items-center mb-6 shrink-0 px-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[var(--color-indigo-600)] flex items-center justify-center border border-indigo-100 shadow-sm">
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">User Approval Queue</h2>
                        <p className="text-base text-slate-500 font-medium">Review and manage new account requests.</p>
                    </div>
                </div>
                {pendingUsers.length > 0 && (
                    <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wide border border-amber-100 shadow-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {pendingUsers.length} Requests Pending
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col w-full">
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-xs font-black text-slate-500 uppercase tracking-[0.1em]">
                            <tr>
                                <th className="py-4 px-6">Applicant</th>
                                <th className="py-4 px-6 md:table-cell hidden">Role Requested</th>
                                <th className="py-4 px-6 md:table-cell hidden">Date Registered</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pendingUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-24 text-slate-400">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <p className="font-medium text-base">No pending user requests.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pendingUsers.map(user => (
                                    <tr key={user.user_id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div>
                                                <div className="font-bold text-slate-900 text-base tracking-tight">{user.full_name || 'Unknown Name'}</div>
                                                <div className="text-sm text-slate-500 font-medium">{user.email}</div>
                                                <div className="md:hidden mt-1 flex gap-2">
                                                    { }
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 text-xs' :
                                                        user.role === 'instructor' ? 'bg-indigo-50 text-indigo-700' :
                                                            'bg-emerald-50 text-emerald-700'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 md:table-cell hidden">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                user.role === 'instructor' ? 'bg-indigo-50 text-[var(--color-indigo-600)] border-indigo-100' :
                                                    'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                }`}>
                                                {user.role === 'admin' && <ShieldAlert size={14} />}
                                                {user.role === 'instructor' && <Briefcase size={14} />}
                                                {user.role === 'student' && <GraduationCap size={14} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 md:table-cell hidden">
                                            <div className="text-sm font-bold text-slate-600 tabular-nums">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                            <div className="text-xs text-slate-400 font-medium tabular-nums">
                                                {user.created_at ? new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleAction(user.user_id, 'rejected', user.full_name)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.user_id, 'active', user.full_name)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-indigo-600)] text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:-translate-y-0.5"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 size={18} />
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
        </div>
    );
};

export default ApproveUsersView;
