import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // KYC Modal Inspection state
  const [selectedVendorKYC, setSelectedVendorKYC] = useState(null);
  const [kycFormData, setKycFormData] = useState({
    businessName: "",
    gstNumber: "",
    panNumber: "",
    aadharNumber: "",
  });
  const [kycFiles, setKycFiles] = useState({
    panCardDoc: null,
    aadharCardDoc: null,
  });

  // Lightbox Image Preview state
  const [previewDoc, setPreviewDoc] = useState(null); // { title: "", url: "" }

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "Manage Vendors", "write") || storedUser.role === "superadmin" || storedUser.role === "super_admin" || storedUser.role === "admin";
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Vendors", "update") || storedUser.role === "superadmin" || storedUser.role === "super_admin" || storedUser.role === "admin";
  const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Vendors", "delete") || storedUser.role === "superadmin" || storedUser.role === "super_admin" || storedUser.role === "admin";

  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    gstNumber: "",
    panNumber: "",
    aadharNumber: "",
    role: "vendor",
  });
  const [newVendorFiles, setNewVendorFiles] = useState({
    panCardDoc: null,
    aadharCardDoc: null,
  });

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/admin-management/get-all-vendors");
      if (res?.data?.data) {
        setVendors(res.data.data);
      }
    } catch (err) {
      console.error("Fetch vendors error:", err);
      toast.error(err?.response?.data?.message || "Failed to load vendors list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleToggleVerify = async (vendorId, currentStatus, vendorName) => {
    try {
      const res = await axiosInstance.put(`/api/v1/admin-management/toggle-verification/${vendorId}`);
      if (res.status === 200) {
        const newStatus = !currentStatus;
        setVendors(
          vendors.map((v) =>
            v._id === vendorId ? { ...v, isVerified: newStatus } : v
          )
        );
        if (selectedVendorKYC && selectedVendorKYC._id === vendorId) {
          setSelectedVendorKYC((prev) => ({ ...prev, isVerified: newStatus }));
        }
        toast.success(
          newStatus
            ? `Vendor "${vendorName}" Approved & Verified successfully! 🎉`
            : `Vendor "${vendorName}" status changed to Unverified/Pending.`
        );
      }
    } catch (err) {
      console.error("Toggle verify error:", err);
      toast.error(err?.response?.data?.message || "Failed to update vendor verification");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newVendor).forEach((key) => {
        formData.append(key, newVendor[key]);
      });
      formData.append("role", "vendor");

      if (newVendorFiles.panCardDoc) formData.append("panCardDoc", newVendorFiles.panCardDoc);
      if (newVendorFiles.aadharCardDoc) formData.append("aadharCardDoc", newVendorFiles.aadharCardDoc);

      const res = await axiosInstance.post("/api/v1/admin-management/create-admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast.success("New Vendor Account created successfully! 🏪");
        setShowCreateModal(false);
        setNewVendor({
          name: "",
          email: "",
          password: "",
          phone: "",
          businessName: "",
          gstNumber: "",
          panNumber: "",
          aadharNumber: "",
          role: "vendor",
        });
        setNewVendorFiles({ panCardDoc: null, aadharCardDoc: null });
        fetchVendors();
      }
    } catch (err) {
      console.error("Create vendor error:", err);
      toast.error(err?.response?.data?.message || "Error creating vendor account");
    }
  };

  const handleOpenKYCModal = (vendor) => {
    setSelectedVendorKYC(vendor);
    setKycFormData({
      businessName: vendor.businessName || "",
      gstNumber: vendor.gstNumber || "",
      panNumber: vendor.panNumber || "",
      aadharNumber: vendor.aadharNumber || "",
    });
    setKycFiles({ panCardDoc: null, aadharCardDoc: null });
  };

  const handleSaveKYC = async (e) => {
    e.preventDefault();
    if (!selectedVendorKYC) return;
    try {
      const formData = new FormData();
      Object.keys(kycFormData).forEach((key) => {
        formData.append(key, kycFormData[key]);
      });

      if (kycFiles.panCardDoc) formData.append("panCardDoc", kycFiles.panCardDoc);
      if (kycFiles.aadharCardDoc) formData.append("aadharCardDoc", kycFiles.aadharCardDoc);

      const res = await axiosInstance.put(
        `/api/v1/admin-management/update-vendor-kyc/${selectedVendorKYC._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        toast.success("Vendor KYC details and documents updated successfully!");
        setSelectedVendorKYC(null);
        fetchVendors();
      }
    } catch (err) {
      console.error("Save KYC error:", err);
      toast.error(err?.response?.data?.message || "Failed to update vendor KYC");
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    const confirm = await Swal.fire({
      title: "Delete Vendor Account?",
      text: "This action will permanently delete this vendor and revoke access!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/api/v1/admin-management/delete-admin/${vendorId}`);
        if (res.status === 200) {
          toast.success("Vendor account deleted successfully!");
          fetchVendors();
        }
      } catch (err) {
        console.error("Delete vendor error:", err);
        toast.error("Failed to delete vendor account");
      }
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v?.phone?.includes(searchQuery) ||
      v?.panNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v?.aadharNumber?.includes(searchQuery)
  );

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head d-flex align-items-center justify-content-between w-100">
          <h4>🏪 Vendor Approval &amp; Verification Console</h4>
          <div>
            {canWrite && (
              <button
                className="btn btn-primary fw-bold rounded-pill shadow-sm"
                onClick={() => setShowCreateModal(true)}
              >
                + Add Vendor Manually
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="d-flex justify-content-between align-items-center my-3 bg-white p-3 rounded border shadow-sm">
        <div className="search-box" style={{ width: "350px" }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="🔍 Search vendor by name, business, email, PAN, Aadhaar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: "20px", padding: "6px 14px" }}
          />
        </div>
        <div className="d-flex gap-2 align-items-center">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
            Pending Approval: {vendors.filter((v) => !v.isVerified).length}
          </span>
          <span className="badge bg-success px-3 py-2 rounded-pill fw-bold">
            Verified Vendors: {vendors.filter((v) => v.isVerified).length}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <section className="main-table bg-white p-3 rounded border shadow-sm">
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Sr.No.</th>
                <th>Vendor / Store Info</th>
                <th>Contact Details</th>
                <th>KYC Documents Status</th>
                <th className="text-center">Total Products</th>
                <th className="text-center">Approval Status</th>
                <th className="text-center">Approve &amp; Verify</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 fw-bold text-muted">
                    Loading Vendors...
                  </td>
                </tr>
              ) : filteredVendors.length > 0 ? (
                filteredVendors.map((vendor, index) => {
                  return (
                    <tr key={vendor._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="fw-bold text-dark">🏪 {vendor.name}</div>
                        {vendor.businessName && (
                          <div className="text-primary small fw-bold mt-1">
                            🏢 {vendor.businessName}
                          </div>
                        )}
                        {vendor.gstNumber && (
                          <div className="text-muted small">GSTIN: {vendor.gstNumber}</div>
                        )}
                      </td>
                      <td>
                        <div>📧 {vendor.email}</div>
                        <div>📞 {vendor.phone || "N/A"}</div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {vendor.panNumber && (
                            <div className="small">
                              <strong>PAN:</strong> {vendor.panNumber}{" "}
                              {vendor.panCardDoc ? (
                                <span className="badge bg-success-subtle text-success border border-success ms-1">
                                  Doc Uploaded
                                </span>
                              ) : (
                                <span className="badge bg-danger-subtle text-danger border border-danger ms-1">
                                  No Image
                                </span>
                              )}
                            </div>
                          )}

                          {vendor.aadharNumber && (
                            <div className="small">
                              <strong>Aadhaar:</strong> {vendor.aadharNumber}{" "}
                              {vendor.aadharCardDoc ? (
                                <span className="badge bg-success-subtle text-success border border-success ms-1">
                                  Doc Uploaded
                                </span>
                              ) : (
                                <span className="badge bg-danger-subtle text-danger border border-danger ms-1">
                                  No Image
                                </span>
                              )}
                            </div>
                          )}

                          {!vendor.panNumber && !vendor.aadharNumber && (
                            <span className="text-danger small fw-bold">✕ No KYC Details</span>
                          )}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary fw-bold mt-1"
                            onClick={() => handleOpenKYCModal(vendor)}
                          >
                            🔎 View KYC &amp; Docs
                          </button>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info text-dark px-3 py-1 rounded-pill fw-bold">
                          {vendor.productCount || 0} Products
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            vendor.isVerified
                              ? "bg-success text-white"
                              : "bg-warning text-dark border border-warning"
                          }`}
                        >
                          {vendor.isVerified ? "KYC VERIFIED" : "KYC PENDING"}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-center m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            disabled={!canUpdate}
                            checked={vendor.isVerified ?? false}
                            onChange={() =>
                              canUpdate &&
                              handleToggleVerify(vendor._id, vendor.isVerified, vendor.name)
                            }
                            style={{
                              cursor: canUpdate ? "pointer" : "not-allowed",
                              width: "44px",
                              height: "22px",
                            }}
                          />
                        </div>
                      </td>
                      <td className="text-center">
                        {canDelete && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger fw-bold"
                            onClick={() => handleDeleteVendor(vendor._id)}
                          >
                            ✕ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-3 text-muted">
                    No Vendors found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* KYC Inspection & Edit Modal */}
      {selectedVendorKYC && (
        <div
          className="modal d-block bg-dark bg-opacity-75"
          tabIndex="-1"
          onClick={() => setSelectedVendorKYC(null)}
          style={{ cursor: "pointer" }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            style={{ cursor: "default" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white d-flex align-items-center justify-content-between">
                <h5 className="modal-title fw-bold mb-0">
                  🔎 Vendor KYC &amp; Verification Details — {selectedVendorKYC.name}
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light rounded-circle p-0"
                  style={{ width: "32px", height: "32px" }}
                  onClick={() => setSelectedVendorKYC(null)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveKYC}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Left side: Uploaded Image Preview Cards */}
                    <div className="col-lg-6 border-end">
                      <h6 className="fw-bold text-primary mb-3">📄 Uploaded KYC Document Images</h6>

                      <div className="mb-4">
                        <label className="form-label fw-bold small text-dark d-flex justify-content-between">
                          <span>PAN Card Document</span>
                          {selectedVendorKYC.panCardDoc && (
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 fw-bold text-decoration-none"
                              onClick={() =>
                                setPreviewDoc({
                                  title: `${selectedVendorKYC.name} - PAN Card`,
                                  url: selectedVendorKYC.panCardDoc,
                                })
                              }
                            >
                              🔍 Expand Image
                            </button>
                          )}
                        </label>

                        {selectedVendorKYC.panCardDoc ? (
                          <div className="border rounded p-2 bg-light text-center">
                            <img
                              src={selectedVendorKYC.panCardDoc}
                              alt="PAN Card"
                              style={{ maxHeight: "180px", maxWidth: "100%", objectFit: "contain" }}
                              className="rounded border"
                            />
                          </div>
                        ) : (
                          <div className="alert alert-warning small p-3 text-center mb-2">
                            ⚠️ No PAN Card document photo uploaded yet.
                          </div>
                        )}

                        <div className="mt-2">
                          <label className="form-label small text-muted">Upload/Replace PAN Card Image:</label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/*"
                            onChange={(e) =>
                              setKycFiles({ ...kycFiles, panCardDoc: e.target.files[0] })
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold small text-dark d-flex justify-content-between">
                          <span>Aadhaar Card Document</span>
                          {selectedVendorKYC.aadharCardDoc && (
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 fw-bold text-decoration-none"
                              onClick={() =>
                                setPreviewDoc({
                                  title: `${selectedVendorKYC.name} - Aadhaar Card`,
                                  url: selectedVendorKYC.aadharCardDoc,
                                })
                              }
                            >
                              🔍 Expand Image
                            </button>
                          )}
                        </label>

                        {selectedVendorKYC.aadharCardDoc ? (
                          <div className="border rounded p-2 bg-light text-center">
                            <img
                              src={selectedVendorKYC.aadharCardDoc}
                              alt="Aadhaar Card"
                              style={{ maxHeight: "180px", maxWidth: "100%", objectFit: "contain" }}
                              className="rounded border"
                            />
                          </div>
                        ) : (
                          <div className="alert alert-warning small p-3 text-center mb-2">
                            ⚠️ No Aadhaar Card document photo uploaded yet.
                          </div>
                        )}

                        <div className="mt-2">
                          <label className="form-label small text-muted">Upload/Replace Aadhaar Card Image:</label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/*"
                            onChange={(e) =>
                              setKycFiles({ ...kycFiles, aadharCardDoc: e.target.files[0] })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right side: Information and Quick Approval */}
                    <div className="col-lg-6">
                      <h6 className="fw-bold text-primary mb-3">🏢 Business &amp; Identification Details</h6>

                      <div className="mb-3">
                        <label className="form-label fw-bold small">Business / Store Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={kycFormData.businessName}
                          onChange={(e) =>
                            setKycFormData({ ...kycFormData, businessName: e.target.value })
                          }
                          placeholder="e.g. Royal Beauty Hub"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold small">GSTIN Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={kycFormData.gstNumber}
                          onChange={(e) =>
                            setKycFormData({ ...kycFormData, gstNumber: e.target.value })
                          }
                          placeholder="22AAAAA0000A1Z5"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold small">PAN Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={kycFormData.panNumber}
                          onChange={(e) =>
                            setKycFormData({ ...kycFormData, panNumber: e.target.value })
                          }
                          placeholder="ABCDE1234F"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold small">Aadhaar Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={kycFormData.aadharNumber}
                          onChange={(e) =>
                            setKycFormData({ ...kycFormData, aadharNumber: e.target.value })
                          }
                          placeholder="1234 5678 9012"
                        />
                      </div>

                      <div className="p-3 bg-light rounded border mt-4">
                        <h6 className="fw-bold mb-2">Verification Action</h6>
                        <p className="small text-muted mb-3">
                          Verify uploaded documents and grant full seller access to this vendor.
                        </p>
                        <button
                          type="button"
                          className={`btn w-100 fw-bold rounded-pill ${
                            selectedVendorKYC.isVerified ? "btn-success" : "btn-warning"
                          }`}
                          onClick={() =>
                            handleToggleVerify(
                              selectedVendorKYC._id,
                              selectedVendorKYC.isVerified,
                              selectedVendorKYC.name
                            )
                          }
                        >
                          {selectedVendorKYC.isVerified
                            ? "✅ Vendor is VERIFIED & APPROVED (Click to Unverify)"
                            : "⚡ Click to APPROVE & VERIFY VENDOR KYC"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() => setSelectedVendorKYC(null)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary fw-bold rounded-pill px-4">
                    Save KYC Details &amp; Documents
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Document Preview Modal */}
      {previewDoc && (
        <div
          className="modal d-block bg-dark bg-opacity-75"
          tabIndex="-1"
          onClick={() => setPreviewDoc(null)}
          style={{ cursor: "pointer" }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{ cursor: "default" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white d-flex align-items-center justify-content-between">
                <h5 className="modal-title fw-bold mb-0">📄 Document Preview: {previewDoc.title}</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light rounded-circle p-0"
                  style={{ width: "32px", height: "32px" }}
                  onClick={() => setPreviewDoc(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body p-3 text-center bg-light">
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  style={{ maxHeight: "70vh", maxWidth: "100%", objectFit: "contain" }}
                  className="rounded border shadow"
                />
              </div>
              <div className="modal-footer border-top-0 bg-white">
                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm rounded-pill fw-bold"
                >
                  ↗ Open Full Image
                </a>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-pill"
                  onClick={() => setPreviewDoc(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Vendor Modal */}
      {showCreateModal && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" style={{ cursor: "default" }}>
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header bg-dark text-white d-flex align-items-center justify-content-between">
                <h5 className="modal-title fw-bold mb-0">🏪 Register New Vendor Account</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center p-0"
                  style={{ width: "32px", height: "32px", fontSize: "16px", cursor: "pointer" }}
                  onClick={() => setShowCreateModal(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Vendor Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ankit Sharma"
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Business / Store Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Royal Beauty Hub"
                      value={newVendor.businessName}
                      onChange={(e) => setNewVendor({ ...newVendor, businessName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="vendor@example.com"
                      value={newVendor.email}
                      onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Phone Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+91 9876543210"
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={newVendor.password}
                      onChange={(e) => setNewVendor({ ...newVendor, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">GSTIN Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="22AAAAA0000A1Z5"
                      value={newVendor.gstNumber}
                      onChange={(e) => setNewVendor({ ...newVendor, gstNumber: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">PAN Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ABCDE1234F"
                      value={newVendor.panNumber}
                      onChange={(e) => setNewVendor({ ...newVendor, panNumber: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Upload PAN Card Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        setNewVendorFiles({ ...newVendorFiles, panCardDoc: e.target.files[0] })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Aadhaar Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="1234 5678 9012"
                      value={newVendor.aadharNumber}
                      onChange={(e) => setNewVendor({ ...newVendor, aadharNumber: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Upload Aadhaar Card Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        setNewVendorFiles({ ...newVendorFiles, aadharCardDoc: e.target.files[0] })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary fw-bold rounded-pill px-4">
                    Register Vendor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllVendors;
