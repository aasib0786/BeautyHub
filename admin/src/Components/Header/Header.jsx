import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/FetchNodeServices';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidetoggle, setSideToggle] = useState(false);

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle);
  };

  const closeSidebar = () => {
    if (sidetoggle) {
      setSideToggle(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/auth/logout');
      if (response.status === 200) {
        toast.success('Logged out successfully');
        navigate("/login");
      }
    } catch (error) {
      console.log("logout error", error);
      toast.error(error?.response?.data?.message || 'Logout failed');
    }
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminRoleDetails');
    window.location.href = '/login';
  };

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("adminUser")) || null;
    } catch (e) {
      return null;
    }
  });

  const [roleDetails, setRoleDetails] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("adminRoleDetails")) || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const fetchLiveRole = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/auth/admin/verify-admin");
        if (res.data?.user) {
          setUser(res.data.user);
          sessionStorage.setItem("adminUser", JSON.stringify(res.data.user));
        }
        if (res.data?.roleDetails) {
          setRoleDetails(res.data.roleDetails);
          sessionStorage.setItem("adminRoleDetails", JSON.stringify(res.data.roleDetails));
        }
      } catch (err) {
        console.error("Error fetching live role details in Header:", err);
      }
    };

    fetchLiveRole();

    window.addEventListener("roleUpdated", fetchLiveRole);
    return () => window.removeEventListener("roleUpdated", fetchLiveRole);
  }, []);

  const navItems = [
    { to: "/", label: "Dashboard", icon: "fa-solid fa-gauge-high", module: "Dashboard", section: "Overview" },
    
    { to: "/all-orders", label: "Manage Orders", icon: "fa-solid fa-box-open", module: "Manage Orders", section: "Orders & Sales" },
    
    { to: "/all-products", label: "All Products", icon: "fa-solid fa-boxes-stacked", module: "All Products", section: "Catalog & Stock" },
    { to: "/all-main-category", label: "Main Categories", icon: "fa-solid fa-folder-tree", module: "All Main Category", section: "Catalog & Stock" },
    { to: "/all-category", label: "Categories", icon: "fa-solid fa-layer-group", module: "All Category", section: "Catalog & Stock" },
    { to: "/all-subCategory", label: "Sub Categories", icon: "fa-solid fa-sitemap", module: "All SubCategory", section: "Catalog & Stock" },
    { to: "/all-brands", label: "Brands", icon: "fa-solid fa-award", module: "Manage Brands", section: "Catalog & Stock" },
    { to: "/all-sizes", label: "Sizes", icon: "fa-solid fa-ruler-combined", module: "Manage Sizes", section: "Catalog & Stock" },
    
    { to: "/all-banners", label: "Banners", icon: "fa-solid fa-images", module: "Manage Banners", section: "Media & Promo" },
    { to: "/all-videos", label: "Videos", icon: "fa-solid fa-video", module: "All Videos", section: "Media & Promo" },
    { to: "/all-coupon", label: "Coupons", icon: "fa-solid fa-tags", module: "Manage Coupons", section: "Media & Promo" },
    { to: "/all-reviews", label: "Reviews", icon: "fa-solid fa-star", module: "Manage Reviews", section: "Media & Promo" },
    
    { to: "/all-users", label: "Customers", icon: "fa-solid fa-users", module: "All Users", section: "CRM & Inquiries" },
    { to: "/all-product-inquary", label: "Product Inquiries", icon: "fa-solid fa-comments", module: "All product Inquiries", section: "CRM & Inquiries" },
    { to: "/all-inquiries", label: "Contact Inquiries", icon: "fa-solid fa-envelope-open-text", module: "All Contact Inquiries", section: "CRM & Inquiries" },
    { to: "/all-become-franchise", label: "Franchise Leads", icon: "fa-solid fa-handshake", module: "Franchise Requests", section: "CRM & Inquiries" },
    { to: "/all-email-inquiries", label: "Newsletter Leads", icon: "fa-solid fa-envelope", module: "Email Inquiries", section: "CRM & Inquiries" },
    
    { to: "/all-vendors", label: "Vendors & KYC", icon: "fa-solid fa-store", module: "Manage Vendors", section: "Administration" },
    { to: "/admin-staff-roles", label: "Staff & Role Matrix", icon: "fa-solid fa-user-shield", module: "Admin & Staff Roles", section: "Administration" },
    { to: "/system-settings", label: "System Settings", icon: "fa-solid fa-gear", module: "System Settings", section: "Administration" },
  ];

  const filteredNavItems = navItems.filter((item) => {
    const roleStr = (user?.role || "").toLowerCase();

    // Super Admin & Store Admin gets EVERYTHING or Vendor Management
    if (roleStr === "super_admin" || roleStr === "superadmin" || roleStr === "super admin" || roleStr === "admin") {
      if (roleStr === "admin" && item.module === "System Settings") return !!user?.permissions?.systemSettings;
      return true;
    }

    if (!item.module) return true;

    // Check custom Role matrix
    if (roleDetails && Array.isArray(roleDetails.modulePermissions)) {
      const found = roleDetails.modulePermissions.find(
        (m) => m.module?.trim().toLowerCase() === item.module?.trim().toLowerCase()
      );
      if (found) {
        return !!found.read;
      }
    }

    // Fallback checks from user.permissions
    if (user?.permissions) {
      const permMap = {
        "Dashboard": true,
        "Manage Orders": !!user.permissions.manageOrders,
        "All Main Category": !!user.permissions.manageCategories,
        "All Category": !!user.permissions.manageCategories,
        "All SubCategory": !!user.permissions.manageCategories,
        "Manage Brands": !!user.permissions.manageBrands,
        "All Products": !!user.permissions.manageProducts,
        "Manage Vendors": !!user.permissions.systemSettings || user.role === "admin",
        "All Videos": !!user.permissions.manageVideos,
        "Manage Banners": !!user.permissions.manageBanners,
        "Manage Sizes": !!user.permissions.manageProducts,
        "Manage Coupons": !!user.permissions.manageCoupons,
        "All Users": !!user.permissions.manageProducts,
        "All product Inquiries": true,
        "All Contact Inquiries": true,
        "Franchise Requests": true,
        "Email Inquiries": true,
        "Manage Reviews": !!user.permissions.manageReviews,
        "Admin & Staff Roles": !!user.permissions.systemSettings,
        "Manage Admins": !!user.permissions.systemSettings,
        "System Settings": !!user.permissions.systemSettings,
      };
      if (permMap[item.module] !== undefined) {
        return permMap[item.module];
      }
    }

    return false;
  });

  // Group items by section
  const sections = Array.from(new Set(filteredNavItems.map(item => item.section)));

  const isCurrentActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="header-wrapper">
      {/* Top Navbar */}
      <div className="top-head">
        <div className="top-brand-area">
          <button className="mobile-toggle-btn" onClick={handletoggleBtn} aria-label="Toggle Navigation">
            <i className={`fa-solid ${sidetoggle ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
          <Link className="brand-logo-link" to="/">
            <div className="brand-badge-icon">
              <i className="fa-solid fa-sparkles"></i>
            </div>
            <div className="brand-titles">
              <span className="brand-name">BeautyHub</span>
              <span className="brand-tag">PORTAL</span>
            </div>
          </Link>
        </div>

        <div className="top-actions-area">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn website-btn"
            title="Open Live Storefront"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>Live Store</span>
          </a>

          <div className="user-profile-chip">
            <div className="user-avatar-circle">
              {getInitials(user?.name || "Admin")}
            </div>
            <div className="user-meta-info">
              <span className="user-name">{user?.name || "Administrator"}</span>
              <span className="user-role-badge">
                {user?.role?.toUpperCase().replace("_", " ") || "SUPER ADMIN"}
              </span>
            </div>
          </div>

          <button className="action-btn logout-btn" onClick={handleLogout} title="Log Out">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {sidetoggle && (
        <div className="sidebar-backdrop" onClick={closeSidebar}></div>
      )}

      {/* Modern Sidebar Navigation */}
      <aside className={`rightNav ${sidetoggle ? "active" : ""}`}>
        <div className="sidebar-scrollable-content">
          {sections.map((secName) => {
            const itemsInSec = filteredNavItems.filter(item => item.section === secName);
            if (itemsInSec.length === 0) return null;

            return (
              <div key={secName} className="nav-group-section">
                <div className="nav-section-title">{secName}</div>
                <ul className="nav-list">
                  {itemsInSec.map((item, index) => {
                    const active = isCurrentActive(item.to);
                    return (
                      <li key={index} className="nav-item">
                        <Link
                          to={item.to}
                          className={`nav-link-btn ${active ? "active-link" : ""}`}
                          onClick={closeSidebar}
                        >
                          <span className="nav-icon-box">
                            <i className={item.icon}></i>
                          </span>
                          <span className="nav-label-text">{item.label}</span>
                          {active && <span className="active-pill-dot"></span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer User Card */}
        <div className="sidebar-footer-card">
          <div className="footer-user-details">
            <div className="footer-avatar">
              {getInitials(user?.name || "Admin")}
            </div>
            <div className="footer-user-text">
              <span className="footer-name">{user?.name || "Administrator"}</span>
              <span className="footer-email">{user?.email || "admin@beautyhub.com"}</span>
            </div>
          </div>
          <button className="footer-logout-btn" onClick={handleLogout} title="Logout">
            <i className="fa-solid fa-power-off"></i>
          </button>
        </div>
      </aside>
    </header>
  );
};

export default Header;
