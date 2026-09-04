import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", role: "user" });

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canUpdate = hasPermission(storedUser, storedRoleDetails, "All Users", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "All Users", "delete");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/auth/get-all-users");
      if (response.status === 200 && response?.data?.users) {
        setUsers(response.data.users);
      } else {
        console.error("Failed to fetch users:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user account will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/api/v1/auth/admin/delete-user/${userId}`);
        if (res.status === 200) {
          toast.success("User deleted successfully!");
          setUsers(users.filter((u) => u._id !== userId));
        }
      } catch (error) {
        console.error("Delete user error:", error);
        toast.error(error?.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleOpenEdit = (userItem) => {
    setSelectedUser(userItem);
    setEditForm({
      name: userItem.name || "",
      email: userItem.email || "",
      phone: userItem.phone || "",
      role: userItem.role || "user",
    });
    setShowEditModal(true);
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        `/api/v1/auth/admin/update-user/${selectedUser._id}`,
        editForm
      );
      if (res.status === 200) {
        toast.success("User details updated successfully! 👤");
        setUsers(
          users.map((u) => (u._id === selectedUser._id ? { ...u, ...editForm } : u))
        );
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Update user error:", error);
      toast.error(error?.response?.data?.message || "Failed to update user");
    }
  };


  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/auth/admin/update-user-role/${userId}`,
        { role: newRole }
      );
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        toast.success(`User role updated to ${newRole.toUpperCase()}! 👑`);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const filteredUsers = users.filter((u) => {
    const isCustomer = !u.role || u.role === "user" || u.role === "customer";
    if (!isCustomer) return false;

    const q = searchQuery.toLowerCase();
    return (
      u?.name?.toLowerCase().includes(q) ||
      u?.email?.toLowerCase().includes(q) ||
      u?.phone?.includes(searchQuery)
    );
  });


  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Users &amp; Role Management</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          <div className="search-box" style={{ width: "280px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search name, email, role, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "20px", padding: "6px 14px" }}
            />
          </div>
        </div>
      </div>

      <section className="main-table">
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Sr.No.</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col" className="text-center">User Role</th>
                <th scope="col">Created Date</th>
                {(canUpdate || canDelete) && <th scope="col" className="text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-3 fw-bold text-muted">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <th scope="row">{index + 1}</th>
                    <td className="fw-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td className="text-center">
                      <select
                        className={`form-select form-select-sm fw-bold border-0 shadow-sm ${
                          user.role === "superadmin" || user.role === "super_admin"
                            ? "bg-dark text-warning border border-warning"
                            : user.role === "admin"
                            ? "bg-danger text-white"
                            : user.role === "vendor"
                            ? "bg-primary text-white"
                            : user.role === "staff"
                            ? "bg-info text-dark"
                            : "bg-secondary text-white"
                        }`}
                        style={{
                          borderRadius: "20px",
                          padding: "5px 12px",
                          width: "155px",
                          margin: "0 auto",
                          cursor: canUpdate ? "pointer" : "not-allowed",
                        }}
                        disabled={!canUpdate}
                        value={user.role || "user"}
                        onChange={(e) =>
                          canUpdate && handleRoleChange(user._id, e.target.value)
                        }
                      >
                        <option value="super_admin" className="bg-white text-dark">
                          ⚡ Super Admin
                        </option>
                        <option value="admin" className="bg-white text-dark">
                          👑 Admin
                        </option>
                        <option value="vendor" className="bg-white text-dark">
                          🏪 Vendor
                        </option>
                        <option value="staff" className="bg-white text-dark">
                          👔 Staff
                        </option>
                        <option value="user" className="bg-white text-dark">
                          👤 Customer
                        </option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                    {(canUpdate || canDelete) && (
                      <td className="text-center">
                        {canUpdate && (
                          <button
                            className="bt edit me-2"
                            onClick={() => handleOpenEdit(user)}
                          >
                            Edit <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="bt delete"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-3 text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit User Modal Dialog */}
      {showEditModal && selectedUser && (
        <div
          className="modal d-block"
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
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
                  ✏️ Edit User Details
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center p-0"
                  style={{ width: "32px", height: "32px", fontSize: "16px", cursor: "pointer", border: "1px solid #cbd5e1" }}
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveUserEdit}>
                <div className="modal-body row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold small">Full Name</label>
                    <input
                      type="text"
                      className="form-control p-2.5 rounded-3"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small">Email Address</label>
                    <input
                      type="email"
                      className="form-control p-2.5 rounded-3"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small">Phone Number</label>
                    <input
                      type="text"
                      className="form-control p-2.5 rounded-3"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small">User Role</label>
                    <select
                      className="form-select p-2.5 rounded-3"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    >
                      <option value="super_admin">⚡ Super Admin</option>
                      <option value="admin">👑 Admin</option>
                      <option value="vendor">🏪 Vendor</option>
                      <option value="staff">👔 Staff</option>
                      <option value="user">👤 Customer</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0 mt-3">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-bold"
                  >
                    UPDATE USER
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


export default AllUsers;
