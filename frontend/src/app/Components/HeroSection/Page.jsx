"use client";

import { useEffect, useState, useCallback } from "react";
import "./herosection.css";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { generateSlug } from "@/app/utils/generate-slug";
import Link from "next/link";
import BannerSkeleton from "@/app/utils/skeleton/bannerSkeleton";

// ─── CTA options ──────────────────────────────────────────────────────────────
const CTA_OPTIONS = [
  "Shop Now",
  "Buy Now",
  "Grab Yours",
  "Get It Now",
  "Order Now",
  "Discover More",
  "Explore Collection",
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Stable random CTA per banner (computed once on load)
  const [ctas] = useState(() =>
    Array.from({ length: 20 }, () =>
      CTA_OPTIONS[Math.floor(Math.random() * CTA_OPTIONS.length)]
    )
  );

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBanner = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/v1/banner/get-all-banners");
      if (response.status === 200) {
        const data = response?.data?.banners?.filter((b) => b?.isActive === true);
        setBanners(data || []);
      }
    } catch (error) {
      toast.error("Failed to load banners.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanner(); }, [fetchBanner]);

  // ── Auto-slide ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!banners.length || isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  const goTo = (idx) => setActiveIdx(idx);
  const goPrev = () => setActiveIdx((prev) => (prev - 1 + banners.length) % banners.length);
  const goNext = () => setActiveIdx((prev) => (prev + 1) % banners.length);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) return <BannerSkeleton />;

  if (!banners.length) return (
    <div className="hc-empty">
      <span>No active banners available.</span>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="hc-root"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Slides ── */}
      <div className="hc-track">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`hc-slide ${index === activeIdx ? "hc-slide--active" : ""}`}
            aria-hidden={index !== activeIdx}
          >
            {/* Image */}
            <div className="hc-img-wrap">
              <img
                src={banner?.bannerImage}
                alt={banner?.title || `Banner ${index + 1}`}
                className="hc-img"
              />
              <div className="hc-overlay" />
            </div>

            {/* Caption */}
            <div className={`hc-caption ${index === activeIdx ? "hc-caption--visible" : ""}`}>
              {banner?.subCategory?.subCategoryName && (
                <span className="hc-eyebrow">{banner.subCategory.subCategoryName}</span>
              )}
              {banner?.title && (
                <h2 className="hc-title">{banner.title}</h2>
              )}
              {banner?.description && (
                <p className="hc-desc">{banner.description}</p>
              )}
              <Link
                href={`/Pages/products/subcategory/${generateSlug(
                  banner?.subCategory?.subCategoryName,
                  banner?.subCategory?._id
                )}`}
                className="hc-btn"
              >
                {ctas[index]} <span className="hc-btn-arrow">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Prev / Next ── */}
      <button className="hc-ctrl hc-ctrl--prev" onClick={goPrev} aria-label="Previous">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="hc-ctrl hc-ctrl--next" onClick={goNext} aria-label="Next">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dots ── */}
      <div className="hc-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            className={`hc-dot ${i === activeIdx ? "hc-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="hc-progress-wrap">
        <div
          key={activeIdx}
          className={`hc-progress-bar ${!isPaused ? "hc-progress-bar--running" : ""}`}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;