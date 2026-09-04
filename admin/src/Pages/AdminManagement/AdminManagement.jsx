import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "Manage Admins", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Admins", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Admins", "delete");


  // New Admin Form State
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "admin",
  });

  // Modal Permission State
  const [currentPerms, setCurrentPerms] = useState({
    manageProducts: true,
    manageOrders: true,
    manageCategories: true,
    manageBrands: true,
    manageBanners: true,
    manageVideos: true,
    manageCoupons: true,
    manageReviews: true,
    systemSettings: false,
  });

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/admin-management/get-all-admins");
      if (res?.data?.data) {
        setAdmins(res.data.data);
      }
    } catch (err) {
      console.error("Fetch admins error:", err);
      toast.error(err?.response?.data?.message || "Failed to load admins list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle Verification Toggle
  const handleToggleVerify = async (adminId) => {
    try {
      const res = await axiosInstance.put(`/api/v1/admin-management/toggle-verification/${adminId}`);
      if (res.status === 200) {
        setAdmins(
          admins.map((a) =>
            a._id === adminId ? { ...a, isVerified: !a.isVerified } : a
          )
        );
        toast.success(res?.data?.message || "Verification status updated!");
      }
    } catch (err) {
      console.error("Toggle verify error:", err);
      toast.error(err?.response?.data?.message || "Failed to update verification");
    }
  };

  // Create Admin Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/v1/admin-management/create-admin", newAdmin);
      if (res.status === 201) {
        toast.success("New Admin Account created successfully! 👑");
        setShowCreateModal(false);
        setNewAdmin({ name: "", email: "", password: "", phone: "", role: "admin" });
        fetchAdmins();
      }
    } catch (err) {
      console.error("Create admin error:", err);
      toast.error(err?.response?.data?.message || "Error creating admin account");
    }
  };

  // Open Permission Modal
  const openPermissionEditor = (adminObj) => {
    setSelectedAdmin(adminObj);
    setCurrentPerms({
      manageProducts: adminObj?.permissions?.manageProducts ?? true,
      manageOrders: adminObj?.permissions?.manageOrders ?? true,
      manageCategories: adminObj?.permissions?.manageCategories ?? true,
      manageBrands: adminObj?.permissions?.manageBrands ?? true,
      manageBanners: adminObj?.permissions?.manageBanners ?? true,
      manageVideos: adminObj?.permissions?.manageVideos ?? true,
      manageCoupons: adminObj?.permissions?.manageCoupons ?? true,
      manageReviews: adminObj?.permissions?.manageReviews ?? true,
      systemSettings: adminObj?.permissions?.systemSettings ?? false,
    });
    setShowPermModal(true);
  };

  // Save Permission Changes
  const handleSavePermissions = async () => {
    if (!selectedAdmin) return;
    try {
      const res = await axiosInstance.put(
        `/api/v1/admin-management/update-permissions/${selectedAdmin._id}`,
        { permissions: currentPerms }
      );
      if (res.status === 200) {
        toast.success(`Permissions updated for ${selectedAdmin.name}! ⚙️`);
        setShowPermModal(false);
        fetchAdmins();
      }
    } catch (err) {
      console.error("Save perms error:", err);
      toast.error("Failed to update permissions");
    }
  };

  // Delete Admin Account
  const handleDeleteAdmin = async (adminId) => {
    const confirm = await Swal.fire({
      title: "Delete Admin Account?",
      text: "This action will permanently revoke all access for this Admin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/api/v1/admin-management/delete-admin/${adminId}`);
        if (res.status === 200) {
          toast.success("Admin account deleted successfully!");
          fetchAdmins();
        }
      } catch (err) {
        console.error("Delete admin error:", err);
        toast.error("Failed to delete admin account");
      }
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a?.phone?.includes(searchQuery) ||
      a?.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head d-flex align-items-center justify-content-between w-100">
          <h4>⚡ Super Admin Console &amp; Permissions Delegation</h4>
          <div>
            {canWrite && (
              <button
                className="btn btn-primary fw-bold rounded-pill shadow-sm"
                onClick={() => setShowCreateModal(true)}
              >
                + Create New Admin / Staff
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="d-flex justify-content-between align-items-center my-3 bg-white p-3 rounded border shadow-sm">
        <div className="search-box" style={{ width: "300px" }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="🔍 Search admin by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: "20px", padding: "6px 14px" }}
          />
        </div>
        <span className="badge bg-dark px-3 py-2 rounded-pill">
          Total Accounts: {filteredAdmins.length}
        </span>
      </div>

      {/* Main Admins Table */}
      <section className="main-table bg-white p-3 rounded border shadow-sm">
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Sr.No.</th>
                <th>Admin / Seller Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Role</th>
                <th className="text-center">Verification Status</th>
                <th>Allowed Modular Permissions</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 fw-bold text-muted">
                    Loading Admins...
                  </td>
                </tr>
              ) : filteredAdmins.length > 0 ? (
                filteredAdmins.map((adminItem, index) => (
                  <tr key={adminItem._id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold text-dark">{adminItem.name}</td>
                    <td>{adminItem.email}</td>
                    <td>{adminItem.phone || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${
                          adminItem.role === "superadmin" || adminItem.role === "super_admin"
                            ? "bg-dark text-warning border border-warning"
                            : adminItem.role === "admin"
                            ? "bg-danger text-white"
                            : adminItem.role === "vendor"
                            ? "bg-primary text-white"
                            : "bg-info text-dark"
                        }`}
                      >
                        {adminItem.role === "super_admin" ? "SUPER_ADMIN" : adminItem.role?.toUpperCase()}
                      </span>

                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          disabled={!canUpdate}
                          checked={adminItem.isVerified ?? true}
                          onChange={() => canUpdate && handleToggleVerify(adminItem._id)}
                          style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "40px", height: "20px" }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {adminItem?.permissions?.manageProducts && <span className="badge bg-light text-dark border">🛍️ Products</span>}
                        {adminItem?.permissions?.manageOrders && <span className="badge bg-light text-dark border">📦 Orders</span>}
                        {adminItem?.permissions?.manageCategories && <span className="badge bg-light text-dark border">📁 Categories</span>}
                        {adminItem?.permissions?.manageBanners && <span className="badge bg-light text-dark border">🖼️ Banners</span>}
                        {adminItem?.permissions?.manageVideos && <span className="badge bg-light text-dark border">🎬 Videos</span>}
                        {adminItem?.permissions?.manageCoupons && <span className="badge bg-light text-dark border">🎟️ Coupons</span>}
                        {adminItem?.permissions?.systemSettings && <span className="badge bg-warning text-dark">⚙️ Settings</span>}
                      </div>
                    </td>
                    <td className="text-center">
                      {canUpdate && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2 fw-bold"
                          onClick={() => openPermissionEditor(adminItem)}
                        >
                          ⚙️ Edit Permissions
                        </button>
                      )}
                      {canDelete && adminItem.role !== "superadmin" && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAdmin(adminItem._id)}
                        >
                          ✕ Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-3 text-muted">
                    No Admin accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal 1: Create Admin Modal */}
      {showCreateModal && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ cursor: "default" }}>
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header bg-dark text-white d-flex align-items-center justify-content-between">
                <h5 className="modal-title fw-bold mb-0">👑 Create New Admin / Staff Account</h5>
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
                  <div className="col-12">
                    <label className="form-label fw-bold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold">Phone Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Account Role</label>
                    <select
                      className="form-select"
                      value={newAdmin.role}
                      onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    >
                      <option value="admin">👑 Store Admin</option>
                      <option value="vendor">🏪 Vendor / Seller</option>
                      <option value="staff">👔 Staff Member</option>
                    </select>
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
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Permissions Modal */}
      {showPermModal && selectedAdmin && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPermModal(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ cursor: "default" }}>
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header bg-dark text-white d-flex align-items-center justify-content-between">
                <h5 className="modal-title fw-bold mb-0">
                  ⚙️ Modular Permissions: {selectedAdmin.name}
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center p-0"
                  style={{ width: "32px", height: "32px", fontSize: "16px", cursor: "pointer" }}
                  onClick={() => setShowPermModal(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <p className="small text-muted mb-3">
                  Super Admin controls which tabs &amp; actions this Admin/Staff member can access.
                </p>
                <div className="row g-3">
                  {[
                    { key: "manageProducts", label: "🛍️ Manage Products (Catalog & Prices)" },
                    { key: "manageOrders", label: "📦 Manage Orders & Shipping Status" },
                    { key: "manageCategories", label: "📁 Manage Main & Sub Categories" },
                    { key: "manageBrands", label: "🏷️ Manage Brands" },
                    { key: "manageBanners", label: "🖼️ Manage Hero Banners" },
                    { key: "manageVideos", label: "🎬 Manage Video Reels" },
                    { key: "manageCoupons", label: "🎟️ Manage Coupons & Vouchers" },
                    { key: "manageReviews", label: "⭐ Manage Customer Reviews" },
                    { key: "systemSettings", label: "⚙️ Access System Settings" },
                  ].map((perm) => (
                    <div className="col-md-6" key={perm.key}>
                      <div className="form-check form-switch p-2 border rounded bg-light">
                        <input
                          className="form-check-input ms-0 me-2"
                          type="checkbox"
                          role="switch"
                          id={perm.key}
                          checked={currentPerms[perm.key] ?? false}
                          onChange={(e) =>
                            setCurrentPerms({ ...currentPerms, [perm.key]: e.target.checked })
                          }
                          style={{ cursor: "pointer", width: "38px", height: "18px" }}
                        />
                        <label className="form-check-label fw-bold small text-dark cursor-pointer" htmlFor={perm.key}>
                          {perm.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setShowPermModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-warning fw-bold rounded-pill px-4"
                  onClick={handleSavePermissions}
                >
                  💾 Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminManagement;
