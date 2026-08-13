"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import './toptrending.css';
import { fetchCategories } from '@/app/redux/slice/categorySllice';
import { useDispatch, useSelector } from 'react-redux';
import { generateSlug } from '@/app/utils/generate-slug';

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="ct-skeleton">
    <div className="ct-skeleton-img" />
    <div className="ct-skeleton-text" />
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const CategoryNav = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filtered = categories?.filter((c) => c?.isCollection === true) || [];

  return (
    <section className="ct-section">
      <div className="container">

        {/* Heading */}
        <div className="ct-heading-wrap">
          <span className="ct-eyebrow">Explore</span>
          <h2 className="ct-heading">Top Picks For You</h2>
          <p className="ct-subheading">Curated beauty collections just for you</p>
        </div>

        {/* Grid */}
        <div className="ct-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((category, index) => (
                <Link
                  key={category?._id || index}
                  href={`/Pages/category/${generateSlug(category?.categoryName, category?._id)}`}
                  className="ct-card"
                >
                  {/* Image */}
                  <div className="ct-img-wrap">
                    <img
                      src={category?.categoryImage}
                      alt={category?.categoryName}
                      className="ct-img"
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                    <div className="ct-img-overlay" />
                  </div>

                  {/* Name */}
                  <div className="ct-name">{category?.categoryName}</div>
                </Link>
              ))
          }
        </div>

      </div>
    </section>
  );
};

export default CategoryNav;