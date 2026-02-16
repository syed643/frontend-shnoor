import React from 'react';
import { User, Mail, Phone, Info, Users, CheckCircle2, Upload, Download, FileText, AlertCircle, X, FileCheck, Loader2 } from 'lucide-react';

const AddStudentView = ({ 
    loading, 
    data, 
    handleChange, 
    handleSubmit, 
    navigate, 
    showSuccessPopup, 
    setShowSuccessPopup,
    activeTab,
    setActiveTab,
    // Bulk upload props
    file,
    bulkResults,
    error,
    handleFileSelect,
    handleBulkUpload,
    handleDownloadTemplate,
    handleBulkReset,
}) => {

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--color-indigo-600)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium tracking-tight">
                    {activeTab === 'bulk' ? 'Processing CSV file...' : 'Adding student...'}
                </p>
            </div>
        </div>
    );

    return (
        <div className="p-2 w-full h-full flex flex-col font-sans">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[var(--color-indigo-600)] flex items-center justify-center shadow-sm border border-blue-100">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Management</h2>
                        <p className="text-base text-slate-500 font-medium">Add students individually or in bulk.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 bg-slate-50/30">
                    <div className="flex gap-2 px-8 pt-4">
                        <button
                            onClick={() => setActiveTab('single')}
                            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${
                                activeTab === 'single'
                                    ? 'bg-white text-[var(--color-primary)] border-t-2 border-x-2 border-[var(--color-primary)] shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <User className="inline mr-2" size={16} />
                            Single Student
                        </button>
                        <button
                            onClick={() => setActiveTab('bulk')}
                            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${
                                activeTab === 'bulk'
                                    ? 'bg-white text-[var(--color-primary)] border-t-2 border-x-2 border-[var(--color-primary)] shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <Upload className="inline mr-2" size={16} />
                            Bulk Upload
                        </button>
                    </div>
                </div>

                {/* Single Student Form */}
                {activeTab === 'single' && (
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        name="fullName"
                                        value={data.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter student name"
                                        className="input-field !pl-12 text-base"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter email address"
                                        className="input-field !pl-12 text-base"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Phone (Optional)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234..."
                                        className="input-field !pl-12 text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Bio (Optional)</label>
                            <div className="relative">
                                <Info className="absolute left-4 top-4 text-slate-400" size={20} />
                                <textarea
                                    name="bio"
                                    value={data.bio}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Short biography..."
                                    className="input-field !pl-12 resize-none text-base"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-[var(--color-primary)] hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 transform transition-all active:scale-[0.98] text-sm"
                            >
                                Add Student
                            </button>
                        </div>
                    </form>
                )}

                {/* Bulk Upload Section */}
                {activeTab === 'bulk' && (
                    <div className="p-8">
                        {/* Instructions */}
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <FileCheck size={18} />
                                Instructions
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                                <li>Download the CSV template below</li>
                                <li>Fill in student details (required: fullName, email)</li>
                                <li>Phone and bio are optional fields</li>
                                <li>Email addresses must be unique</li>
                                <li>Maximum file size: 5MB</li>
                            </ul>
                        </div>

                        {/* Download Template */}
                        <div className="mb-8">
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors border border-slate-200"
                            >
                                <Download size={20} />
                                Download CSV Template
                            </button>
                        </div>

                        {/* File Upload */}
                        <div className="mb-6">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">
                                Select CSV File
                            </label>
                            <div className="relative">
                                <input
                                    id="csv-file-input-student"
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="csv-file-input-student"
                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
                                >
                                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                                    <p className="text-slate-600 font-bold mb-1">Click to select CSV file</p>
                                    <p className="text-sm text-slate-400">or drag and drop</p>
                                </label>
                            </div>

                            {file && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-green-600" size={24} />
                                        <div>
                                            <p className="font-bold text-green-900">{file.name}</p>
                                            <p className="text-sm text-green-700">{(file.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <button onClick={handleBulkReset} className="text-green-600 hover:text-green-800">
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Error Display */}
                        {error && !bulkResults && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                <div>
                                    <p className="font-bold text-red-900">Error</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {bulkResults && (
                            <div className="mb-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <p className="text-sm text-blue-600 font-bold uppercase tracking-wide">Total Processed</p>
                                        <p className="text-3xl font-black text-blue-900">{bulkResults.summary?.total || 0}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <p className="text-sm text-green-600 font-bold uppercase tracking-wide">Successful</p>
                                        <p className="text-3xl font-black text-green-900">{bulkResults.summary?.successful || 0}</p>
                                    </div>
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-sm text-red-600 font-bold uppercase tracking-wide">Failed</p>
                                        <p className="text-3xl font-black text-red-900">{bulkResults.summary?.failed || 0}</p>
                                    </div>
                                </div>

                                {bulkResults.successful && bulkResults.successful.length > 0 && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                            <CheckCircle2 size={18} />
                                            Successfully Added ({bulkResults.successful.length})
                                        </h4>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {bulkResults.successful.map((item, index) => (
                                                <div key={index} className="text-sm text-green-800 bg-white p-3 rounded-lg">
                                                    <p className="font-bold">{item.fullName}</p>
                                                    <p className="text-green-600">{item.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {bulkResults.errors && bulkResults.errors.length > 0 && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                                            <AlertCircle size={18} />
                                            Errors ({bulkResults.errors.length})
                                        </h4>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {bulkResults.errors.map((error, index) => (
                                                <div key={index} className="text-sm bg-white p-3 rounded-lg">
                                                    <p className="font-bold text-red-900">Row {error.row}</p>
                                                    <p className="text-red-700">{error.error}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 text-sm"
                            >
                                Back to Dashboard
                            </button>
                            {bulkResults && (
                                <button
                                    type="button"
                                    onClick={handleBulkReset}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 text-sm"
                                >
                                    Upload Another File
                                </button>
                            )}
                            {file && !bulkResults && (
                                <button
                                    onClick={handleBulkUpload}
                                    className="px-8 py-3 bg-[var(--color-primary)] hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 transform transition-all active:scale-[0.98] text-sm flex items-center gap-2"
                                >
                                    <Upload size={18} />
                                    Upload CSV
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Student Added Successfully!</h3>
                        <p className="text-slate-500 mb-6">The student has been created and an invite email has been sent.</p>
                        <button
                            onClick={() => setShowSuccessPopup()}
                            className="w-full bg-[var(--color-primary)] hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddStudentView;