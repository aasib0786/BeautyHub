"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  decreaseQuantity,
  fetchCartItems,
  increaseQuantity,
  removeFromCart,
  safeJSONParse,
  setCartFromLocalStorage,
  updateQuantity,
} from "@/app/redux/slice/cartSlice";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { generateSlug } from "@/app/utils/generate-slug";

import { FaShoppingBag, FaTrash, FaPlus, FaMinus, FaArrowRight, FaShieldAlt, FaTruck } from "react-icons/fa";
import { IoChevronForward, IoSparkles } from "react-icons/io5";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items = [], loading: cartLoading } = useSelector((state) => state.cart);
  const { user, loading: authLoading }      = useSelector((state) => state.auth);

  // Initial Cart Loading
  useEffect(() => {
    if (authLoading) return;

    if (user && user?.email) {
      dispatch(fetchCartItems());
    } else {
      if (typeof window !== "undefined") {
        const cartData = localStorage.getItem("cart");
        const parsedCart = safeJSONParse(cartData);
        if (parsedCart && Array.isArray(parsedCart)) {
          dispatch(setCartFromLocalStorage(parsedCart));
        }
      }
    }
  }, [authLoading, user, dispatch]);

  // Handle Decrease
  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    const pId = item?.productId?._id || item?.productId;

    if (user && user?.email) {
      try {
        await dispatch(updateQuantity({ productId: pId, action: "decrease" }));
      } catch (error) {
        toast.error("Failed to update quantity");
      }
    } else {
      dispatch(decreaseQuantity({ productId: pId }));
    }
  };

  // Handle Increase
  const handleIncrease = async (item) => {
    const pId = item?.productId?._id || item?.productId;
    const maxStock = item?.productId?.stock || item?.stock || 10;

    if (item.quantity >= maxStock) {
      toast.error(`Only ${maxStock} items available in stock.`);
      return;
    }

    if (user && user?.email) {
      try {
        await dispatch(updateQuantity({ productId: pId, action: "increase" }));
      } catch (error) {
        toast.error("Failed to update quantity");
      }
    } else {
      dispatch(increaseQuantity({ productId: pId }));
    }
  };

  // Handle Remove
  const handleRemove = async (item) => {
    const pId = item?.productId?._id || item?.productId;

    if (user && user?.email) {
      try {
        await axiosInstance.post("/api/v1/cart/remove-from-cart", { productId: pId });
        dispatch(removeFromCart({ productId: pId }));
        toast.success("Item removed from cart");
      } catch (error) {
        toast.error("Failed to remove item");
      }
    } else {
      dispatch(removeFromCart({ productId: pId }));
      toast.success("Item removed from cart");
    }
  };

  // Safe Total Calculations (useMemo)
  const { grossMrp, netTotal, discountAmount, shippingCharge, finalPayable } = useMemo(() => {
    let mrp = 0;
    let total = 0;

    (items || []).forEach((item) => {
      const qty = item.quantity || 1;
      const productObj = typeof item.productId === "object" ? item.productId : null;

      const unitFinalPrice =
        item.finalPrice ??
        item.mattressFinalPrice ??
        productObj?.finalPrice ??
        productObj?.price ??
        item.price ??
        0;

      const unitPrice =
        item.price ??
        item.mattressPrice ??
        productObj?.price ??
        unitFinalPrice;

      mrp += unitPrice * qty;
      total += unitFinalPrice * qty;
    });

    const disc = Math.max(0, mrp - total);
    const shipping = total >= 499 || total === 0 ? 0 : 50;
    const payable = total + shipping;

    return {
      grossMrp: mrp,
      netTotal: total,
      discountAmount: disc,
      shippingCharge: shipping,
      finalPayable: payable,
    };
  }, [items]);

  return (
    <>
      <style>{customCSS}</style>

      <div className="bh-cart-page">

        {/* Breadcrumb Navigation */}
        <nav className="bh-breadcrumb-nav" aria-label="breadcrumb">
          <div className="container">
            <ol className="bh-breadcrumb">
              <li className="bh-breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="bh-breadcrumb-sep"><IoChevronForward /></li>
              <li className="bh-breadcrumb-item bh-breadcrumb-active">
                Shopping Cart
              </li>
            </ol>
          </div>
        </nav>

        <div className="container py-4">

          {/* Empty Cart View */}
          {(!items || items.length === 0) ? (
            <div className="bh-empty-cart">
              <div className="bh-empty-icon">🛍️</div>
              <h2>Your Shopping Cart is Empty</h2>
              <p>Explore our organic skincare, luxury cosmetics, giant soft plush teddies & celebration hampers.</p>
              <Link href="/Pages/products" className="bh-btn-explore">
                <FaShoppingBag /> Discover Products
              </Link>
            </div>
          ) : (
            <div className="bh-cart-grid">

              {/* Left Column: Cart Items List */}
              <div className="bh-items-col">
                <div className="bh-cart-header">
                  <h2>Shopping Cart ({items.length} {items.length === 1 ? "Item" : "Items"})</h2>
                  <span className="bh-badge-chip">
                    <IoSparkles /> 100% Authentic Guarantee
                  </span>
                </div>

                <div className="bh-items-list">
                  {items.map((item, index) => {
                    const productObj = typeof item.productId === "object" ? item.productId : null;
                    const pName = item.name || productObj?.productName || "BeautyHub Product";
                    const pImage = item.image || productObj?.images?.[0] || "/images/placeholder.png";
                    const pId = productObj?._id || item.productId;

                    const unitFinalPrice =
                      item.finalPrice ??
                      item.mattressFinalPrice ??
                      productObj?.finalPrice ??
                      productObj?.price ??
                      0;

                    const unitPrice =
                      item.price ??
                      item.mattressPrice ??
                      productObj?.price ??
                      unitFinalPrice;

                    const itemDiscount =
                      item.discount ??
                      productObj?.discount ??
                      (unitPrice > unitFinalPrice
                        ? Math.round(((unitPrice - unitFinalPrice) / unitPrice) * 100)
                        : 0);

                    return (
                      <div key={index} className="bh-cart-item-card">

                        {/* Image */}
                        <Link href={`/Pages/products/${generateSlug(pName, pId)}`} className="bh-item-img-wrap">
                          <Image
                            src={pImage}
                            alt={pName}
                            fill
                            sizes="120px"
                            className="bh-item-img"
                          />
                        </Link>

                        {/* Info Block */}
                        <div className="bh-item-info">
                          <Link href={`/Pages/products/${generateSlug(pName, pId)}`} className="bh-item-title-link">
                            <h3 className="bh-item-title">{pName}</h3>
                          </Link>
                          <span className="bh-item-category">
                            {productObj?.category?.categoryName || productObj?.subCategory?.subCategoryName || "Beauty & Gifts"}
                          </span>

                          {/* Price & Discount Row */}
                          <div className="bh-item-price-row">
                            <span className="bh-item-final-price">
                              ₹{(unitFinalPrice * item.quantity).toLocaleString("en-IN")}
                            </span>
                            {unitPrice > unitFinalPrice && (
                              <span className="bh-item-original-price">
                                ₹{(unitPrice * item.quantity).toLocaleString("en-IN")}
                              </span>
                            )}
                            {itemDiscount > 0 && (
                              <span className="bh-item-discount-tag">
                                {itemDiscount}% OFF
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls & Remove */}
                          <div className="bh-item-controls">
                            <div className="bh-qty-wrap">
                              <span className="bh-qty-label">Qty:</span>
                              <div className="bh-qty-btn-group">
                                <button
                                  className="bh-qty-btn"
                                  onClick={() => handleDecrease(item)}
                                  disabled={item.quantity <= 1}
                                >
                                  <FaMinus />
                                </button>
                                <span className="bh-qty-val">{item.quantity}</span>
                                <button
                                  className="bh-qty-btn"
                                  onClick={() => handleIncrease(item)}
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>

                            <button
                              className="bh-remove-btn"
                              onClick={() => handleRemove(item)}
                            >
                              <FaTrash /> Remove
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="bh-summary-col">
                <div className="bh-summary-card">
                  <h3 className="bh-summary-title">Order Summary</h3>

                  <div className="bh-summary-row">
                    <span>Total MRP</span>
                    <span>₹{grossMrp.toLocaleString("en-IN")}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="bh-summary-row bh-discount-row">
                      <span>Bag Savings</span>
                      <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="bh-summary-row">
                    <span>Delivery Charge</span>
                    <span className={shippingCharge === 0 ? "bh-free-text" : ""}>
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>

                  <hr className="bh-divider" />

                  <div className="bh-summary-row bh-total-row">
                    <span>Total Payable</span>
                    <span className="bh-total-price">₹{finalPayable.toLocaleString("en-IN")}</span>
                  </div>

                  <p className="bh-summary-note">Inclusive of all applicable taxes.</p>

                  {discountAmount > 0 && (
                    <div className="bh-savings-banner">
                      🎉 Congratulations! You saved <strong>₹{discountAmount.toLocaleString("en-IN")}</strong> on this order.
                    </div>
                  )}

                  <Link href="/Pages/Checkout" className="bh-checkout-btn">
                    Proceed to Checkout <FaArrowRight style={{ fontSize: "0.85rem" }} />
                  </Link>

                  <div className="bh-trust-footer">
                    <span><FaShieldAlt /> 100% Secure Checkout</span>
                    <span><FaTruck /> Fast Doorstep Delivery</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}

// ─── Scoped CSS ───────────────────────────────────────────────────────────────
const customCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .bh-cart-page {
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

  /* Empty Cart */
  .bh-empty-cart {
    text-align: center;
    padding: 80px 20px;
    background: #fff;
    border-radius: 24px;
    border: 1px border-dashed #fce4ec;
    box-shadow: 0 6px 24px rgba(194, 24, 91, 0.04);
    max-width: 600px;
    margin: 40px auto;
  }

  .bh-empty-icon { font-size: 4rem; margin-bottom: 16px; }

  .bh-empty-cart h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .bh-empty-cart p {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 24px;
  }

  .bh-btn-explore {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #c2185b;
    color: #fff;
    padding: 12px 28px;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.25s, transform 0.2s;
  }

  .bh-btn-explore:hover { background: #e91e8c; color: #fff; transform: translateY(-2px); }

  /* Cart Layout Grid */
  .bh-cart-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
    align-items: start;
  }

  /* Items Column */
  .bh-cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .bh-cart-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .bh-badge-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #fce4ec;
    color: #c2185b;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 12px;
  }

  .bh-items-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bh-cart-item-card {
    background: #ffffff;
    border-radius: 18px;
    border: 1px solid #fce4ec;
    padding: 16px;
    display: flex;
    gap: 18px;
    box-shadow: 0 4px 16px rgba(194, 24, 91, 0.03);
    transition: box-shadow 0.25s;
  }

  .bh-cart-item-card:hover {
    box-shadow: 0 8px 24px rgba(194, 24, 91, 0.08);
  }

  .bh-item-img-wrap {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 14px;
    overflow: hidden;
    background: #fdf5f8;
    flex-shrink: 0;
  }

  .bh-item-img { object-fit: cover; }

  .bh-item-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .bh-item-title-link { text-decoration: none; color: inherit; }

  .bh-item-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 4px;
    line-height: 1.35;
  }

  .bh-item-category {
    font-size: 0.75rem;
    font-weight: 600;
    color: #c2185b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
  }

  .bh-item-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 12px;
  }

  .bh-item-final-price {
    font-size: 1.2rem;
    font-weight: 800;
    color: #c2185b;
  }

  .bh-item-original-price {
    font-size: 0.88rem;
    color: #aaa;
    text-decoration: line-through;
  }

  .bh-item-discount-tag {
    background: #c2185b;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 10px;
  }

  .bh-item-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  .bh-qty-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bh-qty-label { font-size: 0.8rem; color: #666; font-weight: 600; }

  .bh-qty-btn-group {
    display: flex;
    align-items: center;
    border: 1px solid #e2cad6;
    border-radius: 18px;
    background: #fff;
  }

  .bh-qty-btn {
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c2185b;
    cursor: pointer;
    font-size: 0.75rem;
  }

  .bh-qty-btn:disabled { color: #ccc; cursor: not-allowed; }

  .bh-qty-val {
    width: 28px;
    text-align: center;
    font-size: 0.88rem;
    font-weight: 700;
  }

  .bh-remove-btn {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 0.82rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: color 0.2s;
  }

  .bh-remove-btn:hover { color: #dc2626; }

  /* Summary Card */
  .bh-summary-card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid #fce4ec;
    padding: 24px;
    box-shadow: 0 6px 24px rgba(194, 24, 91, 0.05);
    position: sticky;
    top: 90px;
  }

  .bh-summary-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 20px;
  }

  .bh-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 12px;
  }

  .bh-discount-row { color: #16a34a; font-weight: 600; }

  .bh-free-text { color: #16a34a; font-weight: 700; }

  .bh-divider { border-color: #fce4ec; margin: 16px 0; }

  .bh-total-row { font-size: 1.1rem; font-weight: 800; color: #1f2937; margin-bottom: 4px; }

  .bh-total-price { color: #c2185b; font-size: 1.35rem; }

  .bh-summary-note { font-size: 0.78rem; color: #888; margin-bottom: 16px; }

  .bh-savings-banner {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    font-size: 0.82rem;
    padding: 10px 14px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .bh-checkout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    background: linear-gradient(135deg, #e91e8c, #c2185b);
    color: #ffffff;
    padding: 14px;
    border-radius: 14px;
    font-size: 0.95rem;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 8px 24px rgba(194, 24, 91, 0.25);
    transition: transform 0.2s, opacity 0.2s;
  }

  .bh-checkout-btn:hover {
    transform: translateY(-2px);
    opacity: 0.95;
    color: #fff;
  }

  .bh-trust-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid #fce4ec;
    font-size: 0.75rem;
    color: #777;
  }

  .bh-trust-footer span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  /* Responsive */
  @media (max-width: 992px) {
    .bh-cart-grid { grid-template-columns: 1fr; }
    .bh-summary-card { position: static; }
  }

  @media (max-width: 576px) {
    .bh-cart-item-card { flex-direction: column; }
    .bh-item-img-wrap { width: 100%; height: 180px; }
  }
`;
