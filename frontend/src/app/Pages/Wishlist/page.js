"use client";
import React, { useEffect } from "react";
import "./wishlist.css";
import {
  FaTrashAlt,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaEnvelope,
  FaWhatsapp,
  FaShoppingBag,
  FaShareAlt,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";
import { IoSparkles, IoChevronForward } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  getWishlistFromServer,
  loadWishlistFromLocalStorage,
  removeFromWishlistToLocal,
  removeFromWishlistToServer,
} from "@/app/redux/slice/wislistSlice";
import { addToCart, AddToCartToServer } from "@/app/redux/slice/cartSlice";
import { generateSlug } from "@/app/utils/generate-slug";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user?.email) {
      dispatch(getWishlistFromServer());
    } else {
      dispatch(loadWishlistFromLocalStorage());
    }
  }, [dispatch, user]);

  const handleRemoveFromWishlist = (productId) => {
    if (user && user?.email) {
      dispatch(removeFromWishlistToServer(productId));
    } else {
      dispatch(removeFromWishlistToLocal(productId));
    }
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    if (user && user?.email) {
      dispatch(AddToCartToServer({ productId: product._id, quantity: 1 }));
    } else {
      dispatch(addToCart(product));
    }
    toast.success(`${product.productName || "Item"} added to cart!`);
  };

  const handleAddAllToCart = () => {
    if (!wishlist?.products || wishlist.products.length === 0) return;
    wishlist.products.forEach((product) => {
      if (user && user?.email) {
        dispatch(AddToCartToServer({ productId: product._id, quantity: 1 }));
      } else {
        dispatch(addToCart(product));
      }
    });
    toast.success("All saved items added to your cart!");
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My BeautyHub Wishlist",
          text: "Check out my saved beauty products on BeautyHub!",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard!");
    }
  };

  const savedProducts = wishlist?.products || [];

  return (
    <div className="bh-wishlist-page">
      {/* ── Breadcrumb ── */}
      <nav className="bh-breadcrumb-nav" aria-label="breadcrumb">
        <div className="container">
          <ol className="bh-breadcrumb">
            <li className="bh-breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="bh-breadcrumb-sep"><IoChevronForward /></li>
            <li className="bh-breadcrumb-item bh-breadcrumb-active">
              My Wishlist
            </li>
          </ol>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <section className="bh-wishlist-hero">
        <div className="container">
          <div className="bh-hero-inner">
            <span className="bh-chip">
              <IoSparkles /> MY SAVED TREASURES
            </span>
            <h1 className="bh-hero-title">My Saved Wishlist</h1>
            <p className="bh-hero-desc">
              Keep track of your favorite beauty essentials, luxury skincare, and gift sets.
              Easily move items to cart or share your saved items.
            </p>

            <div className="bh-hero-pills mt-3 d-flex flex-wrap gap-2">
              <span className="bh-hero-badge">❤️ {savedProducts.length} Saved Items</span>
              <span className="bh-hero-badge">🚚 Fast Doorstep Delivery</span>
              <span className="bh-hero-badge">🔒 100% Authentic Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Actions Bar ── */}
      {savedProducts.length > 0 && (
        <section className="bh-wishlist-actions-bar sticky-top">
          <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5 className="mb-0 fw-bold text-dark">
                Saved Items ({savedProducts.length})
              </h5>
              <small className="text-muted">Manage your saved products</small>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <button className="bh-btn-gradient" onClick={handleAddAllToCart}>
                <FaShoppingBag /> Add All to Cart
              </button>
              <button className="bh-btn-outline-danger" onClick={handleShareWishlist}>
                <FaShareAlt /> Share List
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Main Content Container ── */}
      <div className="container py-4">
        {savedProducts.length === 0 ? (
          /* Empty State */
          <div className="bh-empty-box">
            <div className="mb-3 text-danger" style={{ fontSize: "3.5rem" }}>
              <FaHeart />
            </div>
            <h3 className="fw-bold mb-2">Your Wishlist is Empty</h3>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: "460px" }}>
              Explore our boutique collection of luxury skincare, cosmetics, and plush teddies to save your favorite items.
            </p>
            <Link href="/Pages/products/search" className="bh-btn-gradient text-decoration-none px-4 py-2">
              Explore Products <FaArrowRight style={{ fontSize: "0.75rem" }} />
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="d-none d-md-block">
              <div className="bh-wishlist-table-card">
                <table className="table bh-table align-middle">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th className="text-center">Action</th>
                      <th className="text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedProducts.map((item) => {
                      const slug = generateSlug(item?.productName, item?._id);
                      return (
                        <tr key={item._id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <Link href={`/Pages/products/${slug}`}>
                                <Image
                                  src={item?.images?.[0] || "/images/placeholder.png"}
                                  width={70}
                                  height={70}
                                  alt={item?.productName || "Product"}
                                  className="bh-product-thumb"
                                />
                              </Link>
                              <div>
                                <Link href={`/Pages/products/${slug}`} className="bh-table-product-title">
                                  {item?.productName}
                                </Link>
                                {item?.brand && (
                                  <div className="text-muted small mt-1">{item.brand}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-baseline gap-2">
                              <span className="fw-bold text-dark fs-6">
                                ₹{item?.finalPrice ?? item?.price}
                              </span>
                              {item?.price && item?.price > (item?.finalPrice ?? item?.price) && (
                                <del className="text-muted small">₹{item.price}</del>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${item?.stock > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} px-3 py-2 rounded-pill`}>
                              {item?.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="bh-btn-gradient"
                              onClick={() => handleAddToCart(item)}
                            >
                              <FaShoppingBag style={{ fontSize: "0.8rem" }} /> Add to Cart
                            </button>
                          </td>
                          <td className="text-center">
                            <button
                              className="bh-trash-btn"
                              onClick={() => handleRemoveFromWishlist(item?._id)}
                              title="Remove from Wishlist"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card Grid View */}
            <div className="d-md-none">
              <div className="row g-3">
                {savedProducts.map((item) => {
                  const slug = generateSlug(item?.productName, item?._id);
                  return (
                    <div className="col-6" key={item._id}>
                      <div className="bh-mobile-wish-card">
                        {/* Remove trash button */}
                        <div className="bh-mobile-trash-pos">
                          <button
                            className="bh-trash-btn"
                            onClick={() => handleRemoveFromWishlist(item?._id)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>

                        {/* Image wrap */}
                        <Link href={`/Pages/products/${slug}`} className="bh-mobile-img-wrap">
                          <Image
                            src={item?.images?.[0] || "/images/placeholder.png"}
                            alt={item?.productName || "Product"}
                            fill
                            sizes="50vw"
                            style={{ objectFit: "cover" }}
                          />
                        </Link>

                        {/* Details */}
                        <div className="bh-mobile-card-body">
                          <Link href={`/Pages/products/${slug}`} className="bh-table-product-title d-block mb-1" style={{ fontSize: "0.88rem" }}>
                            {item?.productName}
                          </Link>

                          <div className="d-flex align-items-baseline gap-1 mb-2">
                            <span className="fw-bold text-dark" style={{ fontSize: "0.92rem" }}>
                              ₹{item?.finalPrice ?? item?.price}
                            </span>
                            {item?.price && item?.price > (item?.finalPrice ?? item?.price) && (
                              <del className="text-muted" style={{ fontSize: "0.75rem" }}>₹{item.price}</del>
                            )}
                          </div>

                          <div className="mt-auto">
                            <button
                              className="bh-btn-gradient w-100 justify-content-center py-2"
                              style={{ fontSize: "0.78rem" }}
                              onClick={() => handleAddToCart(item)}
                            >
                              <FaShoppingBag /> Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Share & Social Footer Card */}
            <div className="bh-share-card mt-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold text-dark">Share your wishlist:</span>
                <div className="d-flex gap-2">
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out my wishlist on BeautyHub!")}`} target="_blank" rel="noopener noreferrer" className="bh-social-chip">
                    <FaWhatsapp />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bh-social-chip">
                    <FaFacebookF />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bh-social-chip">
                    <FaTwitter />
                  </a>
                  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="bh-social-chip">
                    <FaPinterestP />
                  </a>
                  <button onClick={handleShareWishlist} className="bh-social-chip border-0">
                    <FaEnvelope />
                  </button>
                </div>
              </div>

              <div>
                <button className="bh-btn-gradient" onClick={handleAddAllToCart}>
                  <FaShoppingBag /> Move All to Cart ({savedProducts.length})
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
