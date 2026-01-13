import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../auth/firebase';
import '../../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('If an account exists with this email, a reset link has been sent.');
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="auth-brand-section">
        <div className="brand-content">
          <h1 className="brand-logo">Security First</h1>
          <p className="brand-description">
            We value your security. Follow the instructions to securely reset your password
            and regain access to your Shnoor Dashboard.
          </p>
          <div className="brand-testimonial">
            <span className="quote-text">"The support team helped me recover my account in minutes. Great service!"</span>
            <span className="quote-author">- James Wilson, Administrator</span>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="login-card">
          <div className="login-header">
            <h2 className="brand-title">Reset Password</h2>
            <p className="brand-subtitle">Enter your email to receive reset instructions.</p>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          {message && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              textAlign: 'center',
              border: '1px solid #bbf7d0',
              fontWeight: '500'
            }}>
              ✅ {message}
            </div>
          )}

          <form onSubmit={handleReset} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>

          <div className="login-footer">
            <p>Remembered your password? <Link to="/" className="link">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;