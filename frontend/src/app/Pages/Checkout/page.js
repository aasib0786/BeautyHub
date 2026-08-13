"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import pic1 from "@/app/Components/assets/icon1.jpg";
import "./checkout.css";
import Link from "next/link";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";

import { NoItem } from "@/app/utils/NoItem";
import {
  fetchCartItems,
  safeJSONParse,
  setCartFromLocalStorage,
} from "@/app/redux/slice/cartSlice";
import { useRouter } from "next/navigation";
export default function Checkout() {
  const [cuppen, setCuppen] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const [hasAttempt, setHasAttempt] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [coupons, setCoupons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [totalAmount, setTotalAmount] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);

  const router = useRouter();
  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/coupon/get-all-coupons"
      );
      setCoupons(response.data.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to fetch coupons.");
    }
  };
  const handleApply = () => {
    setHasAttempt(true);
    const coupon = coupons.find(
      (coupon) => coupon.couponCode === cuppen && coupon.isActive
    );
    let totalVal = originalTotal;
    if (
      coupon &&
      totalVal >= coupon.minAmount &&
      totalVal <= coupon.maxAmount
    ) {
      setIsSuccess(true);

      let discountAmount = 0;
      if (coupon.discount < 100) {
        discountAmount = (totalVal * coupon.discount) / 100;
      } else {
        discountAmount = coupon.discount;
      }

      const newTotal = Math.max(totalVal - discountAmount, 0); // prevent negative total
      setTotalAmount(newTotal);
    } else {
      setIsSuccess(false);
      setTotalAmount(originalTotal);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const handleOrder = async () => {
    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.country ||
      !address.pincode
    ) {
      toast.error("All fields are required");
      return;
    }
    if (address.phone && address.phone.length !== 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    const payload = {
      name: address.name,
      phone: address.phone,
      address: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      pincode: address.pincode,
      paymentMethod,
    };
    if (isSuccess === true) {
      payload.couponCode = cuppen;
    }
    try {
      const toastId = toast.loading("Placing order...");
      if (paymentMethod === "COD") {
        const response = await axiosInstance.post(
          "/api/v1/order/create-checkout",
          payload
        );
        if (response.status === 200) {
          toast.dismiss(toastId);
          toast.success("Order placed successfully!");
          router.push("/Pages/Profile?order=true");
        }
      } else {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Failed to load Razorpay script. Please try again.");
          return;
        }

        const response = await axiosInstance.post(
          "/api/v1/order/create-checkout",
          payload
        );
        const data = response.data;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.checkout.totalAmount,
          currency: "INR",
          name: "Manmohan Furniture",
          description: "Payment for your Manmohan Furniture order",
          image:
            "https://res.cloudinary.com/dfet60ou1/image/upload/v1747043182/logo_nkf8jp.webp",
          order_id: data?.checkout?.paymentInfo?.orderId,
          handler: async function (response) {
            try {
              const verifyData = await axiosInstance.post(
                "/api/v1/order/verify-payment",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              );

              if (verifyData.data.success) {
                toast.success("Payment verified. Order confirmed!");
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (verifyError) {
              console.error("Verification error:", verifyError);
              toast.error("Payment verification failed. Try again.");
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          theme: {
            color: "#153964",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error?.response?.data?.message || "Failed to place order.");
    }
  };

  const total = items.reduce((sum, item) => {
    const product = item?.productId;
    if (!product) return sum;
    console.log("XXXCC:=>", item)
    const finalPrice = item?.mattressPrice || product?.price - (item?.mattressPrice || product?.price * product?.discount) / 100;

    return sum + finalPrice * item?.quantity;
  }, 0);

  useEffect(() => {
    if (loading) return;

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
  }, [loading, dispatch, user]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    setOriginalTotal(total);
    setTotalAmount(total);
  }, [total]);

  useEffect(() => {
    if (!loading && (!user || !user.email)) {
      router.push("/Pages/login");
    }
  }, [user, loading, router]);

  if (loading || !user || !user.email) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      {!loading ? (
        <section>
          <nav aria-label="breadcrumb" className="prettyBreadcrumb">
            <div className="container">
              <ol className="breadcrumb align-items-center mt-3">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <span className="breadcrumbLink">Home</span>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Checkout
                </li>
              </ol>
            </div>
          </nav>

          <div className="checkoutsec">
            <div className="checkouttitle text-center">
              <p>Checkouts</p>
            </div>

            <div className="container">
              <div className="row">
                {/* Shipping Form */}
                <div className="col-lg-7">
                  <div className="shippingForm">
                    <p>Shipping Address</p>
                    <hr />
                    <form>
                      <div>
                        <label>Name*</label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="form-control"
                          value={address.name}
                          onChange={(e) =>
                            setAddress({ ...address, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label>Phone*</label>
                        <input
                          type="text"
                          placeholder="Phone Number"
                          className="form-control"
                          value={address.phone}
                          onChange={(e) =>
                            setAddress({ ...address, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label>Address*</label>
                        <input
                          type="text"
                          placeholder="Address"
                          className="form-control"
                          value={address.street}
                          onChange={(e) =>
                            setAddress({ ...address, street: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>City*</label>
                          <input
                            type="text"
                            placeholder="City"
                            className="form-control"
                            value={address.city}
                            onChange={(e) =>
                              setAddress({ ...address, city: e.target.value })
                            }
                            required
                          />
                          <label>State*</label>
                          <input
                            type="text"
                            placeholder="State"
                            className="form-control"
                            value={address.state}
                            onChange={(e) =>
                              setAddress({ ...address, state: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Country*</label>
                          <input
                            type="text"
                            placeholder="Country"
                            className="form-control"
                            value={address.country}
                            onChange={(e) =>
                              setAddress({
                                ...address,
                                country: e.target.value,
                              })
                            }
                            required
                          />
                          <label>Pin Code*</label>
                          <input
                            type="text"
                            placeholder="Pin Code"
                            className="form-control"
                            value={address.pincode}
                            onChange={(e) =>
                              setAddress({
                                ...address,
                                pincode: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-5 orderSummary">
                  <p>Order Summary</p>
                  <hr />
                  <div className="table-responsive">
                    {items && items.length > 0 ? (
                      items.map((item, index) => (
                        <table
                          className="table table-bordered text-center align-middle"
                          key={index}
                        >
                          <thead className="tabletheme">
                            <tr>
                              <th>Image</th>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <Image
                                  src={
                                    item?.productId?.images?.[0] ||
                                    "/images/placeholder.png"
                                  }
                                  alt={
                                    item?.productId?.productName || "Product"
                                  }
                                  height={100}
                                  width={100}
                                />
                              </td>
                              <td>{item?.productId?.productName}</td>
                              <td>{item?.mattressFinalPrice || item?.productId?.finalPrice}</td>
                              <td>{item?.quantity}</td>
                              <td>
                                {item?.mattressFinalPrice || item?.productId?.finalPrice * item?.quantity}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ))
                    ) : (
                      <NoItem name="cart item" />
                    )}
                  </div>

                  <div>
                    <table className="table table-bordered mt-4 checkout-total-table">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Sub-Total</strong>
                          </td>
                          <td>{totalAmount}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Shipping</strong>
                          </td>
                          <td>{totalAmount > 500 ? "Free" : 50}</td>
                        </tr>
                        <tr className="table-total-row">
                          <td>
                            <strong>Total</strong>
                          </td>
                          <td>
                            <strong>
                              {totalAmount + (totalAmount > 500 ? 0 : 50)}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter Voucher Code"
                    className="form-control my-2"
                    value={cuppen}
                    onChange={(e) => setCuppen(e.target.value)}
                  />
                  <button
                    className="btn btn-brown w-100 mb-3"
                    onClick={handleApply}
                  >
                    Apply
                  </button>

                  {hasAttempt &&
                    (isSuccess ? (
                      <p className="text-success">
                        Voucher is Successfully Applied
                      </p>
                    ) : (
                      <p className="text-danger">Invalid Voucher</p>
                    ))}

                  <div>
                    <label>
                      <b>Payment Method</b>
                    </label>
                    <select
                      className="form-control"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">Select Option</option>
                      <option value="Online">Online</option>
                      <option value="COD">Cash On Delivery</option>
                    </select>
                    <button
                      className="btn btn-brown w-100 mt-3 mb-3"
                      onClick={handleOrder}
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <h1> Loading...</h1>
      )}
    </>
  );
}
