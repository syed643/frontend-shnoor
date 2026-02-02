import React, { useState } from 'react';
import { ArrowLeft, Save, Code, CheckCircle, Trash2, Plus } from 'lucide-react';
import Editor from '@monaco-editor/react';

const AddPracticeView = ({
    formData, handleChange, handleCodeChange,
    handleTestCaseChange, addTestCase, removeTestCase, toggleTestCaseVisibility,
    handleSubmit, navigate, loading
}) => {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-primary-900 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/instructor/practice')}
                        className="p-2 -ml-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-primary-900">New Coding Challenge</h1>
                        <p className="text-xs text-slate-500 font-medium">Create a practice problem for students</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-instructor-primary flex items-center gap-2 px-6"
                >
                    {loading ? 'Saving...' : <><Save size={18} /> Publish Challenge</>}
                </button>
            </div>

            <div className="max-w-5xl mx-auto mt-8 px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Metadata */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">Basic Info</h3>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Two Sum"
                                className="w-full px-4 py-2 border border-slate-200 rounded-md focus:border-indigo-500 outline-none text-sm font-semibold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Difficulty</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-md focus:border-indigo-500 outline-none text-sm bg-white"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Problem statement..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-md focus:border-indigo-500 outline-none text-sm resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-xs">
                        <strong>Note:</strong> Public test cases are shown to students immediately. Hidden test cases are run only upon submission.
                    </div>
                </div>

                {/* Right Column: Code & Test Cases */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Starter Code */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide">Starter Code</h3>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">JavaScript</span>
                        </div>
                        <div className="h-64">
                            <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                value={formData.starter_code}
                                onChange={handleCodeChange}
                                theme="light"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>
                    </div>

                    {/* Test Cases */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Test Cases</h3>
                            <button
                                onClick={addTestCase}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                            >
                                <Plus size={14} /> Add Case
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.test_cases.map((tc, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="w-6 h-6 rounded-full bg-white text-slate-400 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0 mt-1">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Input (Args)</label>
                                            <input
                                                value={tc.input}
                                                onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                                placeholder="e.g. [2, 7, 11, 15], 9"
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none font-mono"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Expected Output</label>
                                            <input
                                                value={tc.output} // Using 'output' matching backend field expectation for JSON
                                                onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                                placeholder="e.g. [0, 1]"
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-5">
                                        <button
                                            onClick={() => toggleTestCaseVisibility(index)}
                                            className={`p-1.5 rounded transition-colors flex items-center justify-center gap-1 text-[10px] font-bold uppercase w-20 
                                                ${tc.is_hidden
                                                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                }`}
                                            title={tc.is_hidden ? "Hidden from students" : "Visible to students"}
                                        >
                                            {tc.is_hidden ? <><Code size={12} /> Hidden</> : <><CheckCircle size={12} /> Public</>}
                                        </button>
                                        <button
                                            onClick={() => removeTestCase(index)}
                                            className="text-slate-400 hover:text-rose-500 p-1.5 self-center"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {formData.test_cases.length === 0 && (
                                <div className="text-center py-6 text-slate-400 text-sm italic">
                                    No test cases added yet.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddPracticeView;
