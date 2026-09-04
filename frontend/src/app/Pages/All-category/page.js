"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import AllProducts from "@/app/Components/all-products/page";
import "./category.css";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { generateSlug } from "@/app/utils/generate-slug";
import { FaSearch, FaTimes, FaStar, FaArrowRight } from "react-icons/fa";
import { IoSparkles, IoChevronForward } from "react-icons/io5";

export default function AllCategory() {
  const [navTree, setNavTree] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const [treeRes, catRes] = await Promise.all([
          axiosInstance.get("/api/v1/main-category/get-navbar-categories-tree"),
          axiosInstance.get("/api/v1/category/get-all-categories"),
        ]);

        if (treeRes?.data?.data) {
          setNavTree(treeRes.data.data);
        }
        if (catRes?.data?.data) {
          setCategories(catRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const filteredCategories = useMemo(() => {
    let list = categories;

    if (selectedMainCategory !== "all") {
      const activeMainItem = navTree.find((m) => String(m._id) === String(selectedMainCategory));
      list = activeMainItem?.categories || [];
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((c) =>
        (c.categoryName || "").toLowerCase().includes(term)
      );
    }

    let result = [...list];
    if (sortBy === "nameAZ") {
      result.sort((a, b) => (a.categoryName || "").localeCompare(b.categoryName || ""));
    } else if (sortBy === "nameZA") {
      result.sort((a, b) => (b.categoryName || "").localeCompare(a.categoryName || ""));
    } else if (sortBy === "subs") {
      result.sort((a, b) => (b.subCategories?.length || 0) - (a.subCategories?.length || 0));
    }

    return result;
  }, [categories, navTree, selectedMainCategory, searchTerm, sortBy]);

  const resetFilters = () => {
    setSelectedMainCategory("all");
    setSearchTerm("");
    setSortBy("featured");
  };

  return (
    <div className="bh-category-page">
      {/* ── Breadcrumb ── */}
      <nav className="bh-breadcrumb-nav" aria-label="breadcrumb">
        <div className="container">
          <ol className="bh-breadcrumb">
            <li className="bh-breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="bh-breadcrumb-sep"><IoChevronForward /></li>
            <li className="bh-breadcrumb-item bh-breadcrumb-active">
              All Categories
            </li>
          </ol>
        </div>
      </nav>

      {/* ── Hero Banner Section (Matches Product Search Hero) ── */}
      <section className="bh-search-hero">
        <div className="container">
          <div className="bh-hero-inner">
            <span className="bh-chip">
              <IoSparkles className="sparkle-icon" /> OFFICIAL BEAUTYHUB CATALOGUE
            </span>
            <h1 className="bh-hero-title">Explore All Categories</h1>
            <p className="bh-hero-desc">
              Discover 100% authentic organic skincare, glamour cosmetics, giant soft plush teddies &amp; luxury celebration hampers.
            </p>

            <div className="bh-hero-pills mt-3 d-flex flex-wrap gap-2">
              <span className="bh-hero-badge">📦 {categories.length} Collections Available</span>
              <span className="bh-hero-badge">🌱 100% Cruelty Free</span>
              <span className="bh-hero-badge">🩺 Dermatologist Approved</span>
              <span className="bh-hero-badge">🚀 Express Doorstep Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Bar Section ── */}
      <section className="bh-filter-section sticky-top">
        <div className="container">
          <div className="bh-filter-bar">
            {/* Search wrap */}
            <div className="bh-search-wrap">
              <FaSearch className="bh-search-icon" />
              <input
                type="text"
                placeholder="Search categories, collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bh-search-input"
              />
              {searchTerm && (
                <button type="button" className="bh-search-clear" onClick={() => setSearchTerm("")}>
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="bh-desktop-filters">
              {/* Main Category Select */}
              <div className="bh-control-wrap">
                <span className="bh-control-label">Category:</span>
                <select
                  value={selectedMainCategory}
                  onChange={(e) => setSelectedMainCategory(e.target.value)}
                  className="bh-control-select"
                >
                  <option value="all">All Categories ({categories.length})</option>
                  {navTree.map((m) => (
                    <option key={m._id} value={m._id}>{m.mainCategoryName}</option>
                  ))}
                </select>
              </div>

              {/* Sort Select */}
              <div className="bh-control-wrap">
                <span className="bh-control-label">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bh-control-select bh-select-highlight"
                >
                  <option value="featured">Featured / Popular</option>
                  <option value="nameAZ">Name: A to Z</option>
                  <option value="nameZA">Name: Z to A</option>
                  <option value="subs">Most Subcategories</option>
                </select>
              </div>

              {(selectedMainCategory !== "all" || searchTerm || sortBy !== "featured") && (
                <button className="bh-reset-btn" onClick={resetFilters}>
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Quick Pill Filter Chips Bar */}
          <div className="bh-filter-chips-wrapper mt-2">
            <div className="bh-filter-chips">
              <button
                className={`bh-pill-btn ${selectedMainCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedMainCategory("all")}
              >
                ✨ All Items ({categories.length})
              </button>
              {navTree.map((mainItem) => (
                <button
                  key={mainItem._id}
                  className={`bh-pill-btn ${selectedMainCategory === mainItem._id ? "active" : ""}`}
                  onClick={() => setSelectedMainCategory(mainItem._id)}
                >
                  {mainItem.mainCategoryName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── Category Cards Grid ── */}
      <section className="bh-products-grid-section">
        <div className="container">
          {loading ? (
            <div className="bh-grid">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bh-skeleton-card">
                  <div className="bh-skeleton-img" />
                  <div className="bh-skeleton-body">
                    <div className="bh-skeleton-line w-80" />
                    <div className="bh-skeleton-line w-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="bh-empty-state text-center py-5">
              <div className="bh-empty-icon mb-3" style={{ fontSize: "3rem" }}>🔍</div>
              <h3>No Categories Found</h3>
              <p className="text-muted">We couldn't find any category matching your filter criteria.</p>
              <button className="btn bh-btn-cart px-4 py-2 mt-2" onClick={resetFilters}>
                View All Categories
              </button>
            </div>
          ) : (
            <div className="bh-grid">
              {filteredCategories.map((item) => {
                const slug = generateSlug(item?.categoryName, item?._id);
                return (
                  <div key={item._id} className="bh-card">
                    {/* Badge */}
                    <div className="bh-card-badges">
                      <span className="bh-badge-featured">Best Seller</span>
                    </div>

                    {/* Image wrap */}
                    <Link href={`/Pages/category/${slug}`} className="bh-card-img-wrap">
                      <Image
                        src={item?.categoryImage || "/images/placeholder.png"}
                        alt={item?.categoryName || "Category"}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="bh-card-img"
                      />
                    </Link>

                    {/* Info */}
                    <div className="bh-card-info">
                      <span className="bh-card-category">Boutique Collection</span>
                      
                      <Link href={`/Pages/category/${slug}`} className="bh-card-title-link">
                        <h3 className="bh-card-title">{item.categoryName}</h3>
                      </Link>

                      <div className="bh-card-rating">
                        <div className="bh-stars">
                          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <span className="bh-rating-text">4.9 (150+)</span>
                      </div>

                      {item.subCategories && item.subCategories.length > 0 && (
                        <div className="bh-sub-chips-wrap d-flex flex-wrap gap-1 mb-3">
                          {item.subCategories.slice(0, 3).map((sub) => (
                            <span key={sub._id} className="bh-mini-sub-tag">
                              {sub.subCategoryName}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="bh-card-actions mt-auto">
                        <Link href={`/Pages/category/${slug}`} className="bh-btn-cart text-decoration-none">
                          Explore Collection <FaArrowRight style={{ fontSize: "0.75rem" }} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured All Products Component below */}
      <section className="border-top pt-4">
        <AllProducts />
      </section>
    </div>
  );
}
