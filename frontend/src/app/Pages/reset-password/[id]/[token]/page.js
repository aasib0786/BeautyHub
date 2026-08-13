"use client";
import React, { useEffect, useState } from 'react';
import '../../../forgot-password/forgot.css';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/app/Components/assets/logo.png';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/app/utils/axiosInstance';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id, token } = useParams(); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/api/v1/auth/reset-password/${id}/${token}`, {
        password: newPassword,
      });

      toast.success("Password reset successful!");
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="forgot-wrapper">
        <div className="left-panel d-none d-md-flex flex-column justify-content-center text-white p-5">
          <div className="text-center">
            <Image src={logo} alt="Logo" width={150} className="mb-4" />
            <h1 className="display-5 fw-bold text-dark">MANMOHAN FURNITURES</h1>
            <p className="lead mt-3 text-dark">Secure, elegant password recovery experience.</p>
          </div>
        </div>

        <div className="right-panel d-flex align-items-center justify-content-center p-4">
          <div className="auth-box rounded-4 shadow-lg">
            <h2 className="text-center TitleSec fw-bold mb-4">Reset Password</h2>
            <p className="text-center text-muted mb-4">Enter and confirm your new password.</p>

            <form onSubmit={handlePasswordReset}>
              <div className="position-relative mb-3">
                <input
                  type={showPassword.password ? 'text' : 'password'}
                  className="form-control"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span className="toggle-icon" onClick={() => togglePasswordVisibility('password')}>
                  <i className={`bi ${showPassword.password ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}></i>
                </span>
              </div>

              <div className="position-relative mb-3">
                <input
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="toggle-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
                  <i className={`bi ${showPassword.confirmPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}></i>
                </span>
              </div>

              <button className="btn btn-dark w-100">Reset Password</button>
            </form>

            <div className="text-center mt-3">
              <Link href="/Pages/Login" className="text-white fw-semibold text-decoration-none">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
