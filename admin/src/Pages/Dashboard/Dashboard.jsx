import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { getData } from "../../services/FetchNodeServices";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupones, setCoupones] = useState([]);
  const [orders, setOrders] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const storedUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("adminUser")) || null;
    } catch (e) {
      return null;
    }
  })();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          usersRes,
          bannersRes,
          catsRes,
          videosRes,
          prodsRes,
          subCatsRes,
          couponsRes,
          ordersRes,
        ] = await Promise.allSettled([
          getData("api/v1/auth/get-all-users"),
          getData("api/v1/banner/get-all-banners"),
          getData("api/v1/category/get-all-categories"),
          getData("api/v1/video/get-all-videos"),
          getData("api/v1/product/get-all-products"),
          getData("api/v1/sub-category/get-all-sub-categories"),
          getData("api/v1/coupon/get-all-coupons"),
          getData("api/order/get-all-orders"),
        ]);

        if (usersRes.status === "fulfilled" && usersRes.value?.users) {
          setUsers(usersRes.value.users);
        }
        if (bannersRes.status === "fulfilled" && bannersRes.value?.banners) {
          setBanners(bannersRes.value.banners);
        }
        if (catsRes.status === "fulfilled" && catsRes.value?.data) {
          setCategories(catsRes.value.data);
        }
        if (videosRes.status === "fulfilled" && videosRes.value?.videos) {
          setVideos(videosRes.value.videos);
        }
        if (prodsRes.status === "fulfilled" && prodsRes.value?.data) {
          setProducts(prodsRes.value.data);
        }
        if (subCatsRes.status === "fulfilled" && subCatsRes.value?.data) {
          setSubCategories(subCatsRes.value.data);
        }
        if (couponsRes.status === "fulfilled" && couponsRes.value?.data) {
          setCoupones(couponsRes.value.data);
        }
        if (ordersRes.status === "fulfilled" && ordersRes.value?.orders) {
          setOrders(ordersRes.value.orders);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Customer Orders",
      count: orders.length,
      unit: "Orders",
      desc: "Track & process store shipments",
      to: "/all-orders",
      icon: "fa-solid fa-box-open",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      glowColor: "rgba(59, 130, 246, 0.25)",
    },
    {
      title: "Store Products",
      count: products.length,
      unit: "Items",
      desc: "Live inventory & catalog listings",
      to: "/all-products",
      icon: "fa-solid fa-boxes-stacked",
      gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      glowColor: "rgba(16, 185, 129, 0.25)",
    },
    {
      title: "Categories",
      count: categories.length,
      unit: "Categories",
      desc: "Primary classification hierarchy",
      to: "/all-category",
      icon: "fa-solid fa-layer-group",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      glowColor: "rgba(139, 92, 246, 0.25)",
    },
    {
      title: "Sub Categories",
      count: subCategories.length,
      unit: "Subcategories",
      desc: "Fine-grained product taxonomy",
      to: "/all-subCategory",
      icon: "fa-solid fa-sitemap",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
      glowColor: "rgba(99, 102, 241, 0.25)",
    },
    {
      title: "Registered Users",
      count: users.length,
      unit: "Customers",
      desc: "Active client accounts & profiles",
      to: "/all-users",
      icon: "fa-solid fa-users",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
      glowColor: "rgba(245, 158, 11, 0.25)",
    },
    {
      title: "Discount Coupons",
      count: coupones.length,
      unit: "Vouchers",
      desc: "Active campaigns & promotional codes",
      to: "/all-coupon",
      icon: "fa-solid fa-tags",
      gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
      glowColor: "rgba(236, 72, 153, 0.25)",
    },
    {
      title: "Hero Banners",
      count: banners.length,
      unit: "Sliders",
      desc: "Homepage hero promotional banners",
      to: "/all-banners",
      icon: "fa-solid fa-images",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
      glowColor: "rgba(6, 182, 212, 0.25)",
    },
    {
      title: "Product Videos",
      count: videos.length,
      unit: "Reels",
      desc: "Engaging showcase video reels",
      to: "/all-videos",
      icon: "fa-solid fa-video",
      gradient: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
      glowColor: "rgba(168, 85, 247, 0.25)",
    },
  ];

  return (
    <div className="dash-root-wrapper">
      {/* Hero Welcome Banner */}
      <div className="dash-hero-card">
        <div className="dash-hero-content">
          <div className="dash-hero-badge">
            <span className="live-pulse-dot"></span>
            <span>BEAUTYHUB MANAGEMENT SUITE</span>
          </div>
          <h1 className="dash-hero-title">
            {getTimeGreeting()},{" "}
            <span className="hero-name-highlight">
              {storedUser?.name ? storedUser.name.split(" ")[0] : "Administrator"}
            </span>
            !
          </h1>
          <p className="dash-hero-subtitle">
            Welcome to your executive console. Here is the operational summary of your BeautyHub store.
          </p>
        </div>

        <div className="dash-hero-meta">
          <div className="dash-date-pill">
            <i className="fa-regular fa-calendar-days"></i>
            <span>{getFormattedDate()}</span>
          </div>
          <Link to="/add-product" className="dash-cta-btn">
            <i className="fa-solid fa-plus"></i>
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="dash-shortcuts-card">
        <div className="shortcuts-label">
          <i className="fa-solid fa-bolt"></i>
          <span>QUICK ACTIONS</span>
        </div>
        <div className="shortcuts-buttons">
          <Link to="/add-product" className="shortcut-chip">
            <i className="fa-solid fa-circle-plus text-primary"></i>
            <span>Add Product</span>
          </Link>
          <Link to="/all-orders" className="shortcut-chip">
            <i className="fa-solid fa-cart-shopping text-success"></i>
            <span>All Orders</span>
          </Link>
          <Link to="/add-coupon" className="shortcut-chip">
            <i className="fa-solid fa-tag text-warning"></i>
            <span>New Coupon</span>
          </Link>
          <Link to="/all-vendors" className="shortcut-chip">
            <i className="fa-solid fa-store text-info"></i>
            <span>Vendors & KYC</span>
          </Link>
          <Link to="/add-banner" className="shortcut-chip">
            <i className="fa-solid fa-image text-danger"></i>
            <span>Upload Banner</span>
          </Link>
          <Link to="/admin-staff-roles" className="shortcut-chip">
            <i className="fa-solid fa-user-shield text-secondary"></i>
            <span>Staff Permissions</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="dash-kpi-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="dash-stat-card">
            <div className="card-top-row">
              <div
                className="stat-icon-wrapper"
                style={{
                  background: card.gradient,
                  boxShadow: `0 4px 14px ${card.glowColor}`,
                }}
              >
                <i className={card.icon}></i>
              </div>
              <span className="stat-unit-pill">{card.unit}</span>
            </div>

            <div className="stat-middle-info">
              <div className="stat-count-number">
                {isLoading ? (
                  <span className="stat-skeleton">--</span>
                ) : (
                  card.count
                )}
              </div>
              <h3 className="stat-card-title">{card.title}</h3>
              <p className="stat-card-desc">{card.desc}</p>
            </div>

            <div className="card-bottom-link">
              <Link to={card.to} className="stat-action-link">
                <span>Manage {card.title}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer Panel */}
      <div className="dash-overview-panel">
        <div className="overview-header">
          <div>
            <h4 className="overview-title">System & Operational Integrity</h4>
            <p className="overview-desc">Continuous monitoring of your store systems and services</p>
          </div>
          <span className="system-live-badge">
            <i className="fa-solid fa-circle-check"></i> All Systems Operational
          </span>
        </div>

        <div className="overview-grid">
          <div className="overview-item">
            <span className="overview-k">Storefront Status</span>
            <span className="overview-v text-success fw-bold">Online & Active</span>
          </div>
          <div className="overview-item">
            <span className="overview-k">Order Processing</span>
            <span className="overview-v text-primary fw-bold">Instant Sync</span>
          </div>
          <div className="overview-item">
            <span className="overview-k">Vendor Marketplace</span>
            <span className="overview-v text-info fw-bold">Multi-Vendor Enabled</span>
          </div>
          <div className="overview-item">
            <span className="overview-k">Data Security</span>
            <span className="overview-v text-dark fw-bold">Role-Based RBAC Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
