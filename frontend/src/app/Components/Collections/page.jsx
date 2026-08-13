// "use client"
// import Image from 'next/image'
// import React, { useEffect } from 'react'
// import './collection.css'
// import Link from 'next/link'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchSubCategories } from '@/app/redux/slice/subCategorySlice'
// import { generateSlug } from '@/app/utils/generate-slug'

// const Page = () => {

//   const dispatch = useDispatch()

//   const { subCategories } = useSelector((state) => state.subCategory)

//   useEffect(() => {
//     dispatch(fetchSubCategories())
//   }, [dispatch])

//   return (
//     <section className="collection-section">
//       <div className="container">
//         <div className="section-header text-center">
//           <h2 className="toptrandheading m-0">Collections</h2>
//           <p className="subtitle">Explore our premium Aqualite Mattres collections</p>
//         </div>

//         <div className="collection-grid">
//           {subCategories
//             ?.filter((category) => category?.isCollection === true)
//             ?.map((item) => (
//               <div className="collection-card" key={item?._id}>
//                 <div className="image-wrapper">
//                   <Link
//                     href={`/Pages/products/subcategory/${generateSlug(
//                       item?.subCategoryName
//                     )}/${item?._id}`}
//                   >
//                     <Image
//                       src={item?.collectionImage}
//                       alt={item?.subCategoryName}
//                       fill
//                       sizes="(max-width: 768px), (max-width: 1200px) 50vw, 33vw"
//                       className="collection-img"
//                     />
//                   </Link>
//                 </div>
//                 <h3 className="collection-title">{item?.subCategoryName}</h3>
//               </div>
//             ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Page


"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubCategories } from "@/app/redux/slice/subCategorySlice";
import { generateSlug } from "@/app/utils/generate-slug";

// ─── Inline styles — no external CSS file needed ──────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bh-col-section {
    padding: 64px 0 72px;
    background: linear-gradient(160deg, #fff5f8 0%, #ffffff 55%, #fdf0f5 100%);
    position: relative;
    overflow: hidden;
  }

  /* Decorative background blobs */
  .bh-col-section::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(233,30,140,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .bh-col-section::after {
    content: '';
    position: absolute;
    bottom: -60px; left: -60px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(194,24,91,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Header ── */
  .bh-col-header {
    text-align: center;
    margin-bottom: 44px;
    position: relative;
    z-index: 1;
  }

  .bh-col-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fce4ec;
    color: #c2185b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 20px;
    margin-bottom: 14px;
  }

  .bh-col-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.15;
    margin: 0 0 10px;
  }

  .bh-col-title em {
    font-style: italic;
    color: #c2185b;
  }

  .bh-col-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    color: #888;
    margin: 0;
    letter-spacing: 0.02em;
  }

  /* ── Grid ── */
  .bh-col-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 22px;
    position: relative;
    z-index: 1;
  }

  /* First card spans 2 columns on larger screens for visual variety */
  @media (min-width: 768px) {
    .bh-col-grid .bh-col-card:first-child {
      grid-column: span 2;
    }
    .bh-col-grid .bh-col-card:first-child .bh-col-img-wrap {
      height: 360px;
    }
  }

  /* ── Card ── */
  .bh-col-card {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
    display: block;
    background: #f8f0f4;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
    animation: bhFadeUp 0.5s ease both;
  }

  .bh-col-card:nth-child(1) { animation-delay: 0.05s; }
  .bh-col-card:nth-child(2) { animation-delay: 0.10s; }
  .bh-col-card:nth-child(3) { animation-delay: 0.15s; }
  .bh-col-card:nth-child(4) { animation-delay: 0.20s; }
  .bh-col-card:nth-child(5) { animation-delay: 0.25s; }
  .bh-col-card:nth-child(6) { animation-delay: 0.30s; }

  @keyframes bhFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bh-col-card:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: 0 18px 48px rgba(194,24,91,0.18);
  }

  /* ── Image wrapper ── */
  .bh-col-img-wrap {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
  }

  .bh-col-card img {
    object-fit: cover;
    transition: transform 0.55s ease !important;
  }

  .bh-col-card:hover img {
    transform: scale(1.08) !important;
  }

  /* Gradient overlay on image */
  .bh-col-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(28, 5, 14, 0.72) 0%,
      rgba(28, 5, 14, 0.15) 50%,
      transparent 75%
    );
    pointer-events: none;
    z-index: 1;
    transition: opacity 0.3s;
  }

  .bh-col-card:hover .bh-col-img-wrap::after {
    opacity: 0.85;
  }

  /* ── Card label (on image) ── */
  .bh-col-label {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 2;
    padding: 14px 16px 16px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .bh-col-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
    margin: 0;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .bh-col-arrow {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.9rem;
    flex-shrink: 0;
    transition: background 0.25s, transform 0.25s;
  }

  .bh-col-card:hover .bh-col-arrow {
    background: #e91e8c;
    border-color: #e91e8c;
    transform: translateX(3px);
  }

  /* ── Empty state ── */
  .bh-col-empty {
    text-align: center;
    padding: 60px 20px;
    color: #aaa;
  }
  .bh-col-empty-icon { font-size: 3rem; margin-bottom: 12px; }
  .bh-col-empty p {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
  }

  /* ── View all button ── */
  .bh-col-viewall-wrap {
    text-align: center;
    margin-top: 36px;
    position: relative;
    z-index: 1;
  }

  .bh-col-viewall {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #c2185b;
    background: transparent;
    border: 1.5px solid #c2185b;
    padding: 10px 28px;
    border-radius: 30px;
    text-decoration: none;
    transition: background 0.25s, color 0.25s, transform 0.2s;
  }

  .bh-col-viewall:hover {
    background: #c2185b;
    color: #fff;
    transform: translateY(-2px);
  }

  /* ── Responsive ── */
  @media (max-width: 992px) {
    .bh-col-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
    @media (min-width: 768px) {
      .bh-col-grid .bh-col-card:first-child .bh-col-img-wrap {
        height: 290px;
      }
    }
  }

  @media (max-width: 576px) {
    .bh-col-section { padding: 44px 0 52px; }
    .bh-col-grid {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    /* Remove featured first-card span on mobile */
    .bh-col-grid .bh-col-card:first-child {
      grid-column: span 1 !important;
    }
    .bh-col-grid .bh-col-card:first-child .bh-col-img-wrap {
      height: 200px !important;
    }
    .bh-col-img-wrap { height: 190px; }
    .bh-col-name { font-size: 0.92rem; }
    .bh-col-arrow { width: 26px; height: 26px; font-size: 0.75rem; }
    .bh-col-header { margin-bottom: 28px; }
    .bh-col-title { font-size: 1.6rem; }
  }

  @media (max-width: 360px) {
    .bh-col-grid { grid-template-columns: 1fr; }
    .bh-col-img-wrap { height: 220px; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
const CollectionSection = () => {
  const dispatch = useDispatch();
  const { subCategories } = useSelector((state) => state.subCategory);

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const collections = subCategories?.filter((c) => c?.isCollection === true) || [];

  return (
    <>
      <style>{css}</style>

      <section className="bh-col-section">
        <div className="container">

          {/* Header */}
          <div className="bh-col-header">
            <div className="bh-col-chip">
              <span>✦</span> Collections
            </div>
            <h2 className="bh-col-title">
              Shop By <em>Category</em>
            </h2>
            <p className="bh-col-sub">
              Explore our curated beauty collections for every skin type
            </p>
          </div>

          {/* Grid */}
          {collections.length === 0 ? (
            <div className="bh-col-empty">
              <div className="bh-col-empty-icon">💄</div>
              <p>No collections available yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="bh-col-grid">
                {collections.map((item) => (
                  <Link
                    key={item?._id}
                    href={`/Pages/products/subcategory/${generateSlug(item?.subCategoryName)}/${item?._id}`}
                    className="bh-col-card"
                  >
                    {/* Image */}
                    <div className="bh-col-img-wrap">
                      {item?.collectionImage ? (
                        <Image
                          src={item.collectionImage}
                          alt={item.subCategoryName || "Collection"}
                          fill
                          sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
                          className="bh-col-img"
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: "linear-gradient(135deg,#fce4ec,#f8bbd0)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "3rem",
                        }}>
                          💄
                        </div>
                      )}

                      {/* Name + arrow over image */}
                      <div className="bh-col-label">
                        <h3 className="bh-col-name">{item?.subCategoryName}</h3>
                        <span className="bh-col-arrow">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All */}
              <div className="bh-col-viewall-wrap">
                <Link href="/Pages/All-category" className="bh-col-viewall">
                  View All Collections <span>→</span>
                </Link>
              </div>
            </>
          )}

        </div>
      </section>
    </>
  );
};

export default CollectionSection;