"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdDelete } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

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
import "./CartSidebar.css";

const CartSidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.auth);

  /* ===============================
     Sync Cart (Login / Guest)
  =============================== */
  useEffect(() => {
    if (loading) return;

    if (user?.email) {
      dispatch(fetchCartItems());
    } else {
      const cartData = localStorage.getItem("cart");
      const parsed = safeJSONParse(cartData);
      if (Array.isArray(parsed)) {
        dispatch(setCartFromLocalStorage(parsed));
      }
    }
  }, [loading, user?.email, dispatch]);

  /* ===============================
     Disable body scroll
  =============================== */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  /* ===============================
     Quantity Handlers
  =============================== */
  const handleDecrease = (productId, quantity) => {
    if (quantity <= 1) return;

    if (user?.email) {
      dispatch(updateQuantity({ productId, action: "decrease" }))
        .then(() => dispatch(fetchCartItems()));
    } else {
      dispatch(decreaseQuantity({ productId }));
    }
  };

  const handleIncrease = (productId, quantity, stock) => {
    if (quantity >= stock) return;

    if (user?.email) {
      dispatch(updateQuantity({ productId, action: "increase" }))
        .then(() => dispatch(fetchCartItems()));
    } else {
      dispatch(increaseQuantity({ productId }));
    }
  };

  /* ===============================
     Remove Item
  =============================== */
  const handleRemove = async (productId) => {
    if (user?.email) {
      try {
        await axiosInstance.post("/api/v1/cart/remove-from-cart", {
          productId,
        });
        dispatch(removeFromCart({ productId }));
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      }
    } else {
      dispatch(removeFromCart({ productId }));
    }
  };

  /* ===============================
     Total Price
  =============================== */
  const total = items.reduce((acc, item) => {
    const price =
      item?.finalPrice ??
      item?.productId?.finalPrice ??
      0;

    return acc + price * item?.quantity;
  }, 0);

  console.log("DDD::=>", items)
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="cart-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="cart-header text-center">
              <h5>
                Your Cart{" "}
                <span className="text-muted">({items.length})</span>
              </h5>
              <MdClose className="close-icon" onClick={onClose} />
            </div>

            {/* Body */}
            <div className="cart-body">
              {items.length === 0 ? (
                <div className="text-center">
                  <p className="text-muted">Your cart is empty</p>
                  <Image
                    src="/Empty.webp"
                    alt="Empty Cart"
                    width={300}
                    height={300}
                  />
                  <Link href="/Pages/All-category">
                    <button className="CartButton mt-3">
                      Shop All Products
                    </button>
                  </Link>
                </div>
              ) : (
                items.map((item, i) => {
                  const product = item?.productId || item;
                  const price = item?.mattressFinalPrice ?? product?.finalPrice ?? item?.finalPrice ?? 0;
                  // console.log("DDD::=>" , item ,product)
                  return (
                    <div
                      className="cart-item d-flex gap-3 py-3 border-bottom"
                      key={i}
                    >
                      <Link href={`/Pages/products/${product?._id}`}>
                        <Image
                          src={
                            product?.images?.[0] ||
                            item?.image ||
                            "/placeholder.svg"
                          }
                          width={130}
                          height={100}
                          alt={product?.productName}
                          className="rounded"
                        />
                      </Link>

                      <div className="flex-grow-1">
                        <p className="fw-semibold mb-2">
                          {product?.productName}
                        </p>

                        <div className="d-flex align-items-center gap-3 mb-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleDecrease(product?._id, item?.quantity)
                            }
                          >
                            -
                          </button>

                          <span>{item?.quantity}</span>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleIncrease(
                                product?._id,
                                item?.quantity,
                                product?.stock
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <strong>₹{price * item?.quantity}</strong>
                      </div>

                      <MdDelete
                        className="text-danger fs-5 cursor-pointer"
                        onClick={() => handleRemove(product?._id)}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="cart-footer">
                <div className="d-flex justify-content-between mb-3">
                  <span>Total</span>
                  <strong>₹{total}</strong>
                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={() => {
                    onClose();
                    router.push("/Pages/addtocart");
                  }}
                >
                  PLACE ORDER
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
