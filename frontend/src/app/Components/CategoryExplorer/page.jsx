"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./categoryExplorer.css";
import { axiosInstance } from "@/app/utils/axiosInstance";

const fallbackMainCategories = [
  { _id: "m1", mainCategoryName: "Beauty & Cosmetics", icon: "💄" },
  { _id: "m2", mainCategoryName: "Teddy Bears & Plushies", icon: "🧸" },
  { _id: "m3", mainCategoryName: "Gift Hampers & Combos", icon: "🎁" },
  { _id: "m4", mainCategoryName: "Fragrance & Essential Oils", icon: "🌸" },
];

const fallbackCategories = [
  {
    _id: "c1",
    categoryName: "Glowing Skincare",
    mainCategory: { _id: "m1", mainCategoryName: "Beauty & Cosmetics" },
    description: "Serums, Moisturisers, Face Wash & Cleansers for radiant glow.",
    subcategories: ["Rose Serum", "Vitamin C Glow", "Night Repair Cream", "Sunscreen SPF 50"],
  },
  {
    _id: "c2",
    categoryName: "Glamour Makeup",
    mainCategory: { _id: "m1", mainCategoryName: "Beauty & Cosmetics" },
    description: "Matte Lipsticks, Foundations, Eye Palettes & Blushes.",
    subcategories: ["Velvet Lipsticks", "Matte Foundation", "Eyeliner", "Blush & Highlighter"],
  },
  {
    _id: "c3",
    categoryName: "Giant & Soft Teddies",
    mainCategory: { _id: "m2", mainCategoryName: "Teddy Bears & Plushies" },
    description: "Huggy Plush Teddies in Red, Pink, Brown & Velvet Finish.",
    subcategories: ["5ft Life Size Teddy", "Rose Heart Teddy", "Couple Bear Pair", "Mini Keychain Bears"],
  },
  {
    _id: "c4",
    categoryName: "Plush Animals & Toys",
    mainCategory: { _id: "m2", mainCategoryName: "Teddy Bears & Plushies" },
    description: "Adorable soft plushies for birthdays, anniversaries & kids.",
    subcategories: ["Soft Bunny Plush", "Unicorn Plush", "Panda Plush Bear", "Cute Puppy Pillow"],
  },
  {
    _id: "c5",
    categoryName: "Luxury Gift Sets",
    mainCategory: { _id: "m3", mainCategoryName: "Gift Hampers & Combos" },
    description: "Curated Beauty & Chocolate Hampers with personalized cards.",
    subcategories: ["Beauty & Pamper Box", "Valentine Special Combo", "Birthday Surprise Bag", "Corporate Luxury Kit"],
  },
  {
    _id: "c6",
    categoryName: "Royal Perfumes & Oils",
    mainCategory: { _id: "m4", mainCategoryName: "Fragrance & Essential Oils" },
    description: "Long-lasting Eau De Parfum, Body Mists & Essential Oils.",
    subcategories: ["Rose Gold EDP", "Vanilla Body Mist", "Lavender Essential Oil", "Oud Luxury Parfum"],
  },
];

export default function CategoryExplorer() {
  const [mainCats, setMainCats] = useState(fallbackMainCategories);
  const [categories, setCategories] = useState(fallbackCategories);
  const [selectedMainCat, setSelectedMainCat] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mainRes, catRes] = await Promise.all([
          axiosInstance.get("/api/v1/main-category/get-all-main-categories"),
          axiosInstance.get("/api/v1/category/get-all-categories"),
        ]);

        if (mainRes?.data?.data && mainRes.data.data.length > 0) {
          setMainCats(mainRes.data.data);
        }
        if (catRes?.data?.data && catRes.data.data.length > 0) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.log("Using category fallback data:", err);
      }
    };
    fetchData();
  }, []);

  const filteredCategories =
    selectedMainCat === "all"
      ? categories
      : categories.filter(
          (c) =>
            c?.mainCategory?._id === selectedMainCat ||
            c?.mainCategory === selectedMainCat ||
            c?.mainCategory?.mainCategoryName === selectedMainCat
        );

  return (
    <section className="category-explorer-section">
      <div className="container">
        <div className="category-header">
          <span className="category-subtitle">Boutique Selection</span>
          <h2 className="category-title">Explore Main Categories & Collections</h2>
          <div className="category-divider"></div>

          {/* Main Category Tabs */}
          <div className="main-cat-tabs">
            <button
              className={`main-cat-tab-btn ${selectedMainCat === "all" ? "active" : ""}`}
              onClick={() => setSelectedMainCat("all")}
            >
              ✨ All Main Categories
            </button>
            {mainCats.map((mc) => (
              <button
                key={mc._id}
                className={`main-cat-tab-btn ${
                  selectedMainCat === mc._id ? "active" : ""
                }`}
                onClick={() => setSelectedMainCat(mc._id)}
              >
                <span>{mc.icon || "💎"}</span> {mc.mainCategoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Category & SubCategory Cards Grid */}
        <div className="cat-cards-grid">
          {filteredCategories.map((cat, idx) => (
            <div key={cat._id || idx} className="cat-explore-card">
              <div>
                <span className="cat-explore-badge">
                  {cat?.mainCategory?.mainCategoryName || "Beauty & Gifts"}
                </span>
                <h3 className="cat-explore-title">{cat.categoryName}</h3>
                <p className="cat-explore-desc">
                  {cat.description || "Discover premium skincare, gifts & plush items."}
                </p>

                {/* Subcategory Pills */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="subcat-pills-wrapper">
                    {cat.subcategories.map((sub, i) => (
                      <span key={i} className="subcat-pill">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={`/all-products?category=${cat._id}`}
                className="cat-explore-action"
              >
                Shop Collection ➔
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
