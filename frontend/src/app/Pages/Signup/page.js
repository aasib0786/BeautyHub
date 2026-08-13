"use client";
import React, { useState } from "react";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import "./login.css";
import Image from "next/image";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { registerUser } from "@/app/redux/slice/authSlice";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    email: "",
    otp: "",
    password: "",
    phone: "",
    fullName: "",
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendOtp = async () => {
    try {
      if (!emailRegex.test(signupData.email)) {
        setSignupErrors({ email: "Enter a valid Email address" });
        return;
      }
      const response = await axiosInstance.post(
        "/api/v1/auth/send-sign-up-otp",
        { email: signupData.email }
      );
      if (response.status === 201) {
        setOtpSent(true);
        setSendingOtp(false);
        toast.success(
          response?.data?.message || "OTP sent successfully to your email!"
        );
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
      setSendingOtp(false);
      toast.error(
        error?.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    }
  };

  const verifyOtp = async () => {
    try {
      if (!signupData.otp) {
        toast.error("Please enter the OTP sent to your email.");
        return;
      }
      const response = await axiosInstance.post(
        "/api/v1/auth/verify-sign-up-otp",
        {
          email: signupData.email,
          otp: Number(signupData.otp),
        }
      );
      if (response.status === 200) {
        setOtpVerified(true);
        setVerifyingOtp(false);
        toast.success(response?.data?.message || "OTP verified successfully!");
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to verify OTP. Please try again."
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!signupData.password) errors.password = "Password is required";
    if (!signupData.phone || signupData.phone.length !== 10)
      errors.phone = "Enter valid 10-digit phone number";

    setSignupErrors(errors);

    if (Object.keys(errors).length === 0) {
      setSubmitting(true);
      try {
        const result = await dispatch(registerUser(signupData));
        if (registerUser.fulfilled.match(result)) {
          setSignupData({
            email: "",
            otp: "",
            password: "",
            phone: "",
            fullName: "",
          });
          setSubmitting(false);
          toast.success(result.payload || "Signup successful!");
          setTimeout(() => {
            router.push("/Pages/login");
          }, 1000);
        } else {
          toast.error(result.payload || "Failed to sign up. Please try again.");
        }
      } catch (error) {
        console.log("Error during signup:", error);
        setSubmitting(false);
        toast.error(
          error?.response?.data?.message ||
            "Failed to sign up. Please try again."
        );
      }
    }
  };

  return (
    <section className="signup-furniture-container">
      <div className="signup-furniture-wrapper">
        {/* Left Image */}
        <div className="signup-furniture-left">
          <div className="furniture-overlay-text">
            <div className="text-center">
              <h1 className="SignupTitle">Build Your Dream Space</h1>
              <p className="SignupSubTitle">Elegant furniture for every corner of your life.</p>
            </div>

            <Image src="/couch.png" height={500} width={700} alt="couch img" />
          </div>
        </div>

        {/* Right Form */}
        <div className="signup-furniture-right">
          <div className="furniture-form-card">
            <h2 className="furniture-form-title">Create Your Account</h2>
            <form onSubmit={handleSignup}>
              {/* Email */}
              <div className="furniture-input-group email-with-button">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={handleChange}
                  disabled={otpSent}
                  required
                />
                {!otpSent && (
                  <button
                    type="button"
                    className="small-btn"
                    onClick={sendOtp}
                    disabled={sendingOtp}
                  >
                    {sendingOtp ? <FaSpinner className="spin" /> : "Send OTP"}
                  </button>
                )}
                {signupErrors.email && (
                  <span className="error-text">{signupErrors.email}</span>
                )}
              </div>

              {/* OTP */}
              {otpSent && !otpVerified && (
                <div className="furniture-input-group email-with-button">
                  <input
                    type="number"
                    min="0"
                    name="otp"
                    placeholder="Enter OTP"
                    value={signupData.otp}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="small-btn"
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                  {signupErrors.otp && (
                    <span className="error-text">{signupErrors.otp}</span>
                  )}
                </div>
              )}

              {/* Password & phone after OTP Verified */}
              {otpVerified && (
                <>
                  <div className="furniture-input-group">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={signupData.fullName}
                      onChange={handleChange}
                      required
                    />
                    {signupErrors.fullName && (
                      <span className="error-text">
                        {signupErrors.fullName}
                      </span>
                    )}
                  </div>
                  <div className="furniture-input-group">
                    <input
                      type="password"
                      name="password"
                      placeholder="Create Password"
                      value={signupData.password}
                      onChange={handleChange}
                      required
                    />
                    {signupErrors.password && (
                      <span className="error-text">
                        {signupErrors.password}
                      </span>
                    )}
                  </div>

                  <div className="furniture-input-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="phone Number"
                      value={signupData.phone}
                      onChange={handleChange}
                      required
                    />
                    {signupErrors.phone && (
                      <span className="error-text">{signupErrors.phone}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="furniture-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="spin" /> Signing Up...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </>
              )}

              <div className="help-text">
                Need Help? <a href="#">Contact Support</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
