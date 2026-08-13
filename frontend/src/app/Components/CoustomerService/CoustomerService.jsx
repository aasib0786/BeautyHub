// import Image from 'next/image'
// import React from 'react'
// import './coustomerservice.css'
// import pic1 from '@/app/Components/assets/CoustomerService.avif'
// import Certification from '@/app/Components/Certifications/Certification'

// export default function CoustomerService() {
//   return (
//     <>
//       <section className='container'>
//         <div className='CoustomerServiceMainSec'>
//             <div className=''>
//             <div className='CoustomerServiceImageSec'>
//                 <Image src={pic1} alt="" className='ServiceIcon'/>

//             </div>

//             <div>
//                    <h2 className='CoustomerServiceTitle'>Coustomer Service</h2>
//                    <h2 className='CoustomerServiceSubTitle' >Excellence Award - 2024 ESCDA, France</h2>
//             </div>
//             <div className='ServiceFeature'>
//                 <span className='bg-secondary spanFeature p-1'>#1 Comfort</span>
//                <span className='bg-secondary spanFeature p-1'>#1 Support</span>
//                <span className='bg-secondary spanFeature p-1'>#1 Value for Price Paid</span>
//                <span className='bg-secondary  spanFeature p-1'>#1 Warranty</span>
//                <span className='bg-secondary spanFeature p-1'>#1 Durability</span>
//             </div>

  
//       <Certification/>
//             </div>
//         </div>


//       </section>

      
//     </>
//   )
// }


"use client";
import Image from "next/image";
import React from "react";
import pic1 from "@/app/Components/assets/CoustomerService.avif";
import Certification from "@/app/Components/Certifications/Certification";

// ─── Award badges data ────────────────────────────────────────────────────────
const badges = [
  { icon: "✨", label: "#1 Comfort" },
  { icon: "💆", label: "#1 Support" },
  { icon: "💰", label: "#1 Value for Price" },
  { icon: "🛡️", label: "#1 Warranty" },
  { icon: "⏳", label: "#1 Durability" },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "24/7", label: "Support Available" },
];

export default function CustomerService() {
  return (
    <>
      <style>{css}</style>

      <section className="cs-section">
        <div className="container">
          <div className="cs-wrap">

            {/* ── Left: image + stats ── */}
            <div className="cs-left">
              <div className="cs-img-frame">
                {/* Decorative ring */}
                <div className="cs-img-ring" />
                <div className="cs-img-inner">
                  <Image
                    src={pic1}
                    alt="Customer Service Award"
                    fill
                    sizes="(max-width: 768px) 80vw, 340px"
                    className="cs-img"
                  />
                </div>

                {/* Floating award pill */}
                <div className="cs-award-pill">
                  <span className="cs-award-icon">🏆</span>
                  <div>
                    <div className="cs-award-line1">ESCDA Excellence</div>
                    <div className="cs-award-line2">Award Winner 2024</div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="cs-stats">
                {stats.map((s) => (
                  <div key={s.label} className="cs-stat">
                    <span className="cs-stat-val">{s.value}</span>
                    <span className="cs-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: text content ── */}
            <div className="cs-right">

              {/* Chip */}
              <span className="cs-chip">✦ Award Winning</span>

              {/* Heading */}
              <h2 className="cs-title">
                Customer Service <em>Excellence</em>
              </h2>

              {/* Sub */}
              <p className="cs-subtitle">
                Excellence Award — 2024 ESCDA, France
              </p>

              <p className="cs-desc">
                Recognised globally for delivering an outstanding customer
                experience. Our team is committed to making every beauty journey
                seamless, satisfying, and truly exceptional.
              </p>

              {/* Feature badges */}
              <div className="cs-badges">
                {badges.map((b) => (
                  <div key={b.label} className="cs-badge">
                    <span className="cs-badge-icon">{b.icon}</span>
                    <span className="cs-badge-label">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Certification component */}
              <div className="cs-cert-wrap">
                <Certification />
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cs-section {
    padding: 80px 0 88px;
    background: linear-gradient(150deg, #fff8fb 0%, #ffffff 55%, #fdf0f5 100%);
    position: relative;
    overflow: hidden;
  }

  /* Background blobs */
  .cs-section::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(233,30,140,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Layout ── */
  .cs-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  /* ── LEFT ── */
  .cs-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
  }

  /* Image frame */
  .cs-img-frame {
    position: relative;
    width: 100%;
    max-width: 340px;
  }

  .cs-img-ring {
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    border: 2px dashed rgba(194,24,91,0.25);
    animation: csRotate 18s linear infinite;
  }

  @keyframes csRotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .cs-img-inner {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #fff;
    box-shadow: 0 12px 48px rgba(194,24,91,0.18);
    background: #fce4ec;
  }

  .cs-img {
    object-fit: cover;
  }

  /* Floating award pill */
  .cs-award-pill {
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #fce4ec;
    border-radius: 30px;
    padding: 8px 18px 8px 10px;
    box-shadow: 0 6px 24px rgba(194,24,91,0.14);
    white-space: nowrap;
    z-index: 2;
  }

  .cs-award-icon {
    font-size: 1.4rem;
  }

  .cs-award-line1 {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    color: #c2185b;
    line-height: 1.2;
  }

  .cs-award-line2 {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.62rem;
    color: #999;
    line-height: 1.2;
  }

  /* Stats */
  .cs-stats {
    display: flex;
    gap: 0;
    background: #fff;
    border: 1px solid #fce4ec;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(194,24,91,0.08);
    width: 100%;
    max-width: 340px;
    margin-top: 24px;
  }

  .cs-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 8px;
    border-right: 1px solid #fce4ec;
  }

  .cs-stat:last-child { border-right: none; }

  .cs-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #c2185b;
    line-height: 1;
    margin-bottom: 4px;
  }

  .cs-stat-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.62rem;
    color: #999;
    text-align: center;
    letter-spacing: 0.04em;
  }

  /* ── RIGHT ── */
  .cs-right {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .cs-chip {
    display: inline-block;
    background: #fce4ec;
    color: #c2185b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 20px;
    margin-bottom: 14px;
    align-self: flex-start;
  }

  .cs-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.7rem, 3.5vw, 2.4rem);
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.18;
    margin: 0 0 10px;
  }

  .cs-title em {
    font-style: italic;
    color: #c2185b;
  }

  .cs-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 600;
    color: #c2185b;
    margin: 0 0 14px;
    letter-spacing: 0.02em;
  }

  .cs-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    color: #777;
    line-height: 1.75;
    margin: 0 0 28px;
  }

  /* ── Feature badges ── */
  .cs-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 28px;
  }

  .cs-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1.5px solid #fce4ec;
    border-radius: 20px;
    padding: 6px 14px 6px 10px;
    box-shadow: 0 2px 10px rgba(194,24,91,0.07);
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    cursor: default;
  }

  .cs-badge:hover {
    border-color: #c2185b;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(194,24,91,0.14);
  }

  .cs-badge-icon { font-size: 1rem; }

  .cs-badge-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: #333;
  }

  /* Certification wrapper */
  .cs-cert-wrap {
    margin-top: 4px;
  }

  /* ── Responsive ── */
  @media (max-width: 992px) {
    .cs-wrap {
      grid-template-columns: 1fr;
      gap: 48px;
    }
    .cs-left {
      order: 2;
    }
    .cs-right {
      order: 1;
    }
    .cs-img-frame {
      max-width: 280px;
      margin: 0 auto;
    }
    .cs-stats {
      max-width: 280px;
    }
  }

  @media (max-width: 576px) {
    .cs-section { padding: 48px 0 56px; }
    .cs-title { font-size: 1.6rem; }
    .cs-img-frame { max-width: 220px; }
    .cs-stats { max-width: 100%; }
    .cs-stat-val { font-size: 1.1rem; }
    .cs-badge { padding: 5px 11px 5px 8px; }
    .cs-badge-label { font-size: 0.7rem; }
    .cs-award-pill { padding: 6px 12px 6px 8px; }
    .cs-award-line1 { font-size: 0.65rem; }
    .cs-award-line2 { font-size: 0.56rem; }
  }
`;