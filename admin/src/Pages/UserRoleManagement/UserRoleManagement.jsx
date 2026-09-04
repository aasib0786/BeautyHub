import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const allSystemModules = [
  "Dashboard",
  "Manage Orders",
  "All Main Category",
  "All Category",
  "All SubCategory",
  "Manage Brands",
  "All Products",
  "All Videos",
  "Manage Banners",
  "Manage Sizes",
  "Manage Coupons",
  "All Users",
  "All product Inquiries",
  "All Contact Inquiries",
  "Franchise Requests",
  "Email Inquiries",
  "Manage Reviews",
  "Admin & Staff Roles",
  "System Settings",
];



const UserRoleManagement = () => {
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'roles'
  const [roles, setRoles] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "Admin & Staff Roles", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "Admin & Staff Roles", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "Admin & Staff Roles", "delete");

  // Modals visibility
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Form State: Add/Edit Role
  const [roleForm, setRoleForm] = useState({
    roleName: "",
    description: "",
    modulePermissions: allSystemModules.map((m) => ({
      module: m,
      read: false,
      write: false,
      update: false,
      delete: false,
    })),
  });

  // Form State: Add/Edit User
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "SALESMAN",
    status: "Active",
  });

  // Fetch Roles and Users
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [roleRes, userRes] = await Promise.all([
        axiosInstance.get("/api/v1/role/get-all-roles"),
        axiosInstance.get("/api/v1/admin-management/get-all-admins"),
      ]);

      if (roleRes?.data?.data) {
        setRoles(roleRes.data.data);
      }
      if (userRes?.data?.data) {
        setAdminUsers(userRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching role/user data:", error);
      toast.error("Failed to load users & roles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ROLE HANDLERS ---
  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleForm({
      roleName: "",
      description: "",
      modulePermissions: allSystemModules.map((m) => ({
        module: m,
        read: false,
        write: false,
        update: false,
        delete: false,
      })),
    });
    setShowRoleModal(true);
  };

  const handleOpenEditRole = (roleItem) => {
    setEditingRole(roleItem);
    const existingMap = new Map((roleItem.modulePermissions || []).map((p) => [p.module, p]));
    const fullMatrix = allSystemModules.map((m) => {
      const found = existingMap.get(m);
      return {
        module: m,
        read: found?.read || false,
        write: found?.write || false,
        update: found?.update || false,
        delete: found?.delete || false,
      };
    });

    setRoleForm({
      roleName: roleItem.roleName || "",
      description: roleItem.description || "",
      modulePermissions: fullMatrix,
    });
    setShowRoleModal(true);
  };

  const handlePermissionCheckbox = (modName, field, checked) => {
    setRoleForm((prev) => ({
      ...prev,
      modulePermissions: prev.modulePermissions.map((p) =>
        p.module === modName ? { ...p, [field]: checked } : p
      ),
    }));
  };

  // Select All for a Column (read, write, update, delete)
  const handleSelectColumnAll = (field, checked) => {
    setRoleForm((prev) => ({
      ...prev,
      modulePermissions: prev.modulePermissions.map((p) => ({
        ...p,
        [field]: checked,
      })),
    }));
  };

  // Master Select All (Full Access)
  const handleSelectEverything = (checked) => {
    setRoleForm((prev) => ({
      ...prev,
      modulePermissions: prev.modulePermissions.map((p) => ({
        ...p,
        read: checked,
        write: checked,
        update: checked,
        delete: checked,
      })),
    }));
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleForm.roleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    try {
      if (editingRole) {
        const res = await axiosInstance.put(`/api/v1/role/update-role/${editingRole._id}`, roleForm);
        if (res.status === 200) {
          toast.success("Role updated successfully! 🛡️");
          setShowRoleModal(false);
          window.dispatchEvent(new Event("roleUpdated"));
          fetchData();
        }
      } else {
        const res = await axiosInstance.post("/api/v1/role/create-role", roleForm);
        if (res.status === 201) {
          toast.success("New Role created successfully! 🛡️");
          setShowRoleModal(false);
          window.dispatchEvent(new Event("roleUpdated"));
          fetchData();
        }
      }
    } catch (error) {
      console.error("Save role error:", error);
      toast.error(error?.response?.data?.message || "Failed to save role");
    }
  };


  const handleDeleteRole = async (roleId, name) => {
    if (name.toLowerCase() === "super admin") {
      toast.error("Super Admin role cannot be deleted");
      return;
    }

    const confirm = await Swal.fire({
      title: "Delete Role?",
      text: `Are you sure you want to delete '${name}' role?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/api/v1/role/delete-role/${roleId}`);
        if (res.status === 200) {
          toast.success("Role deleted successfully");
          fetchData();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting role");
      }
    }
  };

  // --- USER HANDLERS ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: roles[0]?.roleName || "admin",
      status: "Active",
    });
    setShowUserModal(true);
  };

  const handleOpenEditUser = (userItem) => {
    setEditingUser(userItem);
    setUserForm({
      name: userItem.name || "",
      email: userItem.email || "",
      phone: userItem.phone || "",
      password: "",
      role: userItem.role || "admin",
      status: userItem.isVerified !== false ? "Active" : "Inactive",
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const res = await axiosInstance.put(
          `/api/v1/admin-management/update-permissions/${editingUser._id}`,
          { role: userForm.role }
        );
        if (res.status === 200) {
          toast.success("User role updated successfully! 👤");
          setShowUserModal(false);
          window.dispatchEvent(new Event("roleUpdated"));
          fetchData();
        }
      } else {
        const res = await axiosInstance.post("/api/v1/admin-management/create-admin", userForm);
        if (res.status === 201) {
          toast.success("New Admin User created successfully! 👤");
          setShowUserModal(false);
          window.dispatchEvent(new Event("roleUpdated"));
          fetchData();
        }
      }
    } catch (error) {

      console.error("Save user error:", error);
      toast.error(error?.response?.data?.message || "Failed to save user");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Delete User?",
      text: "This action will permanently delete this admin user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/api/v1/admin-management/delete-admin/${userId}`);
        if (res.status === 200) {
          toast.success("User deleted successfully");
          fetchData();
        }
      } catch (error) {
        toast.error("Error deleting user");
      }
    }
  };

  // Helper boolean state checks for column Select All
  const isAllRead = roleForm.modulePermissions.every((p) => p.read);
  const isAllWrite = roleForm.modulePermissions.every((p) => p.write);
  const isAllUpdate = roleForm.modulePermissions.every((p) => p.update);
  const isAllDelete = roleForm.modulePermissions.every((p) => p.delete);
  const isAllEverything = isAllRead && isAllWrite && isAllUpdate && isAllDelete;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "24px" }}>
      <ToastContainer />

      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
            User &amp; Role Management
          </h3>
          <p className="text-muted small mb-0 fw-medium">
            Manage admin users and their role-based permissions matrix
          </p>
        </div>
        <div>
          {canWrite && activeTab === "users" && (
            <button
              className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm transition-all"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", border: "none" }}
              onClick={handleOpenCreateUser}
            >
              + Add User
            </button>
          )}
          {canWrite && activeTab === "roles" && (
            <button
              className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm transition-all"
              style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", border: "none" }}
              onClick={handleOpenCreateRole}
            >
              + Add Role
            </button>
          )}
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="d-flex gap-2 mb-4 bg-white p-2 rounded-pill shadow-sm border" style={{ width: "fit-content" }}>
        <button
          className={`btn btn-sm fw-bold px-4 py-2 rounded-pill transition-all ${
            activeTab === "users" ? "btn-primary shadow-sm" : "btn-light text-muted border-0"
          }`}
          onClick={() => setActiveTab("users")}
        >
          👤 Admin Users
        </button>
        <button
          className={`btn btn-sm fw-bold px-4 py-2 rounded-pill transition-all ${
            activeTab === "roles" ? "text-white shadow-sm" : "btn-light text-muted border-0"
          }`}
          style={activeTab === "roles" ? { background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" } : {}}
          onClick={() => setActiveTab("roles")}
        >
          🛡️ Roles &amp; Permissions
        </button>
      </div>

      {/* TAB 1: ADMIN USERS TABLE */}
      {activeTab === "users" && (
        <div className="bg-white rounded-4 shadow-sm border p-4">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-muted small text-uppercase fw-bold" style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "14px 18px" }}>User Details</th>
                  <th>Contact Info</th>
                  <th>Role &amp; Status</th>
                  <th>Activity</th>
                  <th className="text-end" style={{ paddingRight: "24px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 fw-bold text-muted">
                      Loading admin users...
                    </td>
                  </tr>
                ) : adminUsers.length > 0 ? (
                  adminUsers.map((user) => {
                    const initials = user.name
                      ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : "AD";

                    return (
                      <tr key={user._id} className="border-bottom">
                        <td style={{ padding: "16px 18px" }}>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                              style={{
                                width: "44px",
                                height: "44px",
                                background:
                                  user.role === "super_admin" || user.role === "superadmin"
                                    ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
                                    : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                fontSize: "14px",
                              }}
                            >
                              {initials}
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold text-dark">{user.name}</h6>
                              <span className="text-muted font-monospace" style={{ fontSize: "11px" }}>
                                ID: {user._id?.slice(-8)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark small">{user.email}</div>
                          <div className="text-muted small">{user.phone || "N/A"}</div>
                        </td>
                        <td>
                          <div className="mb-1">
                            <span
                              className="badge px-3 py-1 rounded-pill fw-bold text-capitalize"
                              style={{
                                backgroundColor:
                                  user.role === "super_admin" || user.role === "superadmin"
                                    ? "#fef2f2"
                                    : user.role === "vendor"
                                    ? "#eff6ff"
                                    : "#f0fdf4",
                                color:
                                  user.role === "super_admin" || user.role === "superadmin"
                                    ? "#ef4444"
                                    : user.role === "vendor"
                                    ? "#3b82f6"
                                    : "#16a34a",
                                fontSize: "12px",
                              }}
                            >
                              {user.role === "super_admin" ? "Super Admin" : user.role}
                            </span>
                          </div>
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2" style={{ fontSize: "10px" }}>
                            ● Active
                          </span>
                        </td>
                        <td>
                          <div className="small text-muted fw-medium">Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="text-end" style={{ paddingRight: "24px" }}>
                          {canUpdate && (
                            <button
                              className="btn btn-sm text-white me-2 px-3 fw-bold rounded-pill"
                              style={{ backgroundColor: "#1e293b", fontSize: "12px" }}
                              onClick={() => handleOpenEditUser(user)}
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && user.role !== "super_admin" && user.role !== "superadmin" && (
                            <button
                              className="btn btn-sm text-white px-3 fw-bold rounded-pill"
                              style={{ backgroundColor: "#ef4444", fontSize: "12px" }}
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No admin users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS CARDS GRID */}
      {activeTab === "roles" && (
        <div className="row g-4">
          {isLoading ? (
            <div className="col-12 text-center py-5 fw-bold text-muted">Loading roles...</div>
          ) : (
            roles.map((roleObj) => (
              <div className="col-md-6 col-lg-6" key={roleObj._id}>
                <div className="bg-white rounded-4 shadow-sm border p-4 h-100 d-flex flex-column justify-content-between transition-all" style={{ border: "1px solid #e2e8f0" }}>
                  <div>
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                      <div>
                        <h4 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.3px" }}>{roleObj.roleName}</h4>
                        <span className="text-muted small fw-medium">{roleObj.description || "No description provided"}</span>
                      </div>
                      <div className="d-flex gap-2">
                        {canUpdate && (
                          <button
                            className="btn btn-sm text-white fw-bold px-3 rounded-pill"
                            style={{ backgroundColor: "#3b82f6", fontSize: "12px" }}
                            onClick={() => handleOpenEditRole(roleObj)}
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && roleObj.roleName.toLowerCase() !== "super admin" && (
                          <button
                            className="btn btn-sm text-white fw-bold px-3 rounded-pill"
                            style={{ backgroundColor: "#ef4444", fontSize: "12px" }}
                            onClick={() => handleDeleteRole(roleObj._id, roleObj.roleName)}
                          >
                            Delete
                          </button>
                        )}
                      </div>

                    </div>

                    <h6 className="fw-bold text-uppercase mt-3 mb-3 text-muted" style={{ fontSize: "11px", letterSpacing: "0.8px" }}>
                      PERMISSIONS OVERVIEW
                    </h6>

                    {/* Permissions List */}
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: "320px", overflowY: "auto", paddingRight: "4px" }}>
                      {allSystemModules.map((modName) => {
                        const perm = (roleObj.modulePermissions || []).find((p) => p.module === modName);
                        const hasAny = perm && (perm.read || perm.write || perm.update || perm.delete);

                        return (
                          <div key={modName} className="d-flex align-items-center justify-content-between py-2 px-2 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                            <span className="small text-dark fw-bold" style={{ fontSize: "12px" }}>
                              {modName}
                            </span>
                            {hasAny ? (
                              <div className="d-flex gap-2 align-items-center">
                                {perm.read && <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#22c55e" }} title="Read Permission" />}
                                {perm.write && <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#3b82f6" }} title="Write Permission" />}
                                {perm.update && <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#eab308" }} title="Update Permission" />}
                                {perm.delete && <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#ef4444" }} title="Delete Permission" />}
                              </div>
                            ) : (
                              <span className="text-muted fw-semibold" style={{ fontSize: "11px" }}>
                                No access
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend Footer */}
                  <div className="d-flex align-items-center gap-3 mt-4 pt-3 border-top" style={{ fontSize: "11px", color: "#64748b" }}>
                    <span className="d-flex align-items-center gap-1.5 fw-bold">
                      <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#22c55e" }} /> Read
                    </span>
                    <span className="d-flex align-items-center gap-1.5 fw-bold">
                      <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#3b82f6" }} /> Write
                    </span>
                    <span className="d-flex align-items-center gap-1.5 fw-bold">
                      <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#eab308" }} /> Update
                    </span>
                    <span className="d-flex align-items-center gap-1.5 fw-bold">
                      <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#ef4444" }} /> Delete
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL 1: CREATE / EDIT ROLE WITH SCROLL & MASTER SELECT ALL */}
      {showRoleModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowRoleModal(false);
          }}
          style={{
            zIndex: 1055,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            cursor: "pointer",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: "820px", cursor: "default" }}>
            <div
              className="modal-content shadow-lg border-0 rounded-4 overflow-hidden"
              style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
            >
              {/* Sticky Modal Header */}
              <div
                className="modal-header border-bottom p-4"
                style={{
                  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                  color: "#ffffff",
                  flexShrink: 0,
                }}
              >
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="modal-title fw-bold text-white mb-0">
                      {editingRole ? "Edit Role & Permissions Matrix" : "Create New Role"}
                    </h5>
                    <small className="text-white-50">Assign granular Read, Write, Update, and Delete module permissions</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center p-0"
                    style={{ width: "32px", height: "32px", fontSize: "16px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.3)" }}
                    onClick={() => setShowRoleModal(false)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>


              {/* Scrollable Modal Body */}
              <form onSubmit={handleSaveRole} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                <div className="modal-body p-4" style={{ overflowY: "auto", flex: 1 }}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-dark">Role Name *</label>
                      <input
                        type="text"
                        className="form-control rounded-3 p-2.5"
                        placeholder="E.g., SALESMAN / Warehouse Manager"
                        value={roleForm.roleName}
                        onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
                        required
                        style={{ border: "1.5px solid #cbd5e1" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-dark">Description</label>
                      <input
                        type="text"
                        className="form-control rounded-3 p-2.5"
                        placeholder="E.g., Sales team order management role"
                        value={roleForm.description}
                        onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                        style={{ border: "1.5px solid #cbd5e1" }}
                      />
                    </div>
                  </div>

                  {/* Header Actions: Master Select All Full Access */}
                  <div className="d-flex align-items-center justify-content-between mb-3 bg-light p-3 rounded-3 border">
                    <h6 className="fw-bold text-dark mb-0">Module Permissions Matrix ({allSystemModules.length} Modules)</h6>
                    <button
                      type="button"
                      className={`btn btn-sm fw-bold px-3 rounded-pill transition-all ${
                        isAllEverything ? "btn-success" : "btn-outline-primary"
                      }`}
                      onClick={() => handleSelectEverything(!isAllEverything)}
                    >
                      {isAllEverything ? "✓ All Permissions Granted" : "⚡ Select All (Full Access)"}
                    </button>
                  </div>

                  {/* Permissions Matrix Table */}
                  <div className="table-responsive border rounded-3 overflow-hidden">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light border-bottom">
                        <tr className="small text-muted text-uppercase fw-bold">
                          <th style={{ padding: "12px 18px" }}>Module</th>

                          {/* Column Select All Checkboxes */}
                          <th className="text-center" style={{ width: "105px" }}>
                            <div className="d-flex flex-column align-items-center">
                              <span>Read</span>
                              <div className="form-check m-0 mt-1">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={isAllRead}
                                  onChange={(e) => handleSelectColumnAll("read", e.target.checked)}
                                  title="Select All Read Permissions"
                                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                />
                              </div>
                            </div>
                          </th>

                          <th className="text-center" style={{ width: "105px" }}>
                            <div className="d-flex flex-column align-items-center">
                              <span>Write</span>
                              <div className="form-check m-0 mt-1">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={isAllWrite}
                                  onChange={(e) => handleSelectColumnAll("write", e.target.checked)}
                                  title="Select All Write Permissions"
                                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                />
                              </div>
                            </div>
                          </th>

                          <th className="text-center" style={{ width: "105px" }}>
                            <div className="d-flex flex-column align-items-center">
                              <span>Update</span>
                              <div className="form-check m-0 mt-1">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={isAllUpdate}
                                  onChange={(e) => handleSelectColumnAll("update", e.target.checked)}
                                  title="Select All Update Permissions"
                                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                />
                              </div>
                            </div>
                          </th>

                          <th className="text-center" style={{ width: "105px" }}>
                            <div className="d-flex flex-column align-items-center">
                              <span>Delete</span>
                              <div className="form-check m-0 mt-1">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={isAllDelete}
                                  onChange={(e) => handleSelectColumnAll("delete", e.target.checked)}
                                  title="Select All Delete Permissions"
                                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                />
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {roleForm.modulePermissions.map((item) => (
                          <tr key={item.module}>
                            <td className="fw-bold text-dark small" style={{ padding: "12px 18px" }}>
                              {item.module}
                            </td>
                            {["read", "write", "update", "delete"].map((field) => (
                              <td key={field} className="text-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={item[field]}
                                  onChange={(e) =>
                                    handlePermissionCheckbox(item.module, field, e.target.checked)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    width: "20px",
                                    height: "20px",
                                    borderColor: "#cbd5e1",
                                  }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sticky Modal Footer */}
                <div
                  className="modal-footer border-top p-3 bg-white"
                  style={{ flexShrink: 0, borderTop: "2px solid #e2e8f0" }}
                >
                  <button
                    type="button"
                    className="btn btn-light fw-bold rounded-pill px-4 me-2"
                    onClick={() => setShowRoleModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn text-white fw-bold rounded-pill px-5 shadow-sm"
                    style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", border: "none" }}
                  >
                    {editingRole ? "Update Role" : "Create Role"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT ADMIN USER */}
      {showUserModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUserModal(false);
          }}
          style={{
            zIndex: 1055,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            cursor: "pointer",
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ cursor: "default" }}>
            <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden p-2">
              <div className="modal-header border-bottom-0 pb-0 d-flex align-items-center justify-content-between">
                <h5 className="modal-title fw-bold text-dark mb-0">
                  {editingUser ? "Edit Admin User" : "Add New Admin User"}
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center p-0"
                  style={{ width: "32px", height: "32px", fontSize: "16px", cursor: "pointer", border: "1px solid #cbd5e1" }}
                  onClick={() => setShowUserModal(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveUser}>
                <div className="modal-body row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold small">Full Name</label>
                    <input
                      type="text"
                      className="form-control p-2.5 rounded-3"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small">Email Address</label>
                    <input
                      type="email"
                      className="form-control p-2.5 rounded-3"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small">Phone Number</label>
                    <input
                      type="text"
                      className="form-control p-2.5 rounded-3"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  {!editingUser && (
                    <div className="col-12">
                      <label className="form-label fw-bold small">Password</label>
                      <input
                        type="password"
                        className="form-control p-2.5 rounded-3"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Role</label>
                    <select
                      className="form-select p-2.5 rounded-3"
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      {roles.map((r) => (
                        <option key={r._id} value={r.roleName}>
                          {r.roleName}
                        </option>
                      ))}
                      {userForm.role &&
                        userForm.role !== "super_admin" &&
                        userForm.role !== "admin" &&
                        !roles.some((r) => r.roleName === userForm.role) && (
                          <option value={userForm.role}>{userForm.role}</option>
                        )}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small">Status</label>
                    <select
                      className="form-select p-2.5 rounded-3"
                      value={userForm.status}
                      onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-top-0 mt-3">
                  <button
                    type="submit"
                    className="btn text-white fw-bold rounded-pill w-100 py-2.5 shadow-sm"
                    style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", border: "none" }}
                  >
                    {editingUser ? "Update User" : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;
