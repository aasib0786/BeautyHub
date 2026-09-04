import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/FetchNodeServices';

const Header = () => {
  const navigate = useNavigate();
  const [sidetoggle, setSideToggle] = useState(false);

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle);
  };


  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/auth/logout');
      if (response.status === 200) {
        toast.success('Logout successfully!');
        navigate("/login");
      }
    } catch (error) {
      console.log("logout error", error);
      toast.error(error?.response?.data?.message || 'Logout failed');
    }
    sessionStorage.removeItem('login');
    // navigate('/login');
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
    { to: "/", label: "Dashboard", icon: "fa-solid fa-gauge", module: "Dashboard" },
    { to: "/all-orders", label: "Manage Orders", icon: "fa-solid fa-truck", module: "Manage Orders" },
    { to: "/all-main-category", label: "All Main Category", icon: "fa-solid fa-folder-tree", module: "All Main Category" },
    { to: "/all-category", label: "All Category", icon: "fa-solid fa-layer-group", module: "All Category" },
    { to: "/all-subCategory", label: "All SubCategory", icon: "fa-solid fa-sitemap", module: "All SubCategory" },
    { to: "/all-brands", label: "Manage Brands", icon: "fa-solid fa-copyright", module: "Manage Brands" },
    { to: "/all-products", label: "All Products", icon: "fa-solid fa-cubes", module: "All Products" },
    { to: "/all-vendors", label: "Manage Vendors", icon: "fa-solid fa-store text-info", module: "Manage Vendors" },
    { to: "/all-videos", label: "All Videos", icon: "fa-solid fa-video", module: "All Videos" },
    { to: "/all-banners", label: "Manage Banners", icon: "fa-solid fa-images", module: "Manage Banners" },
    { to: "/all-sizes", label: "Manage Sizes", icon: "fa-solid fa-ruler-combined", module: "Manage Sizes" },
    { to: "/all-coupon", label: "Manage Coupons", icon: "fa-solid fa-tag", module: "Manage Coupons" },
    { to: "/all-users", label: "All Users", icon: "fa-solid fa-users", module: "All Users" },
    { to: "/all-product-inquary", label: "All product Inquiries", icon: "fa-solid fa-envelope-open-text", module: "All product Inquiries" },
    { to: "/all-inquiries", label: "All Contact Inquiries", icon: "fa-solid fa-envelope-open-text", module: "All Contact Inquiries" },
    { to: "/all-become-franchise", label: "Franchise Requests", icon: "fa-solid fa-handshake", module: "Franchise Requests" },
    { to: "/all-email-inquiries", label: "Email Inquiries", icon: "fa-solid fa-envelope", module: "Email Inquiries" },
    { to: "/all-reviews", label: "Manage Reviews", icon: "fa-solid fa-star", module: "Manage Reviews" },
    { to: "/admin-staff-roles", label: "Admin & Staff Roles", icon: "fa-solid fa-user-lock text-primary", module: "Admin & Staff Roles" },
    { to: "/system-settings", label: "System Settings", icon: "fa-solid fa-gear text-warning", module: "System Settings" },
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

    return false; // Default to false for non-superadmin!
  });

  return (
    <header>
      <div className="top-head">
        <div className="right">
          <Link className='text-white text-decoration-none' to="/">
            <h2> BeautyHub Admin Panel</h2>
          </Link>
          <div className="bar" onClick={handletoggleBtn}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
        <div className="left">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-globe"></i> Go To Website
          </a>
          <div className="logout" onClick={handleLogout}>
            Log Out <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </div>
      </div>

      <div className={`rightNav ${sidetoggle ? "active" : ""}`}>
        <ul>
          {filteredNavItems.map((item, index) => (
            <li key={index}>

              <Link to={item.to} onClick={handletoggleBtn}>
                <i className={item.icon}></i> {item.label}
              </Link>
            </li>
          ))}
          <div className="logout" onClick={handleLogout}>
            Log Out <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </ul>
      </div>
    </header>
  );
};

export default Header;
