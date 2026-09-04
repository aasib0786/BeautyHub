"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./brandShowcase.css";
import { axiosInstance } from "@/app/utils/axiosInstance";

const featuredBrandsFallback = [
  {
    _id: "b1",
    brandName: "L'Oréal Paris",
    description: "Luxury Skincare & Haircare",
    icon: "💄",
    tag: "Beauty & Cosmetics",
    count: "24+ Products",
  },
  {
    _id: "b2",
    brandName: "Huggy Teddies",
    description: "Ultra Soft Plush & Velvet Teddy Bears",
    icon: "🧸",
    tag: "Plush & Teddy Bears",
    count: "18+ Products",
  },
  {
    _id: "b3",
    brandName: "Forest Essentials",
    description: "Luxurious Ayurvedic Skincare & Oils",
    icon: "🌿",
    tag: "Ayurvedic Glow",
    count: "30+ Products",
  },
  {
    _id: "b4",
    brandName: "Royal Gift Combo",
    description: "Exclusive Celebration & Gift Hampers",
    icon: "🎁",
    tag: "Gifts & Hampers",
    count: "15+ Collections",
  },
  {
    _id: "b5",
    brandName: "MAC Cosmetics",
    description: "Professional Makeup & Velvet Lipsticks",
    icon: "✨",
    tag: "Glamour Makeup",
    count: "40+ Products",
  },
];

export default function BrandShowcase() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/brand/get-all-brands");
        if (res?.data?.data && res.data.data.length > 0) {
          setBrands(res.data.data);
        } else {
          setBrands(featuredBrandsFallback);
        }
      } catch (error) {
        console.log("Using fallback brands:", error);
        setBrands(featuredBrandsFallback);
      }
    };
    fetchBrands();
  }, []);
  return (
    <section className="brand-showcase-section">
      <div className="container">
        <div className="brand-section-header">
          <span className="brand-section-subtitle">Curated Excellence</span>
          <h2 className="brand-section-title">Explore Featured Brands</h2>
          <div className="brand-section-divider"></div>
        </div>

        <div className="brand-grid">
          {brands.map((brand, idx) => {
            const cleanDesc = brand.description
              ? brand.description.length > 35
                ? brand.description.substring(0, 35) + "..."
                : brand.description
              : "Official Brand Collection";

            return (
              <Link
                key={brand._id || idx}
                href={`/Pages/products/search?query=${encodeURIComponent(brand.brandName || "")}`}
                className="brand-card"
              >
                <div className="brand-icon-wrapper">
                  {brand.brandLogo ? (
                    <img
                      src={brand.brandLogo}
                      alt={brand.brandName}
                      className="brand-logo-img"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="brand-fallback-letter">
                      {brand?.brandName?.charAt(0)?.toUpperCase() || "👑"}
                    </span>
                  )}
                </div>
                <h3 className="brand-name">{brand.brandName}</h3>
                <p className="brand-category-tag">{cleanDesc}</p>
                <span className="brand-products-count">
                  Explore Collection ➔
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

