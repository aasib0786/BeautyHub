// Navbar.js
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./navbar.css";
import { FaPhoneAlt, FaSearch, FaHeart } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { IoIosPersonAdd } from "react-icons/io";
import { MdShoppingCart } from "react-icons/md";
import CartSidebar from "../CartSidebar/CarSidebar";
import { GoHomeFill } from "react-icons/go";
import { BsFilePlayFill } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { RiAccountBoxFill } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";
import { CiShoppingCart } from "react-icons/ci";
import { MdOutlineContactSupport } from "react-icons/md";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { verifyUser } from "@/app/redux/slice/authSlice";
import {
  fetchCartItems,
  safeJSONParse,
  setCartFromLocalStorage,
  addToCart,
  AddToCartToServer,
} from "@/app/redux/slice/cartSlice";
import { getWishlistFromServer } from "@/app/redux/slice/wislistSlice";
import { generateSlug } from "@/app/utils/generate-slug";
import { useRouter } from "next/navigation";


const BRAND_BLUE = "#153964";

// ─── Reusable Brand Logo ──────────────────────────────────────────────────────
function BrandLogo({ compact = false }) {
  const size = compact ? 34 : 46;
  return (
    <Link
      href="/"
      style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: compact ? "8px" : "10px" }}
    >
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

      {/* Wordmark */}
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

// ─── Main Component ───────────────────────────────────────────────────────────
const Navbar = () => {

  function formatToDropdownContent(apiData) {
    const dropdownContent = {};
    apiData.forEach((categoryData) => {
      const category = { name: categoryData?.name, _id: categoryData?._id } || { name: "Unnamed", _id: 1 };
      const columns = categoryData.subCategories?.map((subCat) => {
        const products = subCat.products?.slice(0, 5)?.map((prod) => prod) || [];
        return [{ name: subCat.name, _id: subCat._id }, ...products];
      }) || [];
      dropdownContent[category.name] = {
        title: `${category.name} Collection`,
        link: category._id,
        columns,
      };
    });
    return dropdownContent;
  }

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Modern Sofa", image: "/icon1.jpg", price: 25000, quantity: 1 },
    { id: 2, name: "Wooden Chair", image: "/icon2.webp", price: 5500, quantity: 2 },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [navTree, setNavTree] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { user, loading } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const wishlistCount = wishlist?.products?.length || 0;
  const cartCount = items?.length || 0;

  const handleMouseEnter = (navItem) => setActiveDropdown(navItem);
  const handleMouseLeave = () => setActiveDropdown(null);
  const closeCart = () => setIsCartOpen(false);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const query = searchValue.trim();
      if (query) {
        setShowSearchDropdown(false);
        router.push(`/Pages/products/search?query=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleSearchChange = () => {
    const query = searchValue.trim();
    if (query) {
      setShowSearchDropdown(false);
      router.push(`/Pages/products/search?query=${encodeURIComponent(query)}`);
    }
  };

  // Real-time debounced search effect
  useEffect(() => {
    const query = searchValue.trim();
    if (!query) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await axiosInstance.get(
          `/api/v1/product/search?query=${encodeURIComponent(query)}`
        );
        const products = response?.data?.data || [];
        setSearchResults(products.slice(0, 6));
        setShowSearchDropdown(true);
      } catch (err) {
        console.error("Failed to search products:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handle Add to Cart directly inside live search dropdown
  const handleAddToCartInSearch = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const productImg = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/icon1.jpg";
    const cartPayload = {
      productId: product._id,
      quantity: 1,
      image: productImg,
      price: product.price,
      name: product.productName,
      finalPrice: product.finalPrice,
      discount: product.discount,
    };

    dispatch(addToCart(cartPayload));

    if (user?.email) {
      dispatch(
        AddToCartToServer([
          {
            productId: product._id,
            quantity: 1,
            image: productImg,
            price: product.price,
            name: product.productName,
            finalPrice: product.finalPrice,
            discount: product.discount,
          },
        ])
      );
    } else {
      const current = safeJSONParse(localStorage.getItem("cart")) || [];
      const idx = current.findIndex((item) => (item.productId?._id || item.productId) === product._id);
      if (idx > -1) {
        current[idx].quantity += 1;
      } else {
        current.push(cartPayload);
      }
      localStorage.setItem("cart", JSON.stringify(current));
    }
    toast.success(`Added "${product.productName}" to cart!`);
  };

  const fetchMainCategories = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/main-category/get-all-main-categories"
      );
      if (response?.data?.data) {
        setMainCategories(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch main categories:", err);
    }
  };

  const fetchNavTree = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/main-category/get-navbar-categories-tree"
      );
      if (response?.data?.data && response.data.data.length > 0) {
        setNavTree(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch navbar category tree:", err);
    }
  };

  useEffect(() => {
    fetchMainCategories();
    fetchNavTree();
    dispatch(verifyUser());
  }, []);

  useEffect(() => {
    if (loading) return;
    if (user?.email) {
      dispatch(fetchCartItems());
      dispatch(getWishlistFromServer());
    } else if (typeof window !== "undefined") {
      const parsedCart = safeJSONParse(localStorage.getItem("cart"));
      if (Array.isArray(parsedCart)) dispatch(setCartFromLocalStorage(parsedCart));
    }
  }, [loading]);

  return (
    <>
      {/* ══════════════════════════════════════════
          DESKTOP NAVBAR
      ══════════════════════════════════════════ */}
      <header className="main-navbar">

        {/* Top bar */}
        <div className="top-navbar">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center px-3 py-2 flex-wrap gap-2">
              <span className="text-white d-flex align-items-center gap-2">
                <TbTruckDelivery style={{ fontSize: "1.4rem", color: "#fff" }} />
                <span style={{ fontSize: "0.85rem" }}>Fast Delivery</span>
              </span>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Link href="tel:+919131734930" className="top-nav-link"><FaPhoneAlt style={{ fontSize: "0.8rem" }} /> +91 9131734930</Link>
                <Link href="/vendor-register" className="top-nav-link" style={{ color: "#f3c623", fontWeight: "bold" }}>🏪 Become a Seller</Link>
                <Link href="/Pages/franchise" className="top-nav-link">Become a Franchise</Link>
                <Link href="/Pages/Profile?order=true" className="top-nav-link">Track Order</Link>
                <Link href="/Pages/helpCenter" className="top-nav-link">Help Center</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Middle bar */}
        <div className="middle-navbar">
          <div className="container-fluid px-3 px-md-4">

            <div className="d-flex align-items-center justify-content-between py-2 gap-3">

              {/* Logo */}
              <div className="flex-shrink-0">
                <BrandLogo />
              </div>

              {/* Search Bar — Desktop */}
              <div className="nb-search d-none d-md-flex flex-grow-1">
                <div className="nb-search-container">
                  <div className="input-group">
                    <input
                      suppressHydrationWarning
                      type="text"
                      className="form-control nb-search-input"
                      placeholder="Search for products, categories, or keywords…"
                      onKeyDown={handleSearchKeyDown}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onFocus={() => {
                        if (searchValue.trim() && searchResults.length > 0) setShowSearchDropdown(true);
                      }}
                    />
                    <button
                      className="nb-search-btn"
                      onClick={handleSearchChange}
                      type="button"
                      aria-label="Search"
                    >
                      <FaSearch />
                    </button>
                  </div>

                  {/* Live Search Dropdown */}
                  {showSearchDropdown && searchValue.trim() && (
                    <div className="nb-search-dropdown shadow-lg">
                      {isSearching ? (
                        <div className="p-3 text-center text-muted">
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Searching products...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <div className="px-3 py-1 bg-light border-bottom d-flex justify-content-between align-items-center">
                            <small className="text-muted fw-bold" style={{ fontSize: "0.75rem" }}>
                              SUGGESTED PRODUCTS ({searchResults.length})
                            </small>
                            <span
                              style={{ cursor: "pointer", fontSize: "0.75rem" }}
                              className="text-muted fw-bold"
                              onClick={() => setShowSearchDropdown(false)}
                            >
                              ✕
                            </span>
                          </div>
                          {searchResults.map((prod) => (
                            <div
                              key={prod._id}
                              className="nb-search-item"
                              onClick={() => {
                                setShowSearchDropdown(false);
                                router.push(`/Pages/products/${generateSlug(prod.productName, prod._id)}`);
                              }}
                            >
                              <img
                                src={Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : "/icon1.jpg"}
                                alt={prod.productName}
                                className="nb-search-item-img"
                                onError={(e) => { e.target.src = "/icon1.jpg"; }}
                              />
                              <div className="nb-search-item-info">
                                <div className="nb-search-item-title">{prod.productName}</div>
                                <div className="d-flex align-items-center">
                                  <span className="nb-search-item-price">₹{prod.finalPrice}</span>
                                  {prod.discount > 0 && (
                                    <>
                                      <span className="nb-search-item-mrp">₹{prod.price}</span>
                                      <span className="nb-search-item-discount">{prod.discount}% OFF</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="nb-search-add-btn"
                                onClick={(e) => handleAddToCartInSearch(e, prod)}
                              >
                                <FaShoppingCart style={{ fontSize: "0.75rem" }} /> Add
                              </button>
                            </div>
                          ))}
                          <Link
                            href={`/Pages/products/search?query=${encodeURIComponent(searchValue.trim())}`}
                            className="nb-search-view-all"
                            onClick={() => setShowSearchDropdown(false)}
                          >
                            View all results for "{searchValue.trim()}" →
                          </Link>
                        </>
                      ) : (
                        <div className="p-3 text-center text-muted" style={{ fontSize: "0.85rem" }}>
                          No products found for "{searchValue.trim()}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Auth + actions */}
              <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
                {user?.email ? (
                  <Link href="/Pages/Profile" className="nb-action-link">
                    <IoIosPersonAdd size={18} />
                    <span className="d-none d-md-inline">Profile</span>
                  </Link>
                ) : (
                  <div className="d-flex gap-2">
                    <Link href="/Pages/Signup" className="btn nb-btn-primary btn-sm">Sign Up</Link>
                    <Link href="/Pages/login" className="btn nb-btn-outline  btn-sm">Login</Link>
                  </div>
                )}

                <Link href="/Pages/Wishlist" className="nb-action-link">
                  <FaHeart style={{ color: "#c0392b" }} />
                  <span className="d-none d-sm-inline">Wishlist</span>
                  <span className="nb-badge">{wishlistCount}</span>
                </Link>

                <button className="nb-action-btn" onClick={() => setIsCartOpen(true)}>
                  <MdShoppingCart size={20} style={{ color: BRAND_BLUE }} />
                  <span className="d-none d-sm-inline">Cart</span>
                  <span className="nb-badge">{cartCount}</span>
                </button>
              </div>

            </div>

            {/* Mobile search row */}
            <div className="d-flex d-md-none pb-2">
              <div className="nb-search w-100">
                <div className="nb-search-container">
                  <div className="input-group">
                    <input
                      suppressHydrationWarning
                      type="text"
                      className="form-control nb-search-input"
                      placeholder="Search for products..."
                      onKeyDown={handleSearchKeyDown}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onFocus={() => {
                        if (searchValue.trim() && searchResults.length > 0) setShowSearchDropdown(true);
                      }}
                    />
                    <button
                      className="nb-search-btn"
                      onClick={handleSearchChange}
                      type="button"
                      aria-label="Search"
                    >
                      <FaSearch />
                    </button>
                  </div>

                  {/* Live Search Dropdown for Mobile */}
                  {showSearchDropdown && searchValue.trim() && (
                    <div className="nb-search-dropdown shadow-lg">
                      {isSearching ? (
                        <div className="p-3 text-center text-muted">
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Searching products...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          {searchResults.map((prod) => (
                            <div
                              key={prod._id}
                              className="nb-search-item"
                              onClick={() => {
                                setShowSearchDropdown(false);
                                router.push(`/Pages/products/${generateSlug(prod.productName, prod._id)}`);
                              }}
                            >
                              <img
                                src={Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : "/icon1.jpg"}
                                alt={prod.productName}
                                className="nb-search-item-img"
                                onError={(e) => { e.target.src = "/icon1.jpg"; }}
                              />
                              <div className="nb-search-item-info">
                                <div className="nb-search-item-title">{prod.productName}</div>
                                <div className="d-flex align-items-center">
                                  <span className="nb-search-item-price">₹{prod.finalPrice}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="nb-search-add-btn"
                                onClick={(e) => handleAddToCartInSearch(e, prod)}
                              >
                                Add
                              </button>
                            </div>
                          ))}
                          <Link
                            href={`/Pages/products/search?query=${encodeURIComponent(searchValue.trim())}`}
                            className="nb-search-view-all"
                            onClick={() => setShowSearchDropdown(false)}
                          >
                            View all results →
                          </Link>
                        </>
                      ) : (
                        <div className="p-3 text-center text-muted" style={{ fontSize: "0.85rem" }}>
                          No products found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* Bottom nav / mega menu */}
        <nav className="bottom-navbar navbar navbar-expand-lg px-3">
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-label="Toggle navigation"
          >
            <IoMenu style={{ color: "#fff", fontSize: "1.6rem" }} />
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="mainNavbar">
            <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
              {navTree.map((mainItem) => (
                <li
                  key={mainItem._id}
                  className="nav-item dropdown"
                  onMouseEnter={() => handleMouseEnter(mainItem.mainCategoryName)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    className="nav-link d-flex align-items-center gap-1 font-weight-bold"
                    href={`/Pages/products/search?query=${encodeURIComponent(mainItem.mainCategoryName)}`}
                  >
                    {mainItem.mainCategoryName}
                    <IoIosArrowDown style={{ fontSize: "0.8rem", opacity: 0.7 }} />
                  </Link>

                  {activeDropdown === mainItem.mainCategoryName && (
                    <div
                      className="mega-dropdown"
                      onMouseEnter={() => handleMouseEnter(mainItem.mainCategoryName)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flipkart-mega-grid">
                        {mainItem.categories && mainItem.categories.length > 0 ? (
                          mainItem.categories.map((cat) => (
                            <div key={cat._id} className="flipkart-cat-col">
                              <Link
                                href={`/Pages/category/${generateSlug(cat.categoryName, cat._id)}`}
                                className="flipkart-cat-title"
                              >
                                {cat.categoryName} <span style={{ fontSize: "0.75rem", color: "#999" }}>▸</span>
                              </Link>

                              {cat.subCategories && cat.subCategories.length > 0 ? (
                                cat.subCategories.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    href={`/Pages/products/subcategory/${generateSlug(sub.subCategoryName, sub._id)}`}
                                    className="flipkart-sub-item"
                                  >
                                    {sub.subCategoryName}
                                  </Link>
                                ))
                              ) : (
                                <Link
                                  href={`/Pages/category/${generateSlug(cat.categoryName, cat._id)}`}
                                  className="flipkart-sub-item"
                                >
                                  Explore {cat.categoryName}
                                </Link>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-muted" style={{ fontSize: "0.85rem" }}>
                            Explore products in {mainItem.mainCategoryName}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}

              <li className="nav-item">
                <Link className="nav-link font-weight-bold" href="/Pages/All-category" style={{ color: "#f1c40f" }}>
                  All Categories
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <CartSidebar
          isOpen={isCartOpen}
          onClose={closeCart}
          cartItems={cartItems}
          onRemoveItem={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
        />

      </header>

      {/* ══════════════════════════════════════════
          MOBILE TOPBAR
      ══════════════════════════════════════════ */}
      <div className="responsive-topbar">

        {/* Row 1 */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2 gap-2">
          <button
            className="btn nb-btn-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open menu"
          >
            <IoMenu style={{ fontSize: "1.4rem" }} />
          </button>

          <BrandLogo compact />

          <div className="d-flex align-items-center gap-2">
            {user?.email ? (
              <Link href="/Pages/Wishlist" className="nb-action-link">
                <FaRegHeart style={{ fontSize: "1.3rem" }} />
              </Link>
            ) : (
              <Link href="/Pages/Signup">
                <button className="btn nb-btn-primary btn-sm" style={{ fontSize: "0.75rem" }}>Sign Up</button>
              </Link>
            )}
            <button className="nb-action-btn" onClick={() => setIsCartOpen(true)}>
              <MdShoppingCart style={{ fontSize: "1.4rem", color: BRAND_BLUE }} />
              <span className="nb-badge">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search */}
        <div className="px-3 pb-2">
          <div className="nb-search w-100">
            <div className="nb-search-container">
              <div className="input-group">
                <input
                  suppressHydrationWarning
                  type="text"
                  className="form-control nb-search-input"
                  placeholder="Search for products..."
                  onKeyDown={handleSearchKeyDown}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => {
                    if (searchValue.trim() && searchResults.length > 0) setShowSearchDropdown(true);
                  }}
                />
                <button
                  className="nb-search-btn"
                  onClick={handleSearchChange}
                  type="button"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>

              {showSearchDropdown && searchValue.trim() && (
                <div className="nb-search-dropdown shadow-lg">
                  {isSearching ? (
                    <div className="p-3 text-center text-muted">
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Searching products...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((prod) => (
                        <div
                          key={prod._id}
                          className="nb-search-item"
                          onClick={() => {
                            setShowSearchDropdown(false);
                            router.push(`/Pages/products/${generateSlug(prod.productName, prod._id)}`);
                          }}
                        >
                          <img
                            src={Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : "/icon1.jpg"}
                            alt={prod.productName}
                            className="nb-search-item-img"
                            onError={(e) => { e.target.src = "/icon1.jpg"; }}
                          />
                          <div className="nb-search-item-info">
                            <div className="nb-search-item-title">{prod.productName}</div>
                            <div className="d-flex align-items-center">
                              <span className="nb-search-item-price">₹{prod.finalPrice}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="nb-search-add-btn"
                            onClick={(e) => handleAddToCartInSearch(e, prod)}
                          >
                            Add
                          </button>
                        </div>
                      ))}
                      <Link
                        href={`/Pages/products/search?query=${encodeURIComponent(searchValue.trim())}`}
                        className="nb-search-view-all"
                        onClick={() => setShowSearchDropdown(false)}
                      >
                        View all results →
                      </Link>
                    </>
                  ) : (
                    <div className="p-3 text-center text-muted" style={{ fontSize: "0.85rem" }}>
                      No products found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Slide-down menu */}
        {isMobileMenuOpen && (
          <nav className="mobile-menu-dropdown">
            <ul className="list-unstyled mb-0">
              {[
                { href: "/", icon: <CiHome />, label: "Home" },
                { href: "/Pages/All-category", icon: <BiCategoryAlt />, label: "All Categories" },
                { href: "/Pages/about-us", icon: <IoIosInformationCircleOutline />, label: "About Us" },
                { href: "/Pages/contact-us", icon: <MdOutlineContactSupport />, label: "Contact Us" },
                { href: "/Pages/addtocart", icon: <CiShoppingCart />, label: `Cart (${cartCount})` },
              ].map(({ href, icon, label }) => (
                <li key={href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href={href} className="mobile-menu-item">{icon} {label}</Link>
                </li>
              ))}
            </ul>

            {navTree && navTree.length > 0 && (
              <div className="px-3 py-2 border-top bg-light">
                <small className="text-muted font-weight-bold d-block mb-2">EXPLORE CATEGORIES</small>
                <div className="d-flex flex-column gap-2">
                  {navTree.map((mainItem) => (
                    <div key={mainItem._id} className="bg-white p-2 rounded border">
                      <Link
                        href={`/Pages/products/search?query=${encodeURIComponent(mainItem.mainCategoryName)}`}
                        className="font-weight-bold text-dark text-decoration-none d-block mb-1"
                        style={{ fontSize: "0.85rem" }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        👑 {mainItem.mainCategoryName}
                      </Link>
                      {mainItem.categories && mainItem.categories.map((cat) => (
                        <div key={cat._id} className="ps-2 my-1">
                          <Link
                            href={`/Pages/category/${generateSlug(cat.categoryName, cat._id)}`}
                            className="text-primary text-decoration-none font-weight-bold d-block"
                            style={{ fontSize: "0.8rem" }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            ▸ {cat.categoryName}
                          </Link>
                          {cat.subCategories && (
                            <div className="ps-2 d-flex flex-wrap gap-1 mt-1">
                              {cat.subCategories.map((sub) => (
                                <Link
                                  key={sub._id}
                                  href={`/Pages/products/subcategory/${generateSlug(sub.subCategoryName, sub._id)}`}
                                  className="badge bg-light text-dark border text-decoration-none"
                                  style={{ fontSize: "0.72rem" }}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {sub.subCategoryName}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>
        )}

      </div>

      {/* ══════════════════════════════════════════
          MOBILE BOTTOM TAB BAR
      ══════════════════════════════════════════ */}
      <nav className="responsive-navbar bottom-bar" aria-label="Mobile bottom navigation">
        <div className="responsive-main">
          {[
            { href: "/", label: "Home", icon: <GoHomeFill /> },
            { href: "/Pages/videosec", label: "Video", icon: <BsFilePlayFill /> },
            { href: "/Pages/Category", label: "Category", icon: <BiSolidCategory /> },
            { href: "/Pages/Profile", label: "Account", icon: <RiAccountBoxFill /> },
            { href: "/Pages/addtocart", label: "Cart", icon: <FaShoppingCart /> },
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href} className="responsive-tab">
              <span className="responsive-icons">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

    </>
  );
};

export default Navbar;