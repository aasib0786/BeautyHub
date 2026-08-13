"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaHeart, FaRegHeart, FaStar, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { fetchFeaturedProducts } from "@/app/redux/slice/productSlice";
import { generateSlug } from "@/app/utils/generate-slug";
import {
  addToWishlist,
  addToWishlistToLocal,
  removeFromWishlistToLocal,
  removeFromWishlistToServer,
} from "@/app/redux/slice/wislistSlice";
import { addToCart, AddToCartToServer } from "@/app/redux/slice/cartSlice";
import { axiosInstance } from "@/app/utils/axiosInstance";
import "./productSlider.css";

export default function ProductSlider() {
  const sliderRef = useRef(null);
  const dispatch  = useDispatch();

  const { featuredProducts, loading } = useSelector((state) => state.product);
  const { wishlist }                  = useSelector((state) => state.wishlist);
  const { user }                      = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const slideLeft = () => {
    if (sliderRef.current) sliderRef.current.scrollLeft -= 330;
  };

  const slideRight = () => {
    if (sliderRef.current) sliderRef.current.scrollLeft += 330;
  };

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

  return (
    <section className="product-slider-section container py-5">
      <div className="slider-header text-center mb-4">
        <h2 className="fw-bold">Top Featured Beauty &amp; Gift Collections</h2>
        <p className="text-muted">Handpicked bestsellers &amp; luxury gift items</p>
      </div>

      <div className="slider-wrapper" style={{ position: "relative" }}>
        {/* Left Arrow */}
        <button
          className="arrow-btn left"
          onClick={slideLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Cards Wrapper */}
        <div className="product-slider" ref={sliderRef}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div className="product-card card skeleton-card" key={i}>
                <div className="skeleton skeleton-img" />
                <div className="card-body">
                  <div className="skeleton skeleton-text w-80" />
                  <div className="skeleton skeleton-text w-60" />
                  <div className="skeleton skeleton-btn" />
                </div>
              </div>
            ))
          ) : featuredProducts?.length > 0 ? (
            featuredProducts.map((item, index) => {
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
                <div className="bh-card" key={item._id ?? index} style={{ minWidth: "260px" }}>

                  {/* Badges */}
                  <div className="bh-card-badges">
                    {discountPercentage > 0 && (
                      <span className="bh-badge-discount">{discountPercentage}% OFF</span>
                    )}
                    <span className="bh-badge-featured">Featured</span>
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
                      width={300}
                      height={200}
                      className="bh-card-img"
                    />
                  </Link>

                  {/* Info */}
                  <div className="bh-card-info">
                    <span className="bh-card-category">
                      {item?.subCategory?.subCategoryName || "Beauty Collection"}
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
                      <span className="bh-rating-text">4.9</span>
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
                        Details
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <p className="no-products">No featured products available.</p>
          )}
        </div>

        {/* Right Arrow */}
        <button
          className="arrow-btn right"
          onClick={slideRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <style jsx>{`
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
        }

        .bh-badge-featured {
          background: #111827;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 10px;
        }

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
          transition: transform 0.25s;
        }

        .bh-wishlist-btn:hover { transform: scale(1.12); background: #fff; }
        .bh-heart-outline { color: #888; font-size: 1.1rem; }
        .bh-heart-filled { color: #e91e8c; font-size: 1.1rem; }

        .bh-card-img-wrap {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #fdf5f8;
          display: block;
        }

        .bh-card-img { object-fit: cover; width: 100%; height: 100%; transition: transform 0.5s ease !important; }
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
      `}</style>
    </section>
  );
}