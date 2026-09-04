"use client";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { FaStore, FaIdCard, FaUserCheck, FaSpinner, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

export default function VendorRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    gstNumber: "",
    panNumber: "",
    aadharNumber: "",
  });

  const [files, setFiles] = useState({
    panCardDoc: null,
    aadharCardDoc: null,
  });

  const [previews, setPreviews] = useState({
    panCardDoc: null,
    aadharCardDoc: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      setFiles((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.businessName || !formData.panNumber || !formData.aadharNumber) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (!files.panCardDoc || !files.aadharCardDoc) {
      toast.error("Please upload photos of both your PAN Card and Aadhaar Card!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      if (files.panCardDoc) payload.append("panCardDoc", files.panCardDoc);
      if (files.aadharCardDoc) payload.append("aadharCardDoc", files.aadharCardDoc);

      const res = await axiosInstance.post("/api/v1/auth/vendor/register", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Vendor registration request submitted successfully!");
        setSubmittedSuccess(true);
      }
    } catch (err) {
      console.error("Vendor registration error:", err);
      toast.error(err?.response?.data?.message || "Failed to submit vendor registration request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingTop: "40px", paddingBottom: "60px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Header Title Card */}
        <div
          className="text-center p-4 p-md-5 mb-4 rounded-4 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #153964 0%, #0d233e 100%)",
            color: "#ffffff",
          }}
        >
          <div className="d-inline-flex align-items-center justify-content-center bg-warning text-dark rounded-circle p-3 mb-3 shadow">
            <FaStore style={{ fontSize: "2rem" }} />
          </div>
          <h2 className="fw-bold mb-2">🏪 Become a BeautyHub Vendor Partner</h2>
          <p className="lead mb-0 text-white-50" style={{ fontSize: "1rem" }}>
            Register your store, upload your KYC documents, and start selling your products across BeautyHub!
          </p>
        </div>

        {submittedSuccess ? (
          <div className="bg-white p-5 rounded-4 shadow-sm border text-center">
            <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle p-4 mb-3">
              <FaCheckCircle style={{ fontSize: "3rem" }} />
            </div>
            <h3 className="fw-bold text-success mb-2">Registration Submitted Successfully!</h3>
            <p className="text-muted mb-4" style={{ fontSize: "1.05rem", lineHeight: "1.6" }}>
              Thank you for registering as a vendor on <strong>BeautyHub</strong>! Your business details and uploaded PAN &amp; Aadhaar KYC documents have been received.<br />
              <span className="badge bg-warning text-dark p-2 mt-2 fs-6">⏳ Status: PENDING ADMIN APPROVAL</span>
            </p>
            <div className="p-4 bg-light rounded-3 text-start mb-4 border">
              <h6 className="fw-bold text-dark mb-2">What happens next?</h6>
              <ul className="text-muted small mb-0 ps-3">
                <li className="mb-1">Our Admin team will inspect your uploaded PAN and Aadhaar Card documents.</li>
                <li className="mb-1">Upon successful verification, your Vendor account will be approved.</li>
                <li>Once approved, you can log in to your Vendor Portal to upload and manage your products.</li>
              </ul>
            </div>
            <div className="d-flex justify-content-center gap-3">
              <Link href="/" className="btn btn-outline-dark fw-bold px-4 rounded-pill">
                Go to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
            <form onSubmit={handleSubmit}>
              
              {/* Section 1: Account Information */}
              <div className="mb-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 border-bottom pb-2">
                  <FaUserCheck className="text-primary" /> 1. Account &amp; Personal Details
                </h5>
                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Sharma"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control py-2"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vendor@store.com"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control py-2"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      Create Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control py-2"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Business Details */}
              <div className="mb-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 border-bottom pb-2">
                  <FaStore className="text-primary" /> 2. Store &amp; Business Information
                </h5>
                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      Business / Store Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Royal Furniture Mart"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      GSTIN Number (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: KYC Identification & Documents */}
              <div className="mb-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 border-bottom pb-2">
                  <FaIdCard className="text-primary" /> 3. KYC Verification &amp; Document Upload
                </h5>
                <div className="row g-3 mt-1">
                  
                  {/* PAN Card */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      PAN Card Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      Upload PAN Card Photo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control py-2"
                      name="panCardDoc"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    {previews.panCardDoc && (
                      <div className="mt-2 text-center border p-2 rounded bg-light">
                        <img
                          src={previews.panCardDoc}
                          alt="PAN Card Preview"
                          style={{ maxHeight: "80px", maxWidth: "100%", objectFit: "contain" }}
                          className="rounded border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Aadhaar Card */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      Aadhaar Card Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-dark">
                      Upload Aadhaar Card Photo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control py-2"
                      name="aadharCardDoc"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    {previews.aadharCardDoc && (
                      <div className="mt-2 text-center border p-2 rounded bg-light">
                        <img
                          src={previews.aadharCardDoc}
                          alt="Aadhaar Card Preview"
                          style={{ maxHeight: "80px", maxWidth: "100%", objectFit: "contain" }}
                          className="rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2 border-top text-center">
                <button
                  type="submit"
                  className="btn btn-warning btn-lg fw-bold px-5 rounded-pill shadow-sm"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#f3c623", color: "#153964", border: "none" }}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spin me-2" /> Submitting Registration Request...
                    </>
                  ) : (
                    <>
                      <FaCloudUploadAlt className="me-2" /> Submit Vendor KYC &amp; Registration
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
