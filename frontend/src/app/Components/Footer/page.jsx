// "use client";
// import React, { useEffect, useState } from "react";
// import "./footer.css";
// import Image from "next/image";
// import {
//   FaCcVisa,
//   FaCcMastercard,
//   FaCcAmex,
//   FaWallet,
//   FaLaptop,
//   FaInstagramSquare,
//   FaFacebookSquare,
//   FaTwitterSquare,
//   FaPinterest,
// } from "react-icons/fa";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCategories } from "@/app/redux/slice/categorySllice";
// import { generateSlug } from "@/app/utils/generate-slug";
// import {
//   fetchFeaturedProducts,
//   fetchProducts,
// } from "@/app/redux/slice/productSlice";
// import toast from "react-hot-toast";
// import { axiosInstance } from "@/app/utils/axiosInstance";


// function BrandLogo({ compact = false }) {
//   const size = compact ? 34 : 46;
//   return (
//     <Link
//       href="/"
//       style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: compact ? "8px" : "10px" }}
//     >
//       <svg
//         width={size}
//         height={size}
//         viewBox="250 5 180 215"
//         xmlns="http://www.w3.org/2000/svg"
//         aria-label="Beauty Hub emblem"
//         style={{ flexShrink: 0 }}
//       >
//         <circle cx="340" cy="112" r="90" fill="none" stroke="#c9a84c" strokeWidth="1.8" />
//         <circle cx="340" cy="112" r="82" fill="none" stroke="#c9a84c" strokeWidth="0.7" strokeDasharray="3 4" />
//         <line x1="340" y1="22" x2="340" y2="36" stroke="#c9a84c" strokeWidth="1.4" />
//         <path d="M340 28 Q328 18 324 10 Q334 14 340 28Z" fill="#c9a84c" />
//         <path d="M340 28 Q352 18 356 10 Q346 14 340 28Z" fill="#c9a84c" />
//         <path d="M340 22 Q336 12 340 6 Q344 12 340 22Z" fill="#c9a84c" />
//         <circle cx="251" cy="112" r="3" fill="#c9a84c" />
//         <circle cx="429" cy="112" r="3" fill="#c9a84c" />
//         <path d="M252 112 Q260 99 269 112 Q260 125 252 112Z" fill="#c9a84c" opacity="0.9" />
//         <path d="M428 112 Q420 99 411 112 Q420 125 428 112Z" fill="#c9a84c" opacity="0.9" />
//         {!compact && (
//           <>
//             <path d="M300 130 Q285 110 295 90 Q305 75 318 88" fill="none" stroke="#c9a84c" strokeWidth="1.2" opacity="0.75" />
//             <ellipse cx="308" cy="87" rx="5" ry="3" fill="#c9a84c" opacity="0.75" transform="rotate(-30,308,87)" />
//           </>
//         )}
//         <text x="302" y="142" fontFamily="Georgia,serif" fontSize="74" fontWeight="700" fill="#c9a84c" fontStyle="italic">B</text>
//         <text x="350" y="142" fontFamily="Georgia,serif" fontSize="74" fontWeight="700" fill="#c9a84c" fontStyle="italic">H</text>
//       </svg>

//       {/* Wordmark */}
//       <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
//         <span style={{
//           fontFamily: "Georgia, serif",
//           fontSize: compact ? "0.9rem" : "1.1rem",
//           fontWeight: 700,
//           letterSpacing: "0.18em",
//           color: "#c9a84c",
//           textTransform: "uppercase",
//         }}>
//           Beauty Hub
//         </span>
//         {!compact && (
//           <span style={{
//             fontFamily: "Georgia, serif",
//             fontSize: "0.52rem",
//             letterSpacing: "0.22em",
//             color: "#8a6e2f",
//             textTransform: "uppercase",
//             marginTop: "4px",
//           }}>
//             Premium Collection
//           </span>
//         )}
//       </div>
//     </Link>
//   );
// }


// const Footer = () => {
//   const [email, setEmail] = useState("");
//   const dispatch = useDispatch();
//   const { categories } = useSelector((state) => state.category);
//   const { products, featuredProducts } = useSelector((state) => state.product);

//   const handleContactUs = async (e) => {
//     e.preventDefault();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       toast.error("Enter a valid email address");
//       return;
//     }

//     try {
//       const response = await axiosInstance.post(
//         "/api/email-inquery/email-inqueries",
//         { email }
//       );
//       if (response.status === 201) {
//         setEmail("");
//         toast.success("Message sent successfully!");
//       }
//     } catch (error) {
//       console.log("Error sending message:", error);
//       toast.error(error?.response?.data?.message || "Failed to send message.");
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchCategories());
//     dispatch(fetchFeaturedProducts());
//   }, [dispatch]);

//   return (
//     <footer className="footer text-dark">
//       <div className="container Footersection">

//         <div className="logoSection">
//           {/* <Image
//             src="/logo.png"
//             alt="Aqualite Mattress Logo"
//             className="footerlogo"
//             width={140}
//             height={40}
//           /> */}
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <BrandLogo />
//           </div>
//           <p className="logoText">
//             Aqualite Mattress offers premium-quality mattresses designed for
//             perfect comfort, healthy sleep, and long-lasting durability.
//             Experience luxury sleep solutions crafted with advanced technology.
//           </p>

//           <div className="contactForm">
//             <input
//               type="email"
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="contactInput"
//             />
//             <button className="contactButton" onClick={handleContactUs}>
//               Submit
//             </button>
//           </div>
//         </div>

//         <hr />

//         <div className="row">
//           {/* Quick Links */}
//           <div className="col-md-3 col-6 mb-4">
//             <div className="QuickLinkSec">
//               <h3 className="heading">Quick Links</h3>
//               <ul className="list">
//                 <li>
//                   <Link href="/Pages/products">Shop Mattresses</Link>
//                 </li>
//                 <li>
//                   <Link href="/Components/faqs">FAQs</Link>
//                 </li>
//                 <li>
//                   <Link href="/Pages/contact-us">Customer Support</Link>
//                 </li>
//                 <li>
//                   <Link href="https://instagram.com/" target="_blank">
//                     Follow us on Instagram
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Categories */}
//           <div className="col-md-3 col-6 mb-4">
//             <div className="BestSellersSec">
//               <h3 className="heading">Mattress Categories</h3>
//               <ul className="list innerListGrid">
//                 {categories?.slice(0, 5)?.map((category, index) => (
//                   <li key={index}>
//                     <Link
//                       href={`/Pages/category/${generateSlug(
//                         category?.categoryName,
//                         category?._id
//                       )}`}
//                     >
//                       {category?.categoryName}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Best Sellers */}
//           <div className="col-md-3 col-6 mb-4">
//             <div className="CategoriesSec">
//               <h3 className="heading">Best Sellers</h3>
//               <ul className="list innerListGrid">
//                 {featuredProducts?.slice(0, 5)?.map((product) => (
//                   <li key={product?._id}>
//                     <Link
//                       href={`/Pages/products/${generateSlug(
//                         product?.productName,
//                         product?._id
//                       )}`}
//                     >
//                       {product?.productName}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* More Information */}
//           <div className="col-md-3 col-6 mb-4">
//             <div className="InformationSec">
//               <h3 className="heading">More Information</h3>
//               <ul className="list">
//                 <li>
//                   <Link href="/Pages/about-us">About Us</Link>
//                 </li>
//                 <li>
//                   <Link href="/privacy-policy">Privacy Policy</Link>
//                 </li>
//                 <li>
//                   <Link href="/shipping-policy">Shipping Policy</Link>
//                 </li>
//                 <li>
//                   <Link href="/Pages/term-conditions">
//                     Terms & Conditions
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/returns">Return & Refund Policy</Link>
//                 </li>
//                 <li>
//                   <Link href="/Pages/contact-us">Contact Us</Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Footer Bottom */}
//         <div className="footerBottomSec">
//           <div className="bottomFlexWrapper d-flex flex-wrap justify-content-between">

//             {/* Payment Options */}
//             <div className="paymentsec">
//               <h4>We Accept</h4>
//               <div className="d-flex gap-3 align-items-center">
//                 <FaCcVisa className="fs-1 text-primary" />
//                 <FaCcMastercard className="fs-1 text-warning" />
//                 <FaCcAmex className="fs-1 text-info" />
//                 <FaWallet className="fs-1" />
//                 <FaLaptop className="fs-1 text-secondary" />
//               </div>
//             </div>

//             {/* Social Media */}
//             <div className="SocialLinks d-grid">
//               <h4
//                 style={{
//                   fontSize: "14px",
//                   marginTop: "0.5rem",
//                   marginBottom: "0",
//                 }}
//               >
//                 Follow us for updates
//               </h4>
//               <div className="socialMediaSec justify-content-center d-flex gap-3">
//                 <Link href="#" target="_blank" className="instagramicon">
//                   <FaInstagramSquare className="fs-1 text-danger" />
//                 </Link>
//                 <Link href="#" target="_blank" className="facebookicon">
//                   <FaFacebookSquare className="fs-1 text-primary" />
//                 </Link>
//                 <Link href="#" target="_blank" className="twittericon">
//                   <FaTwitterSquare className="fs-1 text-info" />
//                 </Link>
//                 <Link href="#" target="_blank">
//                   <FaPinterest className="fs-1 text-danger" />
//                 </Link>
//               </div>
//             </div>

//           </div>
//         </div>

//       </div>

//       <div className="text-center mt-4">
//         <small>
//           © {new Date().getFullYear()} Aqualite Mattress. All rights reserved.
//         </small>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

"use client";
import React, { useEffect, useState } from "react";
import "./footer.css";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaWallet, FaLaptop, FaInstagramSquare, FaFacebookSquare, FaTwitterSquare, FaPinterest, } from "react-icons/fa";
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
        <circle cx="340" cy="112" r="90" fill="none" stroke="#c9a84c" strokeWidth="1.8" />
        <circle cx="340" cy="112" r="82" fill="none" stroke="#c9a84c" strokeWidth="0.7" strokeDasharray="3 4" />
        <line x1="340" y1="22" x2="340" y2="36" stroke="#c9a84c" strokeWidth="1.4" />
        <path d="M340 28 Q328 18 324 10 Q334 14 340 28Z" fill="#c9a84c" />
        <path d="M340 28 Q352 18 356 10 Q346 14 340 28Z" fill="#c9a84c" />
        <path d="M340 22 Q336 12 340 6 Q344 12 340 22Z" fill="#c9a84c" />
        <circle cx="251" cy="112" r="3" fill="#c9a84c" />
        <circle cx="429" cy="112" r="3" fill="#c9a84c" />
        <path d="M252 112 Q260 99 269 112 Q260 125 252 112Z" fill="#c9a84c" opacity="0.9" />
        <path d="M428 112 Q420 99 411 112 Q420 125 428 112Z" fill="#c9a84c" opacity="0.9" />
        {!compact && (
          <>
            <path d="M300 130 Q285 110 295 90 Q305 75 318 88" fill="none" stroke="#c9a84c" strokeWidth="1.2" opacity="0.75" />
            <ellipse cx="308" cy="87" rx="5" ry="3" fill="#c9a84c" opacity="0.75" transform="rotate(-30,308,87)" />
          </>
        )}
        <text x="302" y="142" fontFamily="Georgia,serif" fontSize="74" fontWeight="700" fill="#c9a84c" fontStyle="italic">B</text>
        <text x="350" y="142" fontFamily="Georgia,serif" fontSize="74" fontWeight="700" fill="#c9a84c" fontStyle="italic">H</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{
          fontFamily: "Georgia, serif",
          fontSize: compact ? "0.9rem" : "1.1rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#c9a84c",
          textTransform: "uppercase",
        }}>
          Beauty Hub
        </span>
        {!compact && (
          <span style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.52rem",
            letterSpacing: "0.22em",
            color: "#8a6e2f",
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
          <div className="logoSection">
            <BrandLogo />
            <p className="logoText">
              Beauty Hub brings you a curated collection of premium beauty
              products — from skincare to cosmetics — crafted for every skin
              type. Look beautiful, feel confident.
            </p>
            <div className="newsletterWrap">
              <p className="newsletterLabel">Subscribe for exclusive deals &amp; beauty tips</p>
              <div className="contactForm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="contactInput"
                />
                <button className="contactButton" onClick={handleContactUs}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="footerDivider" />

        {/* ── Links Grid ── */}
        <div className="row">

          {/* Quick Links */}
          <div className="col-md-3 col-6 mb-4">
            <div className="QuickLinkSec">
              <h3 className="heading">Quick Links</h3>
              <ul className="list">
                <li><Link href="/Pages/products">Shop Products</Link></li>
                <li><Link href="/Pages/about-us">About Us</Link></li>
                <li><Link href="/Components/faqs">FAQs</Link></li>
                <li><Link href="/Pages/contact-us">Customer Support</Link></li>
                <li>
                  <Link href="https://instagram.com/" target="_blank">
                    Follow on Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Categories */}
          <div className="col-md-3 col-6 mb-4">
            <div className="BestSellersSec">
              <h3 className="heading">Categories</h3>
              <ul className="list innerListGrid">
                {categories?.slice(0, 5)?.map((category, index) => (
                  <li key={index}>
                    <Link href={`/Pages/category/${generateSlug(category?.categoryName, category?._id)}`}>
                      {category?.categoryName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Best Sellers */}
          <div className="col-md-3 col-6 mb-4">
            <div className="CategoriesSec">
              <h3 className="heading">Best Sellers</h3>
              <ul className="list innerListGrid">
                {featuredProducts?.slice(0, 5)?.map((product) => (
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
          <div className="col-md-3 col-6 mb-4">
            <div className="InformationSec">
              <h3 className="heading">Information</h3>
              <ul className="list">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/shipping-policy">Shipping Policy</Link></li>
                <li><Link href="/Pages/term-conditions">Terms &amp; Conditions</Link></li>
                <li><Link href="/returns">Return &amp; Refund Policy</Link></li>
                <li><Link href="/Pages/contact-us">Contact Us</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <hr className="footerDivider" />

        {/* ── Footer Bottom ── */}
        <div className="footerBottomSec">
          <div className="bottomFlexWrapper">

            {/* Payment */}
            <div className="paymentsec">
              <h4>We Accept</h4>
              <div className="paymentIcons">
                <FaCcVisa className="payIcon text-primary" />
                <FaCcMastercard className="payIcon text-warning" />
                <FaCcAmex className="payIcon text-info" />
                <FaWallet className="payIcon" />
                <FaLaptop className="payIcon text-secondary" />
              </div>
            </div>

            {/* Social */}
            <div className="SocialLinks">
              <h4>Follow Us</h4>
              <div className="socialMediaSec">
                <Link href="#" target="_blank" className="instagramicon">
                  <FaInstagramSquare className="socialIcon" />
                </Link>
                <Link href="#" target="_blank" className="facebookicon">
                  <FaFacebookSquare className="socialIcon text-primary" />
                </Link>
                <Link href="#" target="_blank" className="twittericon">
                  <FaTwitterSquare className="socialIcon text-info" />
                </Link>
                <Link href="#" target="_blank">
                  <FaPinterest className="socialIcon text-danger" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Copyright ── */}
      <div className="footerCopyright">
        <small>
          © {new Date().getFullYear()} <strong>Beauty Hub</strong>. All rights reserved. Designed with ❤️ for beauty lovers.
        </small>
      </div>
    </footer>
  );
};

export default Footer;