import React, { useState } from 'react';
import './Login.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { postData } from '../../services/FetchNodeServices';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: login, 2: forgot password
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/v1/auth/admin/sign-in', { email, password });
      if (response.status === 200) {
        toast.success('Welcome back! Logged in successfully.');
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.log("sign up error", error);
      toast.error(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email');
      return;
    }

    setLoading(true);
    try {
      const response = await postData('api/admin/send-reset-password-email', { email });
      if (response?.status) {
        toast.success('Password reset link sent to your email.');
        setStep(1);
      } else {
        toast.error(response?.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error('Error sending reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-login">
      {/* Ambient background glow spheres */}
      <div className="login-aura-1"></div>
      <div className="login-aura-2"></div>

      <div className="login-card-container">
        {/* Brand Header */}
        <div className="login-header-brand">
          <div className="login-logo-icon">
            <i className="fa-solid fa-sparkles"></i>
          </div>
          <h2 className="login-brand-name">BeautyHub</h2>
          <span className="login-badge-pill">ADMIN SUITE</span>
        </div>

        <div className="login-intro-text">
          <h3>{step === 1 ? 'Welcome Back' : 'Reset Password'}</h3>
          <p>
            {step === 1
              ? 'Enter your administrative credentials to securely access your console.'
              : 'Enter your verified email address to receive password reset instructions.'}
          </p>
        </div>

        <form onSubmit={step === 1 ? handleLogin : handleForgotPassword} className="login-form">
          <div className="login-input-group">
            <label className="login-field-label">Email Address</label>
            <div className="login-input-wrapper">
              <i className="fa-solid fa-envelope login-input-icon"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@beautyhub.com"
                className="login-input-field"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {step === 1 && (
            <div className="login-input-group">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="login-field-label m-0">Password</label>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="login-forgot-link"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="login-input-wrapper">
                <i className="fa-solid fa-lock login-input-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="login-input-field"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-pwd-toggle-btn"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Verifying...</span>
              </span>
            ) : (
              <span>{step === 1 ? 'Sign In to Console' : 'Send Recovery Link'}</span>
            )}
          </button>

          {step === 2 && (
            <div className="login-back-action">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="login-back-btn"
              >
                <i className="fa-solid fa-arrow-left"></i> Return to Sign In
              </button>
            </div>
          )}
        </form>

        <div className="login-security-notice">
          <i className="fa-solid fa-shield-halved"></i>
          <span>Authorized Administrative Personnel Only. Session Encrypted.</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
