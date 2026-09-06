import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const VendorRegister = () => {
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
        toast.success("Vendor registration submitted successfully!");
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
    <div className="container py-5">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary mb-2">🏪 Vendor Self-Registration &amp; KYC Portal</h3>
              <p className="text-muted small">
                Submit your business details and KYC documents (PAN &amp; Aadhaar Card) for Admin approval.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="alert alert-success text-center p-4 rounded-4 my-4">
                <div className="fs-1 mb-2">🎉</div>
                <h4 className="fw-bold">Registration Submitted!</h4>
                <p className="mb-3">
                  Your Vendor account request has been submitted with your KYC documents. Admin will inspect your uploaded PAN &amp; Aadhaar cards and approve your account.
                </p>
                <Link to="/login" className="btn btn-primary fw-bold px-4 rounded-pill">
                  Go to Login Page
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="row g-3">
                <h5 className="fw-bold text-dark border-bottom pb-2 mb-2">👤 Personal &amp; Account Details</h5>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vendor@store.com"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <h5 className="fw-bold text-dark border-bottom pb-2 mb-2 mt-4">🏢 Business Details</h5>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Business / Store Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Royal Furniture Mart"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <h5 className="fw-bold text-dark border-bottom pb-2 mb-2 mt-4">📑 KYC Identification &amp; Document Upload</h5>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    PAN Card Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Upload PAN Card Photo/Image <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="panCardDoc"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  {previews.panCardDoc && (
                    <img
                      src={previews.panCardDoc}
                      alt="PAN Preview"
                      style={{ height: "60px", objectFit: "cover" }}
                      className="mt-2 rounded border"
                    />
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Aadhaar Card Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Upload Aadhaar Card Photo/Image <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="aadharCardDoc"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  {previews.aadharCardDoc && (
                    <img
                      src={previews.aadharCardDoc}
                      alt="Aadhaar Preview"
                      style={{ height: "60px", objectFit: "cover" }}
                      className="mt-2 rounded border"
                    />
                  )}
                </div>

                <div className="col-12 mt-4 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg fw-bold px-5 rounded-pill shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting KYC Request..." : "🚀 Submit Vendor Registration Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;
