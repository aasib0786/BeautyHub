"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { axiosInstance } from "@/app/utils/axiosInstance";
import { extractIdFromSlug, generateSlug } from "@/app/utils/generate-slug";
import { NoItem } from "@/app/utils/NoItem";
import {
  addToWishlist,
  addToWishlistToLocal,
  getWishlistFromServer,
  loadWishlistFromLocalStorage,
  removeFromWishlistToLocal,
  removeFromWishlistToServer,
} from "@/app/redux/slice/wislistSlice";
import { addToCart, AddToCartToServer } from "@/app/redux/slice/cartSlice";

import { FaHeart, FaRegHeart, FaStar, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { IoSparkles, IoChevronForward } from "react-icons/io5";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [category, setCategory]           = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);

  // Redux Selectors
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user }     = useSelector((state) => state.auth);

  const categoryId = extractIdFromSlug(id);

  // ── Fetch Category Details ──────────────────────────────────────────────────
  const fetchCategoryDetails = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/category/get-single-category/${categoryId}`);
      if (res.status === 200 && res?.data?.data) {
        setCategory(res.data.data);
      }
    } catch {
      // Non-critical fallback
    }
  };

  // ── Fetch Subcategories ─────────────────────────────────────────────────────
  const fetchSubCategories = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/category/get-subcategories-by-category/${categoryId}`
      );
      if (res.status === 200) {
        setSubcategories(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // ── Fetch Products ──────────────────────────────────────────────────────────
  const fetchCategoryProducts = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/product/get-products-by-category/${categoryId}`
      );
      if (res.status === 200) {
        setProducts(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.allSettled([
      fetchCategoryDetails(),
      fetchSubCategories(),
      fetchCategoryProducts(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user?.email) {
      dispatch(getWishlistFromServer());
    } else {
      dispatch(loadWishlistFromLocalStorage());
    }
  }, [dispatch, user]);

  // ── Wishlist Toggle ─────────────────────────────────────────────────────────
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

  // ── Cart Handler ────────────────────────────────────────────────────────────
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

  const categoryTitle =
    category?.categoryName ||
    subcategories?.[0]?.Category?.categoryName ||
    products?.[0]?.category?.categoryName ||
    "Beauty Collection";

  return (
    <>
      <style>{customCSS}</style>

      <div className="bh-cat-page">

        {/* Breadcrumb */}
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
                {categoryTitle}
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bh-hero-section">
          <div className="container">
            <div className="bh-hero-inner">
              <span className="bh-chip">
                <IoSparkles className="sparkle-icon" /> Official Category
              </span>
              <h1 className="bh-hero-title">{categoryTitle}</h1>
              <p className="bh-hero-desc">
                Explore our handpicked organic formulations, luxury lipsticks, soft plush teddies & celebration gift sets under {categoryTitle}.
              </p>
              <div className="bh-hero-stats">
                <span className="bh-stat-pill">
                  <strong>{subcategories.length}</strong> Subcategories
                </span>
                <span className="bh-stat-pill">
                  <strong>{products.length}</strong> Products
                </span>
                <span className="bh-stat-pill">✨ 100% Authentic Guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories Showcase */}
        <section className="bh-subcat-section">
          <div className="container">
            <div className="bh-section-header">
              <h2>Explore Subcategories</h2>
              <p>Select a specialized subcategory to browse products</p>
            </div>

            {loading ? (
              <div className="bh-subcat-grid">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bh-skeleton-subcat" />
                ))}
              </div>
            ) : subcategories.length === 0 ? (
              <NoItem name="Subcategories" />
            ) : (
              <div className="bh-subcat-grid">
                {subcategories.map((subCat) => (
                  <Link
                    key={subCat._id}
                    href={`/Pages/products/subcategory/${generateSlug(
                      subCat?.subCategoryName,
                      subCat?._id
                    )}`}
                    className="bh-subcat-card"
                  >
                    <div className="bh-subcat-img-wrap">
                      <Image
                        src={subCat?.subCategoryImage || "/images/placeholder.png"}
                        alt={subCat?.subCategoryName}
                        fill
                        sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 20vw"
                        className="bh-subcat-img"
                      />
                    </div>
                    <div className="bh-subcat-info">
                      <h3>{subCat.subCategoryName}</h3>
                      <span className="bh-explore-link">
                        Explore Collection <FaArrowRight style={{ fontSize: "0.75rem" }} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Products List Section */}
        {products && products.length > 0 && (
          <section className="bh-products-section">
            <div className="container">
              <div className="bh-section-header">
                <h2>Featured Products in {categoryTitle}</h2>
                <p>Top rated products loved by our customers</p>
              </div>

              <div className="bh-grid">
                {products.map((item) => {
                  const isWishlisted = wishlist?.products?.some(
                    (p) => String(p._id).trim() === String(item._id).trim()
                  );
                  const imageSrc = item?.images?.[0] || "/images/placeholder.png";

                  const discountPercentage =
                    item.discount ??
                    (item.price && item.finalPrice
                      ? Math.round(((item.price - item.finalPrice) / item.price) * 100)
                      : 0);

                  return (
                    <div key={item._id} className="bh-card">

                      {/* Badges */}
                      <div className="bh-card-badges">
                        {discountPercentage > 0 && (
                          <span className="bh-badge-discount">{discountPercentage}% OFF</span>
                        )}
                        {item.isFeatured && (
                          <span className="bh-badge-featured">Best Seller</span>
                        )}
                      </div>

                      {/* Wishlist */}
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

                      {/* Image */}
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

                      {/* Info */}
                      <div className="bh-card-info">
                        <span className="bh-card-category">
                          {item?.subCategory?.subCategoryName || categoryTitle}
                        </span>

                        <Link
                          href={`/Pages/products/${generateSlug(item?.productName, item?._id)}`}
                          className="bh-card-title-link"
                        >
                          <h3 className="bh-card-title">{item.productName}</h3>
                        </Link>

                        <div className="bh-card-rating">
                          <div className="bh-stars">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                          </div>
                          <span className="bh-rating-text">4.9 (120+)</span>
                        </div>

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
            </div>
          </section>
        )}

      </div>
    </>
  );
}

// ─── Scoped CSS ───────────────────────────────────────────────────────────────
const customCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .bh-cat-page {
    background-color: #faf7f9;
    min-height: 100vh;
    padding-bottom: 80px;
    font-family: 'DM Sans', sans-serif;
  }

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

  .bh-breadcrumb-item a { color: #666; text-decoration: none; transition: color 0.2s; }
  .bh-breadcrumb-item a:hover { color: #c2185b; }
  .bh-breadcrumb-sep { color: #ccc; display: flex; align-items: center; font-size: 0.75rem; }
  .bh-breadcrumb-active { color: #c2185b; font-weight: 600; }

  /* Hero Section */
  .bh-hero-section {
    background: linear-gradient(135deg, #2b0818 0%, #4a0e2e 50%, #17040d 100%);
    color: #ffffff;
    padding: 48px 0 54px;
    position: relative;
    overflow: hidden;
  }

  .bh-hero-inner { max-width: 720px; }

  .bh-chip {
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
    font-size: clamp(2.2rem, 4vw, 3rem);
    font-weight: 700;
    margin: 0 0 12px;
    background: linear-gradient(90deg, #ffffff, #fce4ec);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .bh-hero-desc { font-size: 0.95rem; color: rgba(255, 255, 255, 0.85); margin: 0 0 24px; line-height: 1.6; }

  .bh-hero-stats { display: flex; flex-wrap: wrap; gap: 12px; }

  .bh-stat-pill {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: #fff;
  }

  /* Subcategories Section */
  .bh-subcat-section { padding: 48px 0 32px; }

  .bh-section-header { text-align: center; margin-bottom: 32px; }

  .bh-section-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 6px;
  }

  .bh-section-header p { color: #777; font-size: 0.92rem; }

  .bh-subcat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }

  .bh-subcat-card {
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #fce4ec;
    text-decoration: none;
    box-shadow: 0 4px 16px rgba(194, 24, 91, 0.04);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .bh-subcat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(194, 24, 91, 0.12);
  }

  .bh-subcat-img-wrap {
    position: relative;
    width: 100%;
    height: 160px;
    background: #fdf5f8;
  }

  .bh-subcat-img { object-fit: cover; transition: transform 0.5s ease !important; }

  .bh-subcat-card:hover .bh-subcat-img { transform: scale(1.08) !important; }

  .bh-subcat-info {
    padding: 14px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bh-subcat-info h3 {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .bh-explore-link {
    font-size: 0.75rem;
    font-weight: 700;
    color: #c2185b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 4px;
  }

  .bh-skeleton-subcat {
    height: 220px;
    border-radius: 18px;
    background: linear-gradient(90deg, #fce4ec 25%, #fce8ef 50%, #fce4ec 75%);
    background-size: 200% 100%;
    animation: bhShimmer 1.5s infinite;
  }

  /* Products Section */
  .bh-products-section { padding: 32px 0 60px; }

  .bh-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; }

  .bh-card {
    position: relative; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #fce4ec; box-shadow: 0 6px 20px rgba(194, 24, 91, 0.05); display: flex; flex-direction: column; transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
  }

  .bh-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(194, 24, 91, 0.15); }

  .bh-card-badges { position: absolute; top: 12px; left: 12px; z-index: 3; display: flex; flex-direction: column; gap: 6px; }

  .bh-badge-discount { background: #c2185b; color: #fff; font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 12px; }

  .bh-badge-featured { background: #111827; color: #fff; font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 10px; }

  .bh-wishlist-btn {
    position: absolute; top: 12px; right: 12px; z-index: 3; width: 36px; height: 36px; border-radius: 50%; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px); border: 1px solid #fce4ec; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.25s;
  }

  .bh-wishlist-btn:hover { transform: scale(1.12); background: #fff; }

  .bh-heart-outline { color: #888; font-size: 1.1rem; }

  .bh-heart-filled { color: #e91e8c; font-size: 1.1rem; animation: bhHeartBeat 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.49); }

  @keyframes bhHeartBeat { 0% { transform: scale(0.6); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }

  .bh-card-img-wrap { position: relative; width: 100%; height: 230px; overflow: hidden; background: #fdf5f8; display: block; }

  .bh-card-img { object-fit: cover; transition: transform 0.5s ease !important; }

  .bh-card:hover .bh-card-img { transform: scale(1.08) !important; }

  .bh-card-info { padding: 16px; display: flex; flex-direction: column; flex: 1; }

  .bh-card-category { font-size: 0.72rem; font-weight: 700; color: #c2185b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }

  .bh-card-title-link { text-decoration: none; color: inherit; }

  .bh-card-title { font-family: 'DM Sans', sans-serif; font-size: 0.98rem; font-weight: 700; color: #1f2937; margin: 0 0 6px; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  .bh-card-rating { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }

  .bh-stars { color: #f59e0b; font-size: 0.78rem; display: flex; gap: 2px; }

  .bh-rating-text { font-size: 0.75rem; color: #888; font-weight: 600; }

  .bh-price-row { display: flex; align-items: baseline; gap: 8px; margin-top: auto; margin-bottom: 14px; }

  .bh-final-price { font-family: 'DM Sans', sans-serif; font-size: 1.25rem; font-weight: 800; color: #c2185b; }

  .bh-original-price { font-size: 0.85rem; color: #aaa; text-decoration: line-through; }

  .bh-card-actions { display: flex; gap: 8px; }

  .bh-btn-cart {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: linear-gradient(135deg, #e91e8c, #c2185b); color: #ffffff; border: none; padding: 9px 12px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: opacity 0.2s;
  }

  .bh-btn-cart:hover { opacity: 0.92; }

  .bh-btn-view {
    display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: #fff; color: #c2185b; border: 1.5px solid #fce4ec; padding: 9px 12px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; text-decoration: none;
  }

  .bh-btn-view:hover { background: #fce4ec; border-color: #c2185b; }

  @keyframes bhShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  @media (max-width: 768px) {
    .bh-subcat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .bh-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  }
`;
