import React from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSignInAlt, FaGoogle } from "react-icons/fa";
import "../../styles/Auth.css";
import brandLogo from "../../assets/SHnoor_logo_1.jpg";
import markLogo from "../../assets/just_logo.jpeg";

const LoginView = ({
  formData,
  setFormData,
  showPassword,
  onTogglePassword,
  error,
  loading,
  handleLogin,
  handleGoogleSignIn,
}) => {
  const { email, password, rememberMe } = formData;
  const { setEmail, setPassword, setRememberMe } = setFormData;

  return (
    <div className="login-container flex bg-background-muted">
      <div className="auth-brand-section hidden md:flex">
        <div className="brand-content">
          <img src={brandLogo} alt="Shnoor Logo" className="brand-logo-img" />
          <p className="brand-description">
            Empower your institution with a world-class Learning Management System.
          </p>
        </div>
      </div>

      <div className="auth-form-section flex-1 flex items-center justify-center">
        <div className="login-card w-full max-w-md">
          <div className="login-header">
            <div className="flex items-center gap-3 mb-5">
              <img src={markLogo} alt="Shnoor" className="mark-logo" />
              <div>
                <h1 className="brand-logo">Shnoor International</h1>
                <p className="brand-subtitle">Learning Platform</p>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={onTogglePassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label>Remember me</label>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : <><FaSignInAlt /> Sign In</>}
            </button>

            <div className="divider">OR</div>

            <button
              type="button"
              className="login-btn google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <FaGoogle /> Google
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don’t have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
