"use client";
import React, { useEffect, useState } from "react";
import "./footer.css";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaWallet,
  FaLaptop,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaPaperPlane,
} from "react-icons/fa";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/app/redux/slice/categorySllice";
import { generateSlug } from "@/app/utils/generate-slug";
import { fetchFeaturedProducts } from "@/app/redux/slice/productSlice";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";

// ─── Brand Logo ───────────────────────────────────────────────────────────────
function BrandLogo({ compact = false }) {
  const size = compact ? 34 : 46;
  return (
    <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: compact ? "8px" : "10px" }}>
      <svg
        width={size}
        height={size}
        viewBox="250 5 180 215"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Beauty Hub emblem"
        style={{ flexShrink: 0 }}
      >
        <circle cx="340" cy="112" r="90" fill="none" stroke="#f3c623" strokeWidth="1.8" />
        <circle cx="340" cy="112" r="82" fill="none" stroke="#f3c623" strokeWidth="0.7" strokeDasharray="3 4" />
        <line x1="340" y1="22" x2="340" y2="36" stroke="#f3c623" strokeWidth="1.4" />
        <path d="M340 28 Q328 18 324 10 Q334 14 340 28Z" fill="#f3c623" />
        <path d="M340 28 Q352 18 356 10 Q346 14 340 28Z" fill="#f3c623" />
        <path d="M340 22 Q336 12 340 6 Q344 12 340 22Z" fill="#f3c623" />
        <circle cx="251" cy="112" r="3" fill="#f3c623" />
        <circle cx="429" cy="112" r="3" fill="#f3c623" />
        <path d="M252 112 Q260 99 269 112 Q260 125 252 112Z" fill="#f3c623" opacity="0.9" />
        <path d="M428 112 Q420 99 411 112 Q420 125 428 112Z" fill="#f3c623" opacity="0.9" />
        {!compact && (
          <>
            <path d="M300 130 Q285 110 295 90 Q305 75 318 88" fill="none" stroke="#f3c623" strokeWidth="1.2" opacity="0.75" />
            <ellipse cx="308" cy="87" rx="5" ry="3" fill="#f3c623" opacity="0.75" transform="rotate(-30,308,87)" />
          </>
        )}
        <text x="302" y="142" fontFamily="Georgia,serif" fontSize="74" fontWeight="700" fill="#f3c623" fontStyle="italic">B</text>
        <text x="350" y="142" fontFamily="Georgia,serif" fontSize="74" fontWeight="700" fill="#f3c623" fontStyle="italic">H</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{
          fontFamily: "Georgia, serif",
          fontSize: compact ? "0.9rem" : "1.15rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#f3c623",
          textTransform: "uppercase",
        }}>
          Beauty Hub
        </span>
        {!compact && (
          <span style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.54rem",
            letterSpacing: "0.22em",
            color: "#e2e8f0",
            textTransform: "uppercase",
            marginTop: "4px",
          }}>
            Premium Collection
          </span>
        )}
      </div>
    </Link>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { featuredProducts } = useSelector((state) => state.product);

  const handleContactUs = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    try {
      const response = await axiosInstance.post("/api/email-inquery/email-inqueries", { email });
      if (response.status === 201) {
        setEmail("");
        toast.success("Subscribed successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to subscribe.");
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <footer className="footer">
      <div className="container Footersection">

        {/* ── Top: Logo + About + Newsletter ── */}
        <div className="footerTop">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 col-md-12">
              <div className="brandWrap mb-3">
                <BrandLogo />
              </div>
              <p className="logoText">
                Beauty Hub is your luxury store for premium crockery, home decor,
                100% authentic beauty &amp; skincare, plush giant teddies, and curated gift hampers.
              </p>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="newsletterBox">
                <h5 className="newsletterTitle">
                  <FaPaperPlane style={{ color: "#f3c623" }} /> Join BeautyHub Club
                </h5>
                <p className="newsletterLabel">
                  Subscribe to receive exclusive sales, coupon codes &amp; beauty updates.
                </p>
                <form className="contactForm" onSubmit={handleContactUs}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="contactInput"
                  />
                  <button type="submit" className="contactButton">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <hr className="footerDivider" />

        {/* ── Links Grid ── */}
        <div className="row g-4">

          {/* Quick Links */}
          <div className="col-lg-3 col-md-3 col-6">
            <div className="QuickLinkSec">
              <h3 className="heading">Quick Links</h3>
              <ul className="list">
                <li><Link href="/Pages/All-category">Shop Products</Link></li>
                <li><Link href="/Pages/about-us">About Us</Link></li>
                <li><Link href="/Pages/contact-us">Customer Support</Link></li>
                <li><Link href="/vendor-register" style={{ color: "#f3c623", fontWeight: "bold" }}>🏪 Become a Vendor / Seller</Link></li>
                <li><Link href="/Pages/franchise">Become a Franchise</Link></li>
                <li><Link href="/Pages/TrackOrder">Track Order</Link></li>
              </ul>
            </div>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-3 col-6">
            <div className="BestSellersSec">
              <h3 className="heading">Categories</h3>
              <ul className="list">
                {(categories?.filter((c) => c.isCollection === true).length > 0
                  ? categories?.filter((c) => c.isCollection === true)
                  : categories
                )?.slice(0, 6)?.map((category, index) => (
                  <li key={category?._id || index}>
                    <Link href={`/Pages/category/${generateSlug(category?.categoryName, category?._id)}`}>
                      {category?.categoryName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Best Sellers */}
          <div className="col-lg-3 col-md-3 col-6">
            <div className="CategoriesSec">
              <h3 className="heading">Best Sellers</h3>
              <ul className="list">
                {(featuredProducts?.filter((p) => p.isFeatured === true).length > 0
                  ? featuredProducts?.filter((p) => p.isFeatured === true)
                  : featuredProducts
                )?.slice(0, 6)?.map((product) => (
                  <li key={product?._id}>
                    <Link href={`/Pages/products/${generateSlug(product?.productName, product?._id)}`}>
                      {product?.productName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* More Information */}
          <div className="col-lg-3 col-md-3 col-6">
            <div className="InformationSec">
              <h3 className="heading">Information</h3>
              <ul className="list">
                <li><Link href="/Pages/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/Pages/term-conditions">Terms &amp; Conditions</Link></li>
                <li><Link href="/Pages/helpCenter">Help Center &amp; FAQ</Link></li>
                <li><Link href="/Pages/contact-us">Contact Us</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <hr className="footerDivider" />

        {/* ── Footer Bottom ── */}
        <div className="footerBottomSec">
          <div className="row align-items-center g-3">

            {/* Payment */}
            <div className="col-md-6 col-12">
              <div className="paymentsec">
                <h4>100% Safe Payment Methods</h4>
                <div className="paymentIcons">
                  <FaCcVisa className="payIcon text-info" />
                  <FaCcMastercard className="payIcon text-warning" />
                  <FaCcAmex className="payIcon text-primary" />
                  <FaWallet className="payIcon text-warning" />
                  <FaLaptop className="payIcon text-light" />
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="col-md-6 col-12 text-md-end text-start">
              <div className="SocialLinks">
                <h4>Follow BeautyHub</h4>
                <div className="socialMediaSec">
                  <Link href="https://instagram.com" target="_blank" className="socialBadge instagram">
                    <FaInstagram />
                  </Link>
                  <Link href="https://facebook.com" target="_blank" className="socialBadge facebook">
                    <FaFacebookF />
                  </Link>
                  <Link href="https://twitter.com" target="_blank" className="socialBadge twitter">
                    <FaTwitter />
                  </Link>
                  <Link href="https://pinterest.com" target="_blank" className="socialBadge pinterest">
                    <FaPinterestP />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Copyright ── */}
      <div className="footerCopyright">
        <div className="container">
          <small>
            © {new Date().getFullYear()} <strong>Beauty Hub Store</strong>. All rights reserved. Crafted with ❤️ for luxury lovers.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;