import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../auth/AuthContext';
import AddPracticeView from './view';

const AddPractice = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'Easy',
        starter_code: 'function solution() {\n  // Write your code here\n}',
        test_cases: [
            { input: '', output: '', is_hidden: false }
        ]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCodeChange = (value) => {
        setFormData({ ...formData, starter_code: value });
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...formData.test_cases];
        newTestCases[index][field] = value;
        setFormData({ ...formData, test_cases: newTestCases });
    };

    const addTestCase = () => {
        setFormData({
            ...formData,
            test_cases: [...formData.test_cases, { input: '', output: '', is_hidden: true }]
        });
    };

    const removeTestCase = (index) => {
        const newTestCases = formData.test_cases.filter((_, i) => i !== index);
        setFormData({ ...formData, test_cases: newTestCases });
    };

    const toggleTestCaseVisibility = (index) => {
        const newTestCases = [...formData.test_cases];
        newTestCases[index].is_hidden = !newTestCases[index].is_hidden;
        setFormData({ ...formData, test_cases: newTestCases });
    };

    const handleSubmit = async () => {
        if (!currentUser) {
            toast.error("Authentication lost. Please refresh the page.");
            return;
        }
        if (!formData.title || !formData.description) {
            toast.error("Please fill in basic details");
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/practice', {
                ...formData,
                type: 'code'
            });
            toast.success("Challenge published!");
            navigate('/instructor/practice');
        } catch (error) {
            console.error(error);
            toast.error("Failed to create challenge");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AddPracticeView
            formData={formData}
            handleChange={handleChange}
            handleCodeChange={handleCodeChange}
            handleTestCaseChange={handleTestCaseChange}
            addTestCase={addTestCase}
            removeTestCase={removeTestCase}
            toggleTestCaseVisibility={toggleTestCaseVisibility}
            handleSubmit={handleSubmit}
            navigate={navigate}
            loading={loading}
        />
    );
};

export default AddPractice;
