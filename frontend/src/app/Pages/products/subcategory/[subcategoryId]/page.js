"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { extractIdFromSlug, generateSlug } from "@/app/utils/generate-slug";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaStar, FaSearch, FaArrowRight, FaShoppingBag, FaSlidersH, FaTimes } from "react-icons/fa";
import { IoSparkles, IoChevronForward } from "react-icons/io5";
import {
  addToWishlist,
  addToWishlistToLocal,
  getWishlistFromServer,
  loadWishlistFromLocalStorage,
  removeFromWishlistToLocal,
  removeFromWishlistToServer,
} from "@/app/redux/slice/wislistSlice";
import { addToCart, AddToCartToServer } from "@/app/redux/slice/cartSlice";

// ─── Price Filter Ranges ───────────────────────────────────────────────────────
const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "1000-2500", label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  { id: "2500-plus", label: "Above ₹2,500", min: 2500, max: Infinity },
];

// ─── Discount Filter Options ──────────────────────────────────────────────────
const DISCOUNT_OPTIONS = [
  { id: "all", label: "All Discounts", min: 0 },
  { id: "10", label: "10% or more", min: 10 },
  { id: "25", label: "25% or more", min: 25 },
  { id: "40", label: "40% or more", min: 40 },
];

export default function SubCategoryProductPage() {
  const { subcategoryId: id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // ── States ──────────────────────────────────────────────────────────────────
  const [subCategory, setSubCategory] = useState(null);
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);

  // Filter & Sort States
  const [searchQuery, setSearchQuery]               = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedDiscount, setSelectedDiscount]     = useState("all");
  const [sortBy, setSortBy]                         = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Redux Selectors
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user }     = useSelector((state) => state.auth);

  // ── 1. Fetch SubCategory Info & Products ────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const subCatId = extractIdFromSlug(id);

      // Fetch SubCategory details & products in parallel
      const [subCatRes, prodRes] = await Promise.allSettled([
        axiosInstance.get(`/api/v1/sub-category/get-single-sub-category/${subCatId}`),
        axiosInstance.get(`/api/v1/sub-category/get-products-by-sub-category/${subCatId}`),
      ]);

      if (subCatRes.status === "fulfilled" && subCatRes.value?.data?.data) {
        setSubCategory(subCatRes.value.data.data);
      }
      if (prodRes.status === "fulfilled" && prodRes.value?.data?.data) {
        setProducts(prodRes.value.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching subcategory products:", error);
      toast.error("Failed to load subcategory products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load Wishlist
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (user && user?.email) {
      dispatch(getWishlistFromServer());
    } else {
      dispatch(loadWishlistFromLocalStorage());
    }
  }, [dispatch, user]);

  // ── 2. Wishlist Handler ──────────────────────────────────────────────────────
  const handleWishlistToggle = async (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    const productId = product._id;
    const isExist = wishlist?.products?.some(
      (item) => String(item._id).trim() === String(productId).trim()
    );

    if (isExist) {
      if (user?.email) {
        dispatch(removeFromWishlistToServer(productId));
      } else {
        dispatch(removeFromWishlistToLocal(productId));
      }
      toast.success("Removed from wishlist", { position: "bottom-right" });
    } else {
      if (user?.email) {
        try {
          const res = await axiosInstance.post("/api/v1/wishlist/add-to-wishlist", { productId });
          if (res.status === 201 || res.status === 200) {
            dispatch(addToWishlist(product));
          }
        } catch {
          toast.error("Failed to add to wishlist.");
          return;
        }
      } else {
        dispatch(addToWishlistToLocal(product));
      }
      toast.success("Added to wishlist! ❤️", { position: "bottom-right" });
    }
  };

  // ── 3. Cart Handler ──────────────────────────────────────────────────────────
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    if (!product) return;

    if (user?.email) {
      dispatch(AddToCartToServer({ productId: product._id, quantity: 1 }));
    } else {
      dispatch(
        addToCart({
          productId:  product._id,
          quantity:   1,
          image:      product.images?.[0],
          finalPrice: product.finalPrice,
          name:       product.productName,
          stock:      product.stock ?? 10,
          discount:   product.discount,
          price:      product.price,
        })
      );
    }
    toast.success("Added to cart! 🛍️", { position: "bottom-right" });
  };

  // ── 4. Filter & Sort Logic (useMemo) ─────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Price range filter
    const rangeObj = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
    if (rangeObj && rangeObj.id !== "all") {
      result = result.filter((p) => {
        const price = p.finalPrice ?? p.price ?? 0;
        return price >= rangeObj.min && price <= rangeObj.max;
      });
    }

    // Discount filter
    const discObj = DISCOUNT_OPTIONS.find((d) => d.id === selectedDiscount);
    if (discObj && discObj.id !== "all") {
      result = result.filter((p) => (p.discount ?? 0) >= discObj.min);
    }

    // Sort By
    switch (sortBy) {
      case "lowToHigh":
        result.sort((a, b) => (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price));
        break;
      case "highToLow":
        result.sort((a, b) => (b.finalPrice ?? b.price) - (a.finalPrice ?? a.price));
        break;
      case "discount":
        result.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
        break;
      case "nameAZ":
        result.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchQuery, selectedPriceRange, selectedDiscount, sortBy]);

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPriceRange("all");
    setSelectedDiscount("all");
    setSortBy("featured");
  };

  const subCategoryTitle =
    subCategory?.subCategoryName ||
    (products?.[0]?.subCategory?.subCategoryName ?? "Boutique Collection");

  return (
    <>
      <style>{customCSS}</style>

      <div className="bh-subcat-page">

        {/* ── Breadcrumbs Navigation ── */}
        <nav className="bh-breadcrumb-nav" aria-label="breadcrumb">
          <div className="container">
            <ol className="bh-breadcrumb">
              <li className="bh-breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="bh-breadcrumb-sep"><IoChevronForward /></li>
              <li className="bh-breadcrumb-item">
                <Link href="/Pages/products">Products</Link>
              </li>
              <li className="bh-breadcrumb-sep"><IoChevronForward /></li>
              <li className="bh-breadcrumb-item bh-breadcrumb-active">
                {subCategoryTitle}
              </li>
            </ol>
          </div>
        </nav>

        {/* ── Hero Banner Section ── */}
        <section className="bh-subcat-hero">
          <div className="container">
            <div className="bh-hero-content">
              <span className="bh-hero-chip">
                <IoSparkles className="sparkle-icon" /> Curated Beauty Collection
              </span>
              <h1 className="bh-hero-title">{subCategoryTitle}</h1>
              <p className="bh-hero-sub">
                Explore our exclusive luxury formulas, organic skincare, plush teddies & bespoke gift sets.
              </p>
              <div className="bh-hero-stats">
                <span className="bh-stat-badge">
                  <strong>{filteredProducts.length}</strong> Products Found
                </span>
                <span className="bh-stat-badge">✨ 100% Authentic</span>
                <span className="bh-stat-badge">🚚 Free Delivery &gt; ₹499</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter & Search Control Bar ── */}
        <section className="bh-filter-bar-wrap sticky-top">
          <div className="container">
            <div className="bh-filter-bar">
              
              {/* Search Box */}
              <div className="bh-search-box">
                <FaSearch className="bh-search-icon" />
                <input
                  type="text"
                  placeholder="Search in this collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bh-search-input"
                />
                {searchQuery && (
                  <button className="bh-clear-search" onClick={() => setSearchQuery("")}>
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Desktop Filters */}
              <div className="bh-desktop-filters">
                
                {/* Price Select */}
                <div className="bh-select-wrap">
                  <span className="bh-select-label">Price:</span>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="bh-select"
                  >
                    {PRICE_RANGES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount Select */}
                <div className="bh-select-wrap">
                  <span className="bh-select-label">Discount:</span>
                  <select
                    value={selectedDiscount}
                    onChange={(e) => setSelectedDiscount(e.target.value)}
                    className="bh-select"
                  >
                    {DISCOUNT_OPTIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Select */}
                <div className="bh-select-wrap">
                  <span className="bh-select-label">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bh-select bh-select-highlight"
                  >
                    <option value="featured">Featured / Popular</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                    <option value="nameAZ">Name: A to Z</option>
                  </select>
                </div>

                {/* Reset Filters */}
                {(selectedPriceRange !== "all" || selectedDiscount !== "all" || searchQuery || sortBy !== "featured") && (
                  <button className="bh-reset-btn" onClick={resetFilters}>
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                className="bh-mobile-filter-btn"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              >
                <FaSlidersH /> Filters ({filteredProducts.length})
              </button>

            </div>

            {/* Mobile Filter Drawer / Panel */}
            {isMobileFilterOpen && (
              <div className="bh-mobile-drawer">
                <div className="bh-mobile-drawer-header">
                  <h5>Filter &amp; Sort Products</h5>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <FaTimes />
                  </button>
                </div>

                <div className="bh-mobile-drawer-body">
                  <div className="bh-drawer-group">
                    <label>Sort By</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="featured">Featured / Popular</option>
                      <option value="lowToHigh">Price: Low to High</option>
                      <option value="highToLow">Price: High to Low</option>
                      <option value="discount">Highest Discount</option>
                      <option value="nameAZ">Name: A to Z</option>
                    </select>
                  </div>

                  <div className="bh-drawer-group">
                    <label>Price Range</label>
                    <select value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)}>
                      {PRICE_RANGES.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bh-drawer-group">
                    <label>Discount</label>
                    <select value={selectedDiscount} onChange={(e) => setSelectedDiscount(e.target.value)}>
                      {DISCOUNT_OPTIONS.map((d) => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bh-drawer-actions">
                    <button className="bh-btn-apply" onClick={() => setIsMobileFilterOpen(false)}>
                      Apply Filters
                    </button>
                    <button className="bh-btn-clear" onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }}>
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Main Products Grid Section ── */}
        <section className="bh-products-grid-section">
          <div className="container">

            {/* Loading State - Skeleton Cards */}
            {loading ? (
              <div className="bh-grid">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="bh-skeleton-card">
                    <div className="bh-skeleton-img" />
                    <div className="bh-skeleton-body">
                      <div className="bh-skeleton-line w-80" />
                      <div className="bh-skeleton-line w-50" />
                      <div className="bh-skeleton-line w-60" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="bh-empty-state">
                <div className="bh-empty-icon">🛍️</div>
                <h3>No Products Found</h3>
                <p>We couldn&apos;t find any products matching your search or selected filters.</p>
                <button className="bh-btn-reset-large" onClick={resetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="bh-grid">
                {filteredProducts.map((item) => {
                  const isWishlisted = wishlist?.products?.some(
                    (p) => String(p._id).trim() === String(item._id).trim()
                  );
                  const imageSrc =
                    item?.images?.[0] ||
                    item?.subCategory?.subCategoryImage ||
                    "/images/placeholder.png";

                  const discountPercentage =
                    item.discount ??
                    (item.price && item.finalPrice
                      ? Math.round(((item.price - item.finalPrice) / item.price) * 100)
                      : 0);

                  return (
                    <div key={item._id} className="bh-card">
                      
                      {/* Top Badges */}
                      <div className="bh-card-badges">
                        {discountPercentage > 0 && (
                          <span className="bh-badge-discount">{discountPercentage}% OFF</span>
                        )}
                        {item.isFeatured && (
                          <span className="bh-badge-featured">Best Seller</span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        className={`bh-wishlist-btn ${isWishlisted ? "active" : ""}`}
                        onClick={(e) => handleWishlistToggle(e, item)}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {isWishlisted ? (
                          <FaHeart className="bh-heart-filled" />
                        ) : (
                          <FaRegHeart className="bh-heart-outline" />
                        )}
                      </button>

                      {/* Product Image Link */}
                      <Link
                        href={`/Pages/products/${generateSlug(item?.productName, item?._id)}`}
                        className="bh-card-img-wrap"
                      >
                        <Image
                          src={imageSrc}
                          alt={item.productName || "BeautyHub Product"}
                          fill
                          sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
                          className="bh-card-img"
                        />
                        <div className="bh-img-overlay" />
                      </Link>

                      {/* Card Info */}
                      <div className="bh-card-info">
                        
                        {/* Subcategory Label */}
                        <span className="bh-card-category">
                          {item?.subCategory?.subCategoryName || subCategoryTitle}
                        </span>

                        {/* Title */}
                        <Link
                          href={`/Pages/products/${generateSlug(item?.productName, item?._id)}`}
                          className="bh-card-title-link"
                        >
                          <h3 className="bh-card-title">{item.productName}</h3>
                        </Link>

                        {/* Ratings */}
                        <div className="bh-card-rating">
                          <div className="bh-stars">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                          </div>
                          <span className="bh-rating-text">4.9 (120+)</span>
                        </div>

                        {/* Price Row */}
                        <div className="bh-price-row">
                          <span className="bh-final-price">
                            ₹{item.finalPrice?.toLocaleString("en-IN")}
                          </span>
                          {item.price > item.finalPrice && (
                            <span className="bh-original-price">
                              ₹{item.price?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* Card Action Buttons */}
                        <div className="bh-card-actions">
                          <button
                            className="bh-btn-cart"
                            onClick={(e) => handleAddToCart(e, item)}
                          >
                            <FaShoppingBag /> + Cart
                          </button>
                          <Link
                            href={`/Pages/products/${generateSlug(item?.productName, item?._id)}`}
                            className="bh-btn-view"
                          >
                            Details <FaArrowRight style={{ fontSize: "0.75rem" }} />
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

      </div>
    </>
  );
}

// ─── Scoped CSS Styling for Luxury BeautyHub Theme ────────────────────────────
const customCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .bh-subcat-page {
    background-color: #faf7f9;
    min-height: 100vh;
    padding-bottom: 80px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Breadcrumb Navigation ── */
  .bh-breadcrumb-nav {
    background: #ffffff;
    border-bottom: 1px solid #fce4ec;
    padding: 12px 0;
  }

  .bh-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.85rem;
  }

  .bh-breadcrumb-item a {
    color: #666;
    text-decoration: none;
    transition: color 0.2s;
  }

  .bh-breadcrumb-item a:hover {
    color: #c2185b;
  }

  .bh-breadcrumb-sep {
    color: #ccc;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
  }

  .bh-breadcrumb-active {
    color: #c2185b;
    font-weight: 600;
  }

  /* ── Hero Banner Section ── */
  .bh-subcat-hero {
    background: linear-gradient(135deg, #2b0818 0%, #4a0e2e 50%, #17040d 100%);
    color: #ffffff;
    padding: 48px 0 54px;
    position: relative;
    overflow: hidden;
  }

  .bh-subcat-hero::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(233,30,140,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .bh-hero-content {
    max-width: 720px;
    position: relative;
    z-index: 1;
  }

  .bh-hero-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    color: #fce4ec;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 14px;
  }

  .bh-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    margin: 0 0 12px;
    line-height: 1.15;
    background: linear-gradient(90deg, #ffffff, #fce4ec);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .bh-hero-sub {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 24px;
    line-height: 1.6;
  }

  .bh-hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .bh-stat-badge {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: #fff;
  }

  /* ── Filter Bar Section ── */
  .bh-filter-bar-wrap {
    background: #ffffff;
    border-bottom: 1px solid #f1d5e2;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    z-index: 100;
    padding: 14px 0;
  }

  .bh-filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  /* Search Box */
  .bh-search-box {
    position: relative;
    flex: 1;
    min-width: 240px;
    max-width: 380px;
  }

  .bh-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 0.9rem;
  }

  .bh-search-input {
    width: 100%;
    padding: 9px 36px 9px 38px;
    border-radius: 25px;
    border: 1.5px solid #f4c2d7;
    background: #fff8fb;
    font-size: 0.88rem;
    color: #333;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
  }

  .bh-search-input:focus {
    border-color: #c2185b;
    box-shadow: 0 0 0 3px rgba(194, 24, 91, 0.12);
  }

  .bh-clear-search {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
  }

  /* Desktop Filters */
  .bh-desktop-filters {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .bh-select-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1px solid #e2cad6;
    padding: 4px 12px;
    border-radius: 20px;
    transition: border-color 0.2s;
  }

  .bh-select-wrap:hover {
    border-color: #c2185b;
  }

  .bh-select-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #777;
    white-space: nowrap;
  }

  .bh-select {
    border: none;
    background: transparent;
    font-size: 0.85rem;
    font-weight: 600;
    color: #333;
    outline: none;
    cursor: pointer;
  }

  .bh-select-highlight {
    color: #c2185b;
  }

  .bh-reset-btn {
    background: #fce4ec;
    color: #c2185b;
    border: none;
    padding: 7px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .bh-reset-btn:hover {
    background: #c2185b;
    color: #fff;
  }

  /* Mobile Filter Toggle */
  .bh-mobile-filter-btn {
    display: none;
    align-items: center;
    gap: 8px;
    background: #c2185b;
    color: #fff;
    border: none;
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  /* ── Mobile Drawer ── */
  .bh-mobile-drawer {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1100;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .bh-mobile-drawer-header {
    background: #fff;
    padding: 16px 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .bh-mobile-drawer-header h5 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
  }

  .bh-mobile-drawer-header button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }

  .bh-mobile-drawer-body {
    background: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bh-drawer-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .bh-drawer-group label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #555;
  }

  .bh-drawer-group select {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
    font-size: 0.9rem;
  }

  .bh-drawer-actions {
    display: flex;
    gap: 12px;
    margin-top: 10px;
  }

  .bh-btn-apply {
    flex: 1;
    background: #c2185b;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 10px;
    font-weight: 700;
  }

  .bh-btn-clear {
    flex: 1;
    background: #f5f5f5;
    color: #333;
    border: none;
    padding: 12px;
    border-radius: 10px;
    font-weight: 600;
  }

  /* ── Products Grid Section ── */
  .bh-products-grid-section {
    padding: 40px 0 60px;
  }

  .bh-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
  }

  /* ── Card Styling ── */
  .bh-card {
    position: relative;
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #fce4ec;
    box-shadow: 0 6px 20px rgba(194, 24, 91, 0.05);
    display: flex;
    flex-direction: column;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
  }

  .bh-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(194, 24, 91, 0.15);
  }

  /* Badges */
  .bh-card-badges {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .bh-badge-discount {
    background: #c2185b;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(194, 24, 91, 0.3);
  }

  .bh-badge-featured {
    background: #111827;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 10px;
  }

  /* Wishlist Button */
  .bh-wishlist-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border: 1px solid #fce4ec;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.25s, background 0.25s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .bh-wishlist-btn:hover {
    transform: scale(1.12);
    background: #fff;
  }

  .bh-heart-outline {
    color: #888;
    font-size: 1.1rem;
    transition: color 0.2s;
  }

  .bh-wishlist-btn:hover .bh-heart-outline {
    color: #c2185b;
  }

  .bh-heart-filled {
    color: #e91e8c;
    font-size: 1.1rem;
    animation: bhHeartBeat 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.49);
  }

  @keyframes bhHeartBeat {
    0% { transform: scale(0.6); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  /* Image Area */
  .bh-card-img-wrap {
    position: relative;
    width: 100%;
    height: 230px;
    overflow: hidden;
    background: #fdf5f8;
    display: block;
  }

  .bh-card-img {
    object-fit: cover;
    transition: transform 0.5s ease !important;
  }

  .bh-card:hover .bh-card-img {
    transform: scale(1.08) !important;
  }

  /* Info Block */
  .bh-card-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .bh-card-category {
    font-size: 0.72rem;
    font-weight: 700;
    color: #c2185b;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .bh-card-title-link {
    text-decoration: none;
    color: inherit;
  }

  .bh-card-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.98rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 6px;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s;
  }

  .bh-card-title-link:hover .bh-card-title {
    color: #c2185b;
  }

  .bh-card-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }

  .bh-stars {
    color: #f59e0b;
    font-size: 0.78rem;
    display: flex;
    gap: 2px;
  }

  .bh-rating-text {
    font-size: 0.75rem;
    color: #888;
    font-weight: 600;
  }

  /* Price Row */
  .bh-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: auto;
    margin-bottom: 14px;
  }

  .bh-final-price {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    color: #c2185b;
  }

  .bh-original-price {
    font-size: 0.85rem;
    color: #aaa;
    text-decoration: line-through;
  }

  /* Card Actions */
  .bh-card-actions {
    display: flex;
    gap: 8px;
  }

  .bh-btn-cart {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: linear-gradient(135deg, #e91e8c, #c2185b);
    color: #ffffff;
    border: none;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
  }

  .bh-btn-cart:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  .bh-btn-view {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #fff;
    color: #c2185b;
    border: 1.5px solid #fce4ec;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s;
  }

  .bh-btn-view:hover {
    background: #fce4ec;
    border-color: #c2185b;
  }

  /* ── Skeleton Loaders ── */
  .bh-skeleton-card {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #fce4ec;
    height: 380px;
  }

  .bh-skeleton-img {
    height: 230px;
    background: linear-gradient(90deg, #fce4ec 25%, #fce8ef 50%, #fce4ec 75%);
    background-size: 200% 100%;
    animation: bhShimmer 1.5s infinite;
  }

  .bh-skeleton-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bh-skeleton-line {
    height: 14px;
    background: linear-gradient(90deg, #fce4ec 25%, #fce8ef 50%, #fce4ec 75%);
    background-size: 200% 100%;
    border-radius: 4px;
    animation: bhShimmer 1.5s infinite;
  }
  .w-80 { width: 80%; }
  .w-60 { width: 60%; }
  .w-50 { width: 50%; }

  @keyframes bhShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  /* ── Empty State ── */
  .bh-empty-state {
    text-align: center;
    padding: 80px 20px;
    background: #fff;
    border-radius: 20px;
    border: 1px border-dashed #fce4ec;
    box-shadow: 0 6px 24px rgba(194, 24, 91, 0.04);
  }

  .bh-empty-icon {
    font-size: 3.5rem;
    margin-bottom: 16px;
  }

  .bh-empty-state h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .bh-empty-state p {
    color: #777;
    font-size: 0.95rem;
    max-width: 480px;
    margin: 0 auto 24px;
  }

  .bh-btn-reset-large {
    background: #c2185b;
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.25s, transform 0.2s;
  }

  .bh-btn-reset-large:hover {
    background: #e91e8c;
    transform: translateY(-2px);
  }

  /* ── Responsive Media Queries ── */
  @media (max-width: 992px) {
    .bh-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .bh-card-img-wrap { height: 190px; }
  }

  @media (max-width: 768px) {
    .bh-desktop-filters { display: none; }
    .bh-mobile-filter-btn { display: inline-flex; }
    .bh-subcat-hero { padding: 36px 0 42px; }
    .bh-hero-title { font-size: 2.2rem; }
    .bh-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .bh-card { border-radius: 14px; }
    .bh-card-info { padding: 12px; }
    .bh-card-img-wrap { height: 170px; }
    .bh-card-title { font-size: 0.88rem; }
    .bh-final-price { font-size: 1.05rem; }
    .bh-btn-cart { font-size: 0.75rem; padding: 7px 8px; }
    .bh-btn-view { font-size: 0.75rem; padding: 7px 8px; }
  }

  @media (max-width: 400px) {
    .bh-grid { grid-template-columns: 1fr; }
    .bh-card-img-wrap { height: 220px; }
  }
`;
