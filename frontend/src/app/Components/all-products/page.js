"use client";
import React, { useEffect, useState } from "react";
import "./allproduct.css";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaFilter } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaterials, fetchProducts } from "@/app/redux/slice/productSlice";
import {
  addToWishlist,
  addToWishlistToLocal,
  addToWishlistToServer,
  getWishlistFromServer,
  loadWishlistFromLocalStorage,
  removeFromWishlistToLocal,
  removeFromWishlistToServer,
} from "@/app/redux/slice/wislistSlice";
import { addToCart, addToCartToServer } from "@/app/redux/slice/cartSlice";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { fetchCategories } from "@/app/redux/slice/categorySllice";
import { generateSlug } from "@/app/utils/generate-slug";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const categories = useSelector((state) => state.category.categories);
  const materials = useSelector((state) => state.product.materials);

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    if (sortValue) {
      router.push(`/Pages/products/search?sortBy=${sortValue}`);
    }
  };

  const handlePriceChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    const [priceMin, priceMax] = val.split("-");
    router.push(`/Pages/products/search?priceMin=${priceMin}&priceMax=${priceMax}`);
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    if (catId) {
      router.push(`/Pages/products/search?category=${catId}`);
    }
  };

  const handleMaterialChange = (e) => {
    const mat = e.target.value;
    if (mat) {
      router.push(`/Pages/products/search?material=${mat}`);
    }
  };

  const handleDiscountChange = (e) => {
    const disc = e.target.value;
    if (disc) {
      router.push(`/Pages/products/search?discountMin=${disc}`);
    }
  };

  const handleWishlist = async (productId, product) => {
    const exist = wishlist?.products?.some(
      (item) => item._id.trim() === productId.trim()
    );

    if (exist) {
      if (user && user?.email) {
        dispatch(removeFromWishlistToServer(productId));
      } else {
        dispatch(removeFromWishlistToLocal(productId));
      }
    } else {
      if (user && user?.email) {
        try {
          const response = await axiosInstance.post(
            "/api/v1/wishlist/add-to-wishlist",
            { productId }
          );
          if (response.status === 201) {
            dispatch(addToWishlist(product));
          }
        } catch (error) {
          console.log("Error adding to wishlist:", error);
          toast.error("Failed to add to wishlist.");
        }
      } else {
        dispatch(addToWishlistToLocal(product));
      }
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const cartPayload = {
      productId: product._id,
      productName: product.productName,
      price: product.finalPrice || product.price,
      image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "",
      quantity: 1,
    };

    if (user && user?._id) {
      dispatch(addToCartToServer(cartPayload));
    } else {
      dispatch(addToCart(cartPayload));
      try {
        const current = JSON.parse(localStorage.getItem("cart") || "[]");
        const idx = current.findIndex((c) => c.productId === product._id);
        if (idx > -1) {
          current[idx].quantity += 1;
        } else {
          current.push(cartPayload);
        }
        localStorage.setItem("cart", JSON.stringify(current));
      } catch (err) {
        console.error("Local cart error:", err);
      }
    }
    toast.success(`Added "${product.productName}" to cart! 🛒`);
  };

  const priceRanges = [
    { label: "Under ₹500", priceMin: 0, priceMax: 500 },
    { label: "₹500 - ₹1,000", priceMin: 500, priceMax: 1000 },
    { label: "₹1,000 - ₹2,000", priceMin: 1000, priceMax: 2000 },
    { label: "₹2,000 - ₹10,000", priceMin: 2000, priceMax: 10000 },
    { label: "Above ₹10,000", priceMin: 10000, priceMax: 300000 },
  ];

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchMaterials());
    if (user && user?.email) {
      dispatch(getWishlistFromServer());
    } else {
      dispatch(loadWishlistFromLocalStorage());
    }
  }, [dispatch, user]);

  return (
    <>
      {/* ── Product Filter Bar ── */}
      <section className="product-filter py-3">
        <div className="container">
          <div className="bh-filter-bar-grid">
            
            {/* Filter Title Label */}
            <div className="filter-title-label fw-bold text-white d-flex align-items-center gap-1">
              <FaFilter style={{ color: "#f3c623" }} /> Filter By:
            </div>

            {/* Filter Select Controls (100% Reliable Dropdowns) */}
            <div className="filter-selects-container">
              {/* Price Select */}
              <select className="filter-pill-select" onChange={handlePriceChange} defaultValue="">
                <option value="" disabled hidden>Price ▾</option>
                <option value="0-300000">All Prices</option>
                {priceRanges.map((pr, i) => (
                  <option key={i} value={`${pr.priceMin}-${pr.priceMax}`}>
                    {pr.label}
                  </option>
                ))}
              </select>

              {/* Category Select */}
              <select className="filter-pill-select" onChange={handleCategoryChange} defaultValue="">
                <option value="" disabled hidden>Category ▾</option>
                <option value="">All Categories</option>
                {categories?.slice(0, 15)?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>

              {/* Material Select */}
              <select className="filter-pill-select" onChange={handleMaterialChange} defaultValue="">
                <option value="" disabled hidden>Material ▾</option>
                <option value="">All Materials</option>
                {materials?.slice(0, 15)?.map((mat, i) => (
                  <option key={i} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>

              {/* Discount Select */}
              <select className="filter-pill-select" onChange={handleDiscountChange} defaultValue="">
                <option value="" disabled hidden>Discount ▾</option>
                <option value="0">All Discounts</option>
                <option value="10">10% or more</option>
                <option value="30">30% or more</option>
                <option value="50">50% or more</option>
              </select>

              {/* Sort By Select */}
              <select className="filter-pill-select sort-select" onChange={handleSortChange} defaultValue="lowToHigh">
                <option value="lowToHigh">Sort: Low to High ▾</option>
                <option value="highToLow">Sort: High to Low ▾</option>
                <option value="new">Sort: Newest First ▾</option>
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* ── Product List Grid ── */}
      <section className="product-list py-4">
        <div className="product-list-header text-center mb-4">
          <span className="badge bg-light text-primary text-uppercase fw-bold tracking-wide px-3 py-2 mb-2" style={{ letterSpacing: "2px", border: "1px solid #d0e1f9" }}>
            Boutique Collection
          </span>
          <h2 className="fw-bold mb-1" style={{ color: "#153964" }}>All Store Products</h2>
          <p className="text-muted small">Explore our wide range of authentic products &amp; luxury decor</p>
        </div>

        <div className="container">
          <div className="row g-3 g-md-4">
            {products?.map((item, index) => {
              const finalPrice = item.finalPrice || item.price || 0;
              const originalPrice = item.originalPrice || item.price || finalPrice;
              const hasDiscount = originalPrice > finalPrice;
              const discountPercent = hasDiscount
                ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
                : 0;

              const isWishlisted = wishlist?.products?.some((p) => String(p._id) === String(item._id));

              return (
                <div className="col-lg-3 col-md-4 col-6" key={item._id || index}>
                  <div className="product-card">
                    
                    {/* Image Container */}
                    <div className="product-img-wrapper">
                      <Link
                        href={`/Pages/products/${generateSlug(item?.productName, item?._id)}`}
                        className="product-link"
                      >
                        <img
                          className="product-image"
                          src={Array.isArray(item?.images) && item.images.length > 0 ? item.images[0] : "/icon1.jpg"}
                          alt={item.productName || "Product"}
                          onError={(e) => { e.target.src = "/icon1.jpg"; }}
                        />
                      </Link>

                      {/* Discount Badge */}
                      {hasDiscount && discountPercent > 0 && (
                        <span className="product-discount-badge">
                          {discountPercent}% OFF
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        className="wishlist-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleWishlist(item?._id, item);
                        }}
                        aria-label="Add to Wishlist"
                      >
                        {isWishlisted ? (
                          <FaHeart style={{ color: "#e8607a" }} />
                        ) : (
                          <FaRegHeart style={{ color: "#666" }} />
                        )}
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="product-details">
                      <h3 className="product-title" title={item.productName}>
                        {item.productName}
                      </h3>
                      
                      <div className="product-price-section">
                        <span className="final-price">₹{finalPrice}</span>
                        {hasDiscount && (
                          <span className="original-price">
                            <del>₹{originalPrice}</del>
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        className="btn btn-sm add-cart-btn w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={(e) => handleAddToCart(item, e)}
                      >
                        <FaShoppingCart style={{ fontSize: "0.85rem" }} />
                        <span>Add to Cart</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
