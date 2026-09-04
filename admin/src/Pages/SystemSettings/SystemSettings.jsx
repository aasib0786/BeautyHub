import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("branding");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canUpdate = hasPermission(storedUser, storedRoleDetails, "System Settings", "update");

  const [settings, setSettings] = useState({
    siteName: "BeautyHub Store",
    supportEmail: "support@beautyhub.com",
    supportPhone: "+91 9131734930",
    storeAddress: "123 Commerce Park, Main Highway, India",
    currencySymbol: "₹",
    currencyCode: "INR",
    maintenanceMode: false,

    razorpayKeyId: "",
    razorpayKeySecret: "",
    geminiApiKey: "",

    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    senderEmail: "no-reply@beautyhub.com",
    senderName: "BeautyHub Care",
  });

  // Profile tab state
  const [profileData, setProfileData] = useState({
    name: storedUser.name || storedUser.fullName || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    role: storedUser.role || "Super Admin",
    createdAt: storedUser.createdAt || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password tab state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [settingsRes, profileRes] = await Promise.allSettled([
          axiosInstance.get("/api/v1/settings/get-settings"),
          axiosInstance.get("/api/v1/auth/admin/verify-admin"),
        ]);

        if (settingsRes.status === "fulfilled" && settingsRes.value?.data?.data) {
          setSettings((prev) => ({ ...prev, ...settingsRes.value.data.data }));
        }

        if (profileRes.status === "fulfilled" && profileRes.value?.data?.user) {
          const u = profileRes.value.data.user;
          setProfileData({
            name: u.name || u.fullName || "",
            email: u.email || "",
            phone: u.phone || "",
            role: u.role || "Super Admin",
            createdAt: u.createdAt || "",
          });
          sessionStorage.setItem("adminUser", JSON.stringify(u));
        }
      } catch (err) {
        console.error("Fetch data error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const res = await axiosInstance.put("/api/v1/settings/update-settings", settings);
      if (res.status === 200) {
        toast.success("System Settings saved successfully! ⚙️");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await axiosInstance.put("/api/v1/auth/update-profile", {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      });
      if (res.status === 200) {
        toast.success("Profile details updated successfully! 👤");
        if (res.data?.user) {
          const updated = res.data.user;
          setProfileData({
            name: updated.name || updated.fullName || "",
            email: updated.email || "",
            phone: updated.phone || "",
            role: updated.role || profileData.role,
            createdAt: updated.createdAt || profileData.createdAt,
          });
          sessionStorage.setItem("adminUser", JSON.stringify(updated));
          window.dispatchEvent(new Event("roleUpdated"));
        }
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async (e) => {
    e?.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await axiosInstance.put("/api/v1/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      if (res.status === 200) {
        toast.success("Password updated successfully! 🔑");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      console.error("Update password error:", err);
      toast.error(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "SA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatRoleName = (role) => {
    if (!role) return "Super Admin";
    if (role.toLowerCase() === "super_admin" || role.toLowerCase() === "superadmin") {
      return "Super Admin";
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatJoinedDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return <p className="p-4 fw-bold text-muted">Loading System Settings...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head d-flex align-items-center justify-content-between w-100">
          <h4>
            {activeTab === "profile" ? "👤 My Profile" : "⚙️ Store System Settings"}
          </h4>
          {canUpdate && activeTab !== "profile" && (
            <button
              type="button"
              className="btn btn-warning btn-sm fw-bold px-3 py-2 rounded-pill shadow-sm"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "💾 Save Settings"}
            </button>
          )}
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <ul className="nav nav-tabs border-bottom mb-4 bg-white p-2 rounded shadow-sm">
        <li className="nav-item">
          <button
            className={`nav-item nav-link fw-bold ${activeTab === "branding" ? "active text-primary border-primary border-bottom-0" : "text-dark"}`}
            onClick={() => setActiveTab("branding")}
          >
            🌐 Website &amp; Branding
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-item nav-link fw-bold ${activeTab === "gateways" ? "active text-primary border-primary border-bottom-0" : "text-dark"}`}
            onClick={() => setActiveTab("gateways")}
          >
            💳 Payment &amp; API Keys
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-item nav-link fw-bold ${activeTab === "smtp" ? "active text-primary border-primary border-bottom-0" : "text-dark"}`}
            onClick={() => setActiveTab("smtp")}
          >
            📧 SMTP Mail Server
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-item nav-link fw-bold ${activeTab === "profile" ? "active text-primary border-primary border-bottom-0" : "text-dark"}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 My Profile
          </button>
        </li>
      </ul>

      {/* Profile Tab View */}
      {activeTab === "profile" && (
        <div className="mb-5">
          {/* Top User Header Card */}
          <div className="bg-white p-4 rounded shadow-sm border mb-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                style={{
                  width: "56px",
                  height: "56px",
                  fontSize: "20px",
                  backgroundColor: "#4f46e5",
                  flexShrink: 0,
                }}
              >
                {getInitials(profileData.name || storedUser.name || "Super Admin")}
              </div>
              <div>
                <h5 className="fw-bold mb-1 text-dark">
                  {profileData.name || storedUser.name || "Super Admin"}
                </h5>
                <p className="text-muted small mb-0">
                  {formatRoleName(profileData.role || storedUser.role || "Super Admin")}
                  {(profileData.createdAt || storedUser.createdAt) &&
                    ` - Joined ${formatJoinedDate(profileData.createdAt || storedUser.createdAt)}`}
                </p>
              </div>
            </div>
          </div>

          {/* Profile & Password Form Grid */}
          <div className="row g-4">
            {/* Left Card: Profile Information */}
            <div className="col-lg-6">
              <form
                onSubmit={handleSaveProfile}
                className="bg-white p-4 rounded shadow-sm border h-100 d-flex flex-column justify-content-between"
              >
                <div>
                  <h5 className="fw-bold text-dark mb-1">Profile information</h5>
                  <p className="text-muted small mb-4">Your basic account details</p>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">
                      Full name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">
                      Email address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold small">Phone number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="text-end pt-3 border-top">
                  <button
                    type="submit"
                    className="btn btn-primary fw-bold px-4 py-2 rounded shadow-sm"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card: Change Password */}
            <div className="col-lg-6">
              <form
                onSubmit={handleUpdatePassword}
                className="bg-white p-4 rounded shadow-sm border h-100 d-flex flex-column justify-content-between"
              >
                <div>
                  <h5 className="fw-bold text-dark mb-1">Change password</h5>
                  <p className="text-muted small mb-4">Update your account password</p>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">
                      Current password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordFormChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small">
                      New password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordFormChange}
                      required
                    />
                    <div className="form-text text-muted small mt-1">At least 8 characters.</div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold small">
                      Confirm new password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="text-end pt-3 border-top">
                  <button
                    type="submit"
                    className="btn btn-primary fw-bold px-4 py-2 rounded shadow-sm"
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? "Updating..." : "Update password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* System Settings Form (Branding, Gateways, SMTP) */}
      {activeTab !== "profile" && (
        <form onSubmit={handleSaveSettings} className="bg-white p-4 rounded shadow-sm border mb-5">
          {/* Tab 1: Website Branding */}
          {activeTab === "branding" && (
            <div className="row g-3">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                🌐 Website Identity &amp; Store Information
              </h5>
              <div className="col-md-4">
                <label className="form-label fw-bold small">Website / Store Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold small">Customer Support Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold small">Customer Support Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold small">Store Physical Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="storeAddress"
                  value={settings.storeAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold small">Currency Symbol</label>
                <input
                  type="text"
                  className="form-control"
                  name="currencySymbol"
                  value={settings.currencySymbol}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold small">Currency Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="currencyCode"
                  value={settings.currencyCode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12 mt-4">
                <div className="form-check form-switch p-3 border rounded bg-light">
                  <input
                    className="form-check-input ms-0 me-3"
                    type="checkbox"
                    role="switch"
                    name="maintenanceMode"
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    style={{ width: "45px", height: "22px", cursor: "pointer" }}
                  />
                  <label className="form-check-label fw-bold text-danger cursor-pointer" htmlFor="maintenanceMode">
                    ⚠️ Maintenance Mode (Temporarily hide storefront for maintenance)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Payment & API Keys */}
          {activeTab === "gateways" && (
            <div className="row g-3">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                💳 Payment Gateway &amp; AI Integration Keys
              </h5>

              <div className="col-md-6">
                <label className="form-label fw-bold small">Razorpay Key ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="razorpayKeyId"
                  value={settings.razorpayKeyId}
                  onChange={handleChange}
                  placeholder="rzp_live_..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold small">Razorpay Key Secret</label>
                <input
                  type="password"
                  className="form-control"
                  name="razorpayKeySecret"
                  value={settings.razorpayKeySecret}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold small">Google Gemini AI API Key (AIzaSy...)</label>
                <input
                  type="password"
                  className="form-control"
                  name="geminiApiKey"
                  value={settings.geminiApiKey}
                  onChange={handleChange}
                  placeholder="AIzaSy..."
                />
              </div>
            </div>
          )}

          {/* Tab 3: SMTP Email Configuration */}
          {activeTab === "smtp" && (
            <div className="row g-3">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                📧 SMTP Mail Server Credentials
              </h5>

              <div className="col-md-4">
                <label className="form-label fw-bold small">SMTP Server Host</label>
                <input
                  type="text"
                  className="form-control"
                  name="smtpHost"
                  value={settings.smtpHost}
                  onChange={handleChange}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-bold small">Port</label>
                <input
                  type="number"
                  className="form-control"
                  name="smtpPort"
                  value={settings.smtpPort}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold small">SMTP Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="smtpUser"
                  value={settings.smtpUser}
                  onChange={handleChange}
                  placeholder="yourmail@gmail.com"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold small">SMTP App Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="smtpPass"
                  value={settings.smtpPass}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold small">System Sender Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="senderName"
                  value={settings.senderName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold small">System Sender Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="senderEmail"
                  value={settings.senderEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Action Save Button Footer */}
          {canUpdate && (
            <div className="col-12 mt-4 text-end border-top pt-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg fw-bold px-4 rounded-pill shadow-sm"
                disabled={isSaving}
              >
                {isSaving ? "Saving Settings..." : "💾 Save Settings"}
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default SystemSettings;
