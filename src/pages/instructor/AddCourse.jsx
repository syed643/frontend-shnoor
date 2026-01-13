import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { FaPlus, FaVideo, FaFileAlt, FaArrowRight, FaArrowLeft, FaSave, FaTrash, FaCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { auth } from '../../auth/firebase';
import '../../styles/Dashboard.css';
import api from "../../api/axios";


const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editCourseId = searchParams.get('edit');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    customCategory: '',
    status: 'draft',
    modules: []
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    type: 'video',
    url: '',
    duration: ''
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (location.state?.courseData) {
      const data = location.state.courseData;
      setCourseData({
        title: data.title || '',
        description: data.description || 'No description provided.',
        category: data.category || 'Development',
        customCategory: '',
        status: data.status || 'draft',
        modules: data.modules || []
      });
      setLoading(false);
    } else if (editCourseId) {
      setLoading(true);
      setTimeout(() => {
        setCourseData({
          title: 'Mock Course',
          description: 'This is a mock course for frontend demo.',
          category: 'Development',
          customCategory: '',
          status: 'draft',
          modules: []
        });
        setLoading(false);
      }, 500);
    }
  }, [editCourseId, location.state]);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (value === 'custom') {
        setIsCustomCategory(true);
        setCourseData({ ...courseData, category: '' });
      } else {
        setIsCustomCategory(false);
        setCourseData({ ...courseData, category: value });
      }
    } else {
      setCourseData({ ...courseData, [name]: value });
    }
  };

  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setModuleForm(prev => {
      const updates = { ...prev, [name]: value };
      if (name === 'url' && prev.type === 'video' && value.includes('youtube')) {
        updates.duration = '15';
      }
      return updates;
    });
  };

  const addModule = (e) => {
    e.preventDefault();
    const newModule = {
      id: Date.now().toString(),
      ...moduleForm,
      duration: moduleForm.type === 'pdf' ? 0 : moduleForm.duration
    };
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
    setModuleForm({ title: '', type: 'video', url: '', duration: '' });
  };

  const removeModule = (id) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== id)
    }));
  };

  const moveModule = (index, direction) => {
    const newModules = [...courseData.modules];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newModules.length) {
      const [movedModule] = newModules.splice(index, 1);
      newModules.splice(targetIndex, 0, movedModule);
      setCourseData(prev => ({ ...prev, modules: newModules }));
    }
  };

const handleSubmit = async (statusOverride) => {
  if (!auth.currentUser) return;

  setLoading(true);

  try {
    const token = await auth.currentUser.getIdToken();

    const finalCategory = isCustomCategory
      ? courseData.customCategory
      : courseData.category;

    /* 1️⃣ CREATE COURSE */
    const courseRes = await api.post(
      "/api/courses",
      {
        title: courseData.title,
        description: courseData.description,
        category: finalCategory,
        status: statusOverride === "published" ? "pending" : "draft",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

const courseId = courseRes.data.course.courses_id;

    /* 2️⃣ CREATE MODULES */
    if (courseData.modules.length > 0) {
      await api.post(
        "/api/modules",
        {
          courseId,
          modules: courseData.modules.map((m, index) => ({
            title: m.title,
            type: m.type,
            content_url: m.url,
            duration: m.duration || 0,
            order_index: index + 1,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    alert(
      statusOverride === "published"
        ? "Course submitted for admin approval"
        : "Course saved as draft"
    );

    navigate("/instructor/dashboard");
  } catch (error) {
    console.error("Save course error:", error);
    alert("Failed to save course");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="p-8">Processing...</div>;

  return (
    <div className="form-container">
      <div className="form-box full-width">
        <div className="stepper-header">
          <h3 className="form-header mb-0">
            {editCourseId ? 'Edit Course' : 'Create New Course'}
          </h3>
          <div className="text-sm text-gray-500">Step {step} of 3</div>
        </div>

        <div className="stepper-progress">
          {[1, 2, 3].map(s => (
            <div key={s} className={`stepper-bar ${step >= s ? 'active' : ''}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="grid-2">
            <div className="full-width form-group">
              <label>Course Title</label>
              <input
                name="title"
                placeholder="e.g. Mastering React.js"
                value={courseData.title}
                onChange={handleCourseChange}
                required
              />
            </div>
            <div className="full-width form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="What will students learn?"
                value={courseData.description}
                onChange={handleCourseChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={isCustomCategory ? 'custom' : courseData.category} onChange={handleCourseChange}>
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="DevOps">DevOps</option>
                <option value="Data Science">Data Science</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="custom">+ Add New Category</option>
              </select>
            </div>

            {isCustomCategory && (
              <div className="form-group">
                <label>New Category Name</label>
                <input
                  name="customCategory"
                  placeholder="e.g. Cyber Security"
                  value={courseData.customCategory}
                  onChange={handleCourseChange}
                />
              </div>
            )}

            <div className="full-width form-actions">
              <button className="btn-primary" onClick={() => setStep(2)}>
                Next: Add Content <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="module-card">
              <h4 className="mt-0 mb-sm">Add New Module</h4>
              <div className="grid-2">
                <div className="form-group full-width">
                  <label>Module Title</label>
                  <input
                    name="title"
                    placeholder="e.g. Introduction Video"
                    value={moduleForm.title}
                    onChange={handleModuleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={moduleForm.type} onChange={handleModuleChange}>
                    <option value="video">Video</option>
                    <option value="pdf">PDF Document</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Content URL</label>
                  <input
                    name="url"
                    placeholder={moduleForm.type === 'video' ? "YouTube / Drive URL" : "PDF Link"}
                    value={moduleForm.url}
                    onChange={handleModuleChange}
                  />
                </div>

                {moduleForm.type === 'video' && (
                  <div className="form-group">
                    <label>Duration (mins)</label>
                    <input
                      type="number"
                      name="duration"
                      placeholder="Auto-detected if possible"
                      value={moduleForm.duration}
                      onChange={handleModuleChange}
                    />
                  </div>
                )}

                <div className="full-width">
                  <button className="btn-secondary w-100" onClick={addModule}>
                    <FaPlus /> Add Module
                  </button>
                </div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h3>Modules ({courseData.modules.length})</h3>
              </div>
              {courseData.modules.length === 0 ? (
                <p className="text-gray-500 text-sm p-4 text-center">No modules added yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseData.modules.map((m, idx) => (
                      <tr key={m.id}>
                        <td>{m.type === 'video' ? <FaVideo className="text-red-500" /> : <FaFileAlt className="text-blue-500" />}</td>
                        <td>{m.title}</td>
                        <td>{m.type === 'video' ? `${m.duration}m` : '-'}</td>
                        <td>
                          <div className="gap-sm" style={{ display: 'flex' }}>
                            <button
                              className="btn-icon"
                              onClick={() => moveModule(idx, -1)}
                              disabled={idx === 0}
                              title="Move Up"
                            >
                              <FaArrowUp color={idx === 0 ? '#ccc' : '#4b5563'} />
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => moveModule(idx, 1)}
                              disabled={idx === courseData.modules.length - 1}
                              title="Move Down"
                            >
                              <FaArrowDown color={idx === courseData.modules.length - 1 ? '#ccc' : '#4b5563'} />
                            </button>
                            <button className="btn-icon delete" onClick={() => removeModule(m.id)} title="Remove Module">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="form-actions flex-between-center">
              <button className="btn-secondary" onClick={() => setStep(1)}><FaArrowLeft /> Back</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Next: Review <FaArrowRight /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="review-text-center">
              <h2 className="review-title">Ready to Publish?</h2>
              <p className="text-gray-600">Review your course details below.</p>
            </div>

            <div className="review-section">
              <p><strong>Title:</strong> {courseData.title}</p>
              <p><strong>Category:</strong> {isCustomCategory ? courseData.customCategory : courseData.category}</p>
              <p><strong>Modules:</strong> {courseData.modules.length}</p>
              <p><strong>Duration:</strong> {courseData.modules.reduce((acc, m) => acc + Number(m.duration || 0), 0)} mins</p>
            </div>

            <div className="form-actions flex-between-center">
              <button className="btn-secondary" onClick={() => setStep(2)}><FaArrowLeft /> Back</button>
              <div className="flex-center-gap">
                <button className="btn-secondary" onClick={() => handleSubmit('draft')}>
                  <FaSave /> Save as Draft
                </button>
                <button className="btn-primary" onClick={() => handleSubmit('published')}>
                  <FaCheck /> Publish Course
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCourse;