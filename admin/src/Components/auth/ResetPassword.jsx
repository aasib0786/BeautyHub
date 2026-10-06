import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postData } from '../../services/FetchNodeServices';
import { toast } from 'react-toastify';
import './Login.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await postData('api/admin/reset-password', { token, new_password: password });

      if (response?.status) {
        toast.success('Password reset successfully! Please login with your new password.');
        navigate('/login');
      } else {
        toast.error(response?.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Error during password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-login">
      <div className="login-aura-1"></div>
      <div className="login-aura-2"></div>

      <div className="login-card-container">
        <div className="login-header-brand">
          <div className="login-logo-icon">
            <i className="fa-solid fa-key"></i>
          </div>
          <h2 className="login-brand-name">BeautyHub</h2>
          <span className="login-badge-pill">SECURITY RECOVERY</span>
        </div>

        <div className="login-intro-text">
          <h3>Set New Password</h3>
          <p>Please enter your new secure password below to regain access.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-field-label">New Password</label>
            <div className="login-input-wrapper">
              <i className="fa-solid fa-lock login-input-icon"></i>
              <input
                type="password"
                className="login-input-field"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-field-label">Confirm Password</label>
            <div className="login-input-wrapper">
              <i className="fa-solid fa-shield-check login-input-icon"></i>
              <input
                type="password"
                className="login-input-field"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Updating Password...' : 'Reset & Save Password'}
          </button>

          <div className="login-back-action">
            <Link to="/login" className="login-back-btn">
              <i className="fa-solid fa-arrow-left"></i> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
