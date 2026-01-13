import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import api from "../../api/axios";
import { auth } from '../../auth/firebase';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import '../../styles/Auth.css';
import brandLogo from '../../assets/SHnoor_logo_1.jpg';
import markLogo from '../../assets/just_logo.jpeg';


const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // ✅ DEFAULT ROLE
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 🔐 Firebase registration
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const token = await userCredential.user.getIdToken();

      // 🧠 Backend registration (status forced to pending)
      await api.post('/api/auth/register', {
        token,
        fullName: formData.fullName,
        role: formData.role,
      });

      setSuccessMessage(
        "Account created successfully. Your account is pending Admin approval."
      );

      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      console.error(err);

      if (err.code === 'auth/email-already-in-use') {
        setError("Email is already in use.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="login-container flex bg-background-muted">
            <div className="auth-brand-section hidden md:flex">
                <div className="brand-content">
                    <img src={brandLogo} alt="Shnoor Logo" style={{ maxWidth: '150px', marginBottom: '20px', borderRadius: '10px', display: 'block', margin: '0 auto 20px auto' }} />
                    <p className="brand-description">
                        Join our community and start your learning journey today.
                    </p>
                </div>
            </div>

            <div className="auth-form-section flex-1 flex items-center justify-center">
                <div className="login-card w-full max-w-md">
                    <div className="login-header">
                        <div className="flex items-center gap-3 mb-5">
                            <img
                                src={markLogo}
                                alt="Shnoor International"
                                style={{ width: '70px', height: '60px', borderRadius: '8px' }}
                            />
                            <div>
                                <h1 className="brand-logo text-primary text-xl md:text-2xl font-semibold mb-1 tracking-tight leading-tight">
                                    Shnoor International
                                </h1>
                                <p className="text-xs md:text-sm text-slate-500 font-medium tracking-[0.18em] uppercase">
                                    Learning Platform
                                </p>
                            </div>
                        </div>
                        <p className="brand-subtitle text-sm md:text-base mt-5">Create your Shnoor LMS account.</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message" style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{successMessage}</div>}

                    <form onSubmit={handleRegister} className="login-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "Creating Account..." : <><FaUserPlus style={{ marginRight: '8px' }} /> Register</>}
                        </button>

                        <div className="form-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                            <p>Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign In</Link></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
