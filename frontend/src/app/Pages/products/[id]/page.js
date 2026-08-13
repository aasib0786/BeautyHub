"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { axiosInstance } from "@/app/utils/axiosInstance";
import { extractIdFromSlug, generateSlug } from "@/app/utils/generate-slug";
import { addToCart, AddToCartToServer } from "@/app/redux/slice/cartSlice";
import {
  addToWishlist,
  addToWishlistToLocal,
  getWishlistFromServer,
  loadWishlistFromLocalStorage,
  removeFromWishlistToLocal,
  removeFromWishlistToServer,
} from "@/app/redux/slice/wislistSlice";

import Product from "@/app/Components/Products/product";
import ProductDetailsSkeleton from "@/app/utils/skeleton/ProductDetailsSkeleton";

import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingBag,
  FaBolt,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCheckCircle,
  FaMinus,
  FaPlus,
  FaShareAlt,
} from "react-icons/fa";
import { IoCallOutline, IoChevronForward, IoSparkles } from "react-icons/io5";
import { TbMessages } from "react-icons/tb";

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  // ── States ──────────────────────────────────────────────────────────────────
  const [product, setProduct]                 = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity]               = useState(1);
  const [activeTab, setActiveTab]             = useState("overview");

  // Redux Selectors
  const { user }     = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  // ── Fetch Product Details ───────────────────────────────────────────────────
  const fetchProductDetails = async () => {
    const productId = extractIdFromSlug(id);
    if (!productId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/v1/product/get-single-product/${productId}`
      );
      if (response.status === 200 && response?.data?.data) {
        const data = response.data.data;
        setProduct(data);

        // Fetch related products by subcategory
        if (data?.subCategory?._id) {
          fetchRelatedProducts(data.subCategory._id);
        }
      }
    } catch (error) {
      console.error("Product details error:", error);
      toast.error("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (subCategoryId) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/sub-category/get-products-by-sub-category/${subCategoryId}`
      );
      if (response.status === 200 && response?.data?.data) {
        // Filter out current product
        const filtered = response.data.data.filter(
          (p) => String(p._id) !== String(extractIdFromSlug(id))
        );
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error("Related products error:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [id]);

  useEffect(() => {
    if (user?.email) {
      dispatch(getWishlistFromServer());
    } else {
      dispatch(loadWishlistFromLocalStorage());
    }
  }, [dispatch, user]);

  // ── Wishlist Toggle ─────────────────────────────────────────────────────────
  const isWishlisted = wishlist?.products?.some(
    (p) => String(p._id).trim() === String(product?._id).trim()
  );

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (isWishlisted) {
      if (user?.email) {
        dispatch(removeFromWishlistToServer(product._id));
      } else {
        dispatch(removeFromWishlistToLocal(product._id));
      }
      toast.success("Removed from wishlist", { position: "bottom-right" });
    } else {
      if (user?.email) {
        try {
          const res = await axiosInstance.post("/api/v1/wishlist/add-to-wishlist", {
            productId: product._id,
          });
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

  // ── Add to Cart ─────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!product) return;
    const maxStock = product.stock || 10;
    if (quantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock.`);
      return;
    }

    if (user?.email) {
      dispatch(
        AddToCartToServer({
          productId: product._id,
          quantity:  quantity,
        })
      );
    } else {
      dispatch(
        addToCart({
          productId:  product._id,
          quantity:   quantity,
          image:      product.images?.[0],
          finalPrice: product.finalPrice,
          name:       product.productName,
          stock:      maxStock,
          discount:   product.discount,
          price:      product.price,
        })
      );
    }
    toast.success("Added to cart! 🛍️", { position: "bottom-right" });
  };

  // ── Buy Now ─────────────────────────────────────────────────────────────────
  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/Pages/Checkout");
  };

  // ── Share Product ───────────────────────────────────────────────────────────
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.productName,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <ProductDetailsSkeleton />;
  if (!product) return null;

  const images = product?.images?.length ? product.images : ["/images/placeholder.png"];
  const currentImage = images[selectedImageIndex] || images[0];

  const discountPercent =
    product.discount ??
    (product.price && product.finalPrice
      ? Math.round(((product.price - product.finalPrice) / product.price) * 100)
      : 0);

  const savingsAmount = (product.price || 0) - (product.finalPrice || 0);

  return (
    <>
      <style>{customCSS}</style>

      <div className="bh-detail-page">

        {/* ── Breadcrumb Navigation ── */}
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
              {product?.category?.categoryName && (
                <>
                  <li className="bh-breadcrumb-sep"><IoChevronForward /></li>
                  <li className="bh-breadcrumb-item">
                    <Link href={`/Pages/products/search?category=${product.category._id}`}>
                      {product.category.categoryName}
                    </Link>
                  </li>
                </>
              )}
              {product?.subCategory?.subCategoryName && (
                <>
                  <li className="bh-breadcrumb-sep"><IoChevronForward /></li>
                  <li className="bh-breadcrumb-item">
                    <Link
                      href={`/Pages/products/subcategory/${generateSlug(
                        product.subCategory.subCategoryName,
                        product.subCategory._id
                      )}`}
                    >
                      {product.subCategory.subCategoryName}
                    </Link>
                  </li>
                </>
              )}
              <li className="bh-breadcrumb-sep"><IoChevronForward /></li>
              <li className="bh-breadcrumb-item bh-breadcrumb-active">
                {product.productName}
              </li>
            </ol>
          </div>
        </nav>

        {/* ── Main Product Detail Container ── */}
        <section className="bh-detail-section">
          <div className="container">
            <div className="bh-detail-grid">

              {/* ── Left Column: Image Gallery ── */}
              <div className="bh-gallery-col">
                <div className="bh-main-img-card">
                  {/* Badges */}
                  <div className="bh-gallery-badges">
                    {discountPercent > 0 && (
                      <span className="bh-badge-discount">{discountPercent}% OFF</span>
                    )}
                    {product.isFeatured && (
                      <span className="bh-badge-featured">Bestseller</span>
                    )}
                  </div>

                  {/* Share & Wishlist Buttons */}
                  <div className="bh-gallery-actions">
                    <button className="bh-icon-btn" onClick={handleShare} title="Share Product">
                      <FaShareAlt />
                    </button>
                    <button
                      className={`bh-icon-btn ${isWishlisted ? "active" : ""}`}
                      onClick={handleWishlistToggle}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isWishlisted ? (
                        <FaHeart className="bh-heart-filled" />
                      ) : (
                        <FaRegHeart className="bh-heart-outline" />
                      )}
                    </button>
                  </div>

                  {/* Main Image */}
                  <div className="bh-main-img-wrap">
                    <Image
                      src={currentImage}
                      alt={product.productName}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="bh-main-img"
                    />
                  </div>
                </div>

                {/* Thumbnails Row */}
                {images.length > 1 && (
                  <div className="bh-thumbs-row">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        className={`bh-thumb-btn ${idx === selectedImageIndex ? "active" : ""}`}
                        onClick={() => setSelectedImageIndex(idx)}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          width={75}
                          height={75}
                          className="bh-thumb-img"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right Column: Product Content & Actions ── */}
              <div className="bh-info-col">

                {/* Subcategory & Brand */}
                <div className="bh-info-header">
                  <span className="bh-subcat-label">
                    {product?.subCategory?.subCategoryName || product?.category?.categoryName || "Beauty & Gifts"}
                  </span>
                  <span className="bh-brand-chip">
                    👑 {product?.brand?.brandName || "BeautyHub Luxury"}
                  </span>
                </div>

                {/* Title */}
                <h1 className="bh-title">{product.productName}</h1>

                {/* Rating & Reviews */}
                <div className="bh-rating-row">
                  <div className="bh-stars">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="bh-rating-score">4.9</span>
                  <span className="bh-rating-count">(180+ verified reviews)</span>
                  <span className="bh-stock-badge in-stock">
                    <FaCheckCircle /> In Stock
                  </span>
                </div>

                {/* Pricing Box */}
                <div className="bh-price-box">
                  <div className="bh-price-main">
                    <span className="bh-final-price">
                      ₹{product.finalPrice?.toLocaleString("en-IN")}
                    </span>
                    {product.price > product.finalPrice && (
                      <span className="bh-original-price">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bh-save-pill">
                        Save ₹{savingsAmount.toLocaleString("en-IN")} ({discountPercent}% OFF)
                      </span>
                    )}
                  </div>
                  <p className="bh-tax-note">Inclusive of all taxes. Free shipping on orders over ₹499.</p>
                </div>

                {/* Short Description */}
                {product.description && (
                  <div
                    className="bh-short-desc"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}

                {/* Quick Attributes Chips */}
                {(product?.skinType || product?.form || product?.idealFor || product?.weight || product?.sku) && (
                  <div className="bh-quick-specs mb-3 d-flex flex-wrap gap-2">
                    {product?.skinType && (
                      <span className="badge bg-light text-dark border px-2 py-1 fs-7">
                        <strong>Skin Type:</strong> {product.skinType}
                      </span>
                    )}
                    {product?.form && (
                      <span className="badge bg-light text-dark border px-2 py-1 fs-7">
                        <strong>Form:</strong> {product.form}
                      </span>
                    )}
                    {product?.idealFor && (
                      <span className="badge bg-light text-dark border px-2 py-1 fs-7">
                        <strong>Ideal For:</strong> {product.idealFor}
                      </span>
                    )}
                    {product?.weight && (
                      <span className="badge bg-light text-dark border px-2 py-1 fs-7">
                        <strong>Net Vol/Wt:</strong> {product.weight}
                      </span>
                    )}
                    {product?.sku && (
                      <span className="badge bg-light text-dark border px-2 py-1 fs-7">
                        <strong>SKU:</strong> {product.sku}
                      </span>
                    )}
                  </div>
                )}

                {/* Key Highlights */}
                {product?.features && product.features.length > 0 && (
                  <div className="bh-highlights-box">
                    <h4>✨ Key Highlights</h4>
                    <div className="bh-highlights-grid">
                      {product.features.map((feat, idx) => (
                        <span key={idx} className="bh-highlight-item">
                          ✔ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="bh-qty-box">
                  <span className="bh-qty-label">Quantity:</span>
                  <div className="bh-qty-counter">
                    <button
                      className="bh-qty-btn"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    >
                      <FaMinus />
                    </button>
                    <span className="bh-qty-val">{quantity}</span>
                    <button
                      className="bh-qty-btn"
                      onClick={() => setQuantity((prev) => Math.min(product.stock || 10, prev + 1))}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="bh-action-buttons">
                  <button className="bh-btn-cart" onClick={handleAddToCart}>
                    <FaShoppingBag className="fs-5" /> Add to Cart
                  </button>
                  <button className="bh-btn-buy" onClick={handleBuyNow}>
                    <FaBolt className="fs-5" /> Buy Now
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="bh-trust-badges">
                  <div className="bh-trust-item">
                    <FaTruck className="bh-trust-icon" />
                    <div>
                      <strong>Free Express Delivery</strong>
                      <p>Delivered in 3-5 Business Days</p>
                    </div>
                  </div>
                  <div className="bh-trust-item">
                    <FaShieldAlt className="bh-trust-icon" />
                    <div>
                      <strong>100% Authentic Product</strong>
                      <p>Dermatologist & Safety Approved</p>
                    </div>
                  </div>
                  <div className="bh-trust-item">
                    <FaUndo className="bh-trust-icon" />
                    <div>
                      <strong>Easy 7-Day Returns</strong>
                      <p>Hassle-free replacement policy</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* ── Specifications & Details Tabs ── */}
            <div className="bh-tabs-section">
              <div className="bh-tabs-header">
                <button
                  className={`bh-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  📋 Specifications &amp; Overview
                </button>
                <button
                  className={`bh-tab-btn ${activeTab === "care" ? "active" : ""}`}
                  onClick={() => setActiveTab("care")}
                >
                  🌿 Ingredients &amp; Usage
                </button>
                <button
                  className={`bh-tab-btn ${activeTab === "shipping" ? "active" : ""}`}
                  onClick={() => setActiveTab("shipping")}
                >
                  🚚 Shipping &amp; Warranty
                </button>
              </div>

              <div className="bh-tab-content">
                {activeTab === "overview" && (
                  <div className="bh-tab-pane">
                    <h3 className="bh-pane-title">Product Specifications</h3>
                    <table className="bh-spec-table">
                      <tbody>
                        <tr>
                          <th>Product Name</th>
                          <td>{product.productName}</td>
                        </tr>
                        <tr>
                          <th>Brand</th>
                          <td>{product?.brand?.brandName || "BeautyHub Luxury"}</td>
                        </tr>
                        {product?.skinType && (
                          <tr>
                            <th>Skin Type</th>
                            <td>{product.skinType}</td>
                          </tr>
                        )}
                        {product?.form && (
                          <tr>
                            <th>Form / Texture</th>
                            <td>{product.form}</td>
                          </tr>
                        )}
                        {product?.idealFor && (
                          <tr>
                            <th>Ideal For</th>
                            <td>{product.idealFor}</td>
                          </tr>
                        )}
                        {product?.weight && (
                          <tr>
                            <th>Net Weight / Volume</th>
                            <td>{product.weight}</td>
                          </tr>
                        )}
                        {product?.material && (
                          <tr>
                            <th>Material / Composition</th>
                            <td>{product.material}</td>
                          </tr>
                        )}
                        {product?.sku && (
                          <tr>
                            <th>SKU</th>
                            <td>{product.sku}</td>
                          </tr>
                        )}
                        {product?.shelfLife && (
                          <tr>
                            <th>Shelf Life</th>
                            <td>{product.shelfLife}</td>
                          </tr>
                        )}
                        {product?.countryOfOrigin && (
                          <tr>
                            <th>Country of Origin</th>
                            <td>{product.countryOfOrigin}</td>
                          </tr>
                        )}
                        {product?.seller && (
                          <tr>
                            <th>Seller / Marketer</th>
                            <td>{product.seller}</td>
                          </tr>
                        )}
                        {product?.manufacturerDetails && (
                          <tr>
                            <th>Manufacturer Details</th>
                            <td>{product.manufacturerDetails}</td>
                          </tr>
                        )}
                        {product?.dimensionsInch && (
                          <tr>
                            <th>Dimensions (Inches)</th>
                            <td>{product.dimensionsInch}</td>
                          </tr>
                        )}
                        {product?.dimensionsCm && (
                          <tr>
                            <th>Dimensions (cm)</th>
                            <td>{product.dimensionsCm}</td>
                          </tr>
                        )}
                        {product?.seoAttributes?.map((attr, idx) => (
                          <tr key={idx}>
                            <th>{attr.key}</th>
                            <td>{attr.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="bh-tab-pane">
                    <h3 className="bh-pane-title">Ingredients, Directions &amp; Safety</h3>
                    {product?.ingredients && (
                      <div className="mb-4">
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#e8607a" }}>🌿 Key Ingredients &amp; Composition</h4>
                        <p className="bh-pane-text">{product.ingredients}</p>
                      </div>
                    )}
                    {product?.howToUse && (
                      <div className="mb-4">
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#333" }}>👉 How to Use / Directions</h4>
                        <p className="bh-pane-text">{product.howToUse}</p>
                      </div>
                    )}
                    {product?.safetyInfo && (
                      <div className="mb-4">
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#d9534f" }}>⚠️ Safety Information &amp; Precautions</h4>
                        <p className="bh-pane-text">{product.safetyInfo}</p>
                      </div>
                    )}
                    {product?.CareMaintenance && (
                      <div className="mb-4">
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#5bc0de" }}>🧴 Storage &amp; Maintenance</h4>
                        <p className="bh-pane-text">{product.CareMaintenance}</p>
                      </div>
                    )}
                    {!product?.ingredients && !product?.howToUse && !product?.safetyInfo && !product?.CareMaintenance && (
                      <p className="bh-pane-text">
                        Store in a cool, dry place away from direct sunlight. Patch test before first application.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="bh-tab-pane">
                    <h3 className="bh-pane-title">Shipping &amp; Warranty Information</h3>
                    {product?.Warranty && (
                      <div className="mb-3">
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#4CAF50" }}>🛡️ Warranty &amp; Guarantee</h4>
                        <p className="bh-pane-text">{product.Warranty}</p>
                      </div>
                    )}
                    {product?.seller && (
                      <div className="mb-3">
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "600" }}>🏪 Sold &amp; Fulfilled By</h4>
                        <p className="bh-pane-text">{product.seller}</p>
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "600" }}>🚚 Delivery &amp; Returns Policy</h4>
                      <p className="bh-pane-text">
                        All BeautyHub orders are packed in eco-friendly tamper-proof luxury packaging and shipped via insured courier partners. Enjoy 100% Money-Back Guarantee if the product is damaged or defective upon delivery.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Help / Customer Support Banner ── */}
            <div className="bh-support-banner">
              <div className="bh-support-left">
                <IoSparkles className="bh-support-sparkle" />
                <div>
                  <h3>Need Help Finding the Perfect Choice?</h3>
                  <p>Our BeautyHub experts are available 24/7 to assist you with order selection and customization.</p>
                </div>
              </div>
              <div className="bh-support-right">
                <a href="tel:+919319846114" className="bh-support-btn">
                  <IoCallOutline /> Call +91 9319846114
                </a>
                <a href="https://wa.me/919319846114" target="_blank" rel="noreferrer" className="bh-support-btn outline">
                  <TbMessages /> Live WhatsApp Chat
                </a>
              </div>
            </div>

            {/* ── Related Products Carousel ── */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="bh-related-section">
                <div className="bh-related-header">
                  <h2>You May Also Love</h2>
                  <p>Discover complementary beauty items &amp; soft gifts from this collection.</p>
                </div>
                <Product products={relatedProducts} />
              </div>
            )}

          </div>
        </section>

      </div>
    </>
  );
}

// ─── Scoped CSS for BeautyHub Luxury Product Detail ───────────────────────────
const customCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .bh-detail-page {
    background-color: #faf7f9;
    min-height: 100vh;
    padding-bottom: 80px;
    font-family: 'DM Sans', sans-serif;
  }

  /* Breadcrumb */
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

  /* Detail Section */
  .bh-detail-section {
    padding: 40px 0;
  }

  .bh-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
  }

  /* Gallery Column */
  .bh-gallery-col {
    position: sticky;
    top: 90px;
  }

  .bh-main-img-card {
    position: relative;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid #fce4ec;
    box-shadow: 0 12px 36px rgba(194, 24, 91, 0.08);
  }

  .bh-gallery-badges {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .bh-badge-discount {
    background: #c2185b;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 5px 12px;
    border-radius: 14px;
  }

  .bh-badge-featured {
    background: #111827;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 10px;
  }

  .bh-gallery-actions {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 5;
    display: flex;
    gap: 8px;
  }

  .bh-icon-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border: 1px solid #fce4ec;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #555;
    cursor: pointer;
    transition: transform 0.25s, background 0.25s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .bh-icon-btn:hover {
    transform: scale(1.1);
    background: #fff;
  }

  .bh-heart-filled { color: #e91e8c; font-size: 1.2rem; }
  .bh-heart-outline { color: #666; font-size: 1.2rem; }

  .bh-main-img-wrap {
    position: relative;
    width: 100%;
    height: 480px;
    background: #fdf5f8;
  }

  .bh-main-img {
    object-fit: cover;
  }

  /* Thumbnails */
  .bh-thumbs-row {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .bh-thumb-btn {
    position: relative;
    width: 75px;
    height: 75px;
    border-radius: 14px;
    overflow: hidden;
    border: 2px solid #fce4ec;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.25s, transform 0.25s;
    padding: 0;
  }

  .bh-thumb-btn:hover, .bh-thumb-btn.active {
    border-color: #c2185b;
    transform: scale(1.05);
  }

  .bh-thumb-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  /* Info Column */
  .bh-info-col {
    display: flex;
    flex-direction: column;
  }

  .bh-info-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .bh-subcat-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #c2185b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .bh-brand-chip {
    font-size: 0.78rem;
    font-weight: 700;
    background: #fce4ec;
    color: #c2185b;
    padding: 4px 12px;
    border-radius: 12px;
  }

  .bh-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 12px;
    line-height: 1.25;
  }

  /* Rating Row */
  .bh-rating-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .bh-stars { color: #f59e0b; font-size: 0.9rem; display: flex; gap: 2px; }

  .bh-rating-score { font-weight: 800; color: #1a1a1a; font-size: 0.9rem; }

  .bh-rating-count { font-size: 0.85rem; color: #777; }

  .bh-stock-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 12px;
    margin-left: auto;
  }

  .bh-stock-badge.in-stock {
    background: #d1fae5;
    color: #065f46;
  }

  /* Pricing Box */
  .bh-price-box {
    background: #ffffff;
    border: 1px solid #fce4ec;
    padding: 20px;
    border-radius: 18px;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(194, 24, 91, 0.04);
  }

  .bh-price-main {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 6px;
  }

  .bh-final-price {
    font-family: 'DM Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #c2185b;
  }

  .bh-original-price {
    font-size: 1.1rem;
    color: #aaa;
    text-decoration: line-through;
  }

  .bh-save-pill {
    background: #c2185b;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 12px;
  }

  .bh-tax-note {
    font-size: 0.8rem;
    color: #777;
    margin: 0;
  }

  /* Short Desc */
  .bh-short-desc {
    font-size: 0.95rem;
    color: #4b5563;
    line-height: 1.65;
    margin-bottom: 24px;
  }

  /* Highlights Box */
  .bh-highlights-box {
    background: #fff8fb;
    border: 1px solid #f4c2d7;
    padding: 18px;
    border-radius: 16px;
    margin-bottom: 24px;
  }

  .bh-highlights-box h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #c2185b;
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .bh-highlights-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .bh-highlight-item {
    background: #fff;
    border: 1px solid #fce4ec;
    color: #374151;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 12px;
  }

  /* Quantity Controls */
  .bh-qty-box {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .bh-qty-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #374151;
  }

  .bh-qty-counter {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1.5px solid #e2cad6;
    border-radius: 25px;
    overflow: hidden;
  }

  .bh-qty-btn {
    background: none;
    border: none;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c2185b;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.2s;
  }

  .bh-qty-btn:hover { background: #fce4ec; }

  .bh-qty-val {
    width: 40px;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 800;
    color: #1f2937;
  }

  /* Primary Action Buttons */
  .bh-action-buttons {
    display: flex;
    gap: 14px;
    margin-bottom: 28px;
  }

  .bh-btn-cart {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, #e91e8c, #c2185b);
    color: #ffffff;
    border: none;
    padding: 14px 20px;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(194, 24, 91, 0.25);
    transition: transform 0.2s, opacity 0.2s;
  }

  .bh-btn-cart:hover {
    transform: translateY(-2px);
    opacity: 0.95;
  }

  .bh-btn-buy {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #111827;
    color: #ffffff;
    border: none;
    padding: 14px 20px;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(17, 24, 39, 0.2);
    transition: transform 0.2s, background 0.2s;
  }

  .bh-btn-buy:hover {
    background: #1f2937;
    transform: translateY(-2px);
  }

  /* Trust Badges */
  .bh-trust-badges {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    background: #fff;
    border: 1px solid #fce4ec;
    padding: 18px;
    border-radius: 18px;
  }

  .bh-trust-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .bh-trust-icon {
    font-size: 1.4rem;
    color: #c2185b;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .bh-trust-item strong {
    display: block;
    font-size: 0.8rem;
    font-weight: 700;
    color: #1f2937;
  }

  .bh-trust-item p {
    font-size: 0.72rem;
    color: #777;
    margin: 0;
  }

  /* Tabs Section */
  .bh-tabs-section {
    margin-top: 50px;
    background: #fff;
    border-radius: 20px;
    border: 1px solid #fce4ec;
    overflow: hidden;
    box-shadow: 0 6px 24px rgba(194, 24, 91, 0.04);
  }

  .bh-tabs-header {
    display: flex;
    background: #fff8fb;
    border-bottom: 1px solid #fce4ec;
    overflow-x: auto;
  }

  .bh-tab-btn {
    padding: 16px 24px;
    background: none;
    border: none;
    font-size: 0.9rem;
    font-weight: 700;
    color: #666;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    transition: color 0.2s, border-color 0.2s;
  }

  .bh-tab-btn:hover, .bh-tab-btn.active {
    color: #c2185b;
    border-bottom-color: #c2185b;
    background: #fff;
  }

  .bh-tab-content {
    padding: 28px;
  }

  .bh-pane-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 16px;
  }

  .bh-spec-table {
    width: 100%;
    border-collapse: collapse;
  }

  .bh-spec-table th, .bh-spec-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #fce4ec;
    font-size: 0.9rem;
  }

  .bh-spec-table th {
    width: 35%;
    background: #fff8fb;
    color: #555;
    font-weight: 700;
  }

  .bh-spec-table td {
    color: #222;
  }

  .bh-pane-text {
    font-size: 0.95rem;
    color: #4b5563;
    line-height: 1.7;
    margin: 0;
  }

  /* Support Banner */
  .bh-support-banner {
    margin-top: 40px;
    background: linear-gradient(135deg, #2b0818 0%, #4a0e2e 100%);
    color: #fff;
    padding: 32px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  .bh-support-left {
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 600px;
  }

  .bh-support-sparkle {
    font-size: 2.5rem;
    color: #fce4ec;
    flex-shrink: 0;
  }

  .bh-support-left h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    margin: 0 0 4px;
  }

  .bh-support-left p {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
  }

  .bh-support-right {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .bh-support-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #c2185b;
    color: #fff;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 0.88rem;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s;
  }

  .bh-support-btn.outline {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .bh-support-btn:hover { background: #e91e8c; color: #fff; }

  /* Related Products Section */
  .bh-related-section {
    margin-top: 50px;
  }

  .bh-related-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .bh-related-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 6px;
  }

  .bh-related-header p {
    color: #777;
    font-size: 0.95rem;
  }

  /* Media Queries */
  @media (max-width: 992px) {
    .bh-detail-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .bh-gallery-col { position: relative; top: 0; }
    .bh-main-img-wrap { height: 380px; }
    .bh-trust-badges { grid-template-columns: 1fr; }
  }

  @media (max-width: 576px) {
    .bh-title { font-size: 1.8rem; }
    .bh-final-price { font-size: 1.6rem; }
    .bh-action-buttons { flex-direction: column; }
    .bh-support-banner { padding: 20px; }
  }
`;