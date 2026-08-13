'use client'

import Link from 'next/link'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import './carousel.css'

const slides = [
  {
    id: 1,
    tag: '✨ NEW SEASON GLOW',
    heading: 'Radiant Skincare\n& Hydration Serum',
    subtext: 'Infused with Rosehip Oil & Hyaluronic Acid for 24H luminous skin bounce',
    badges: ['100% Organic', 'Dermatologist Approved', 'Vegan'],
    offer: 'FLAT 30% OFF',
    codeLabel: 'Use Code:',
    code: 'GLOW30',
    btnText: 'Shop Skincare',
    link: '/Pages/products/all-products',
    bgGradient: 'linear-gradient(135deg, #2b0818 0%, #4a0e2e 50%, #17040d 100%)',
    glowColor: '#e8607a',
    accent: '#f472b6',
    pattern: 'radial-grid',
  },
  {
    id: 2,
    tag: '💄 BESTSELLER COLLECTION',
    heading: 'Luxury Lip Velvet\n& Matte Pigments',
    subtext: 'Smudge-proof, weightless formula available in 24 iconic high-fashion shades',
    badges: ['Cruelty Free', '16H Longwear', 'Non-Drying'],
    offer: 'BUY 2 GET 1 FREE',
    codeLabel: 'Use Code:',
    code: 'LIP3FOR2',
    btnText: 'Explore Lipsticks',
    link: '/Pages/products/all-products',
    bgGradient: 'linear-gradient(135deg, #1c050e 0%, #3d091e 50%, #700f2e 100%)',
    glowColor: '#f43f5e',
    accent: '#fb7185',
    pattern: 'circles',
  },
  {
    id: 3,
    tag: '🌿 BOTANICAL ESSENTIALS',
    heading: 'Swiss Botanical\nCellular Repair',
    subtext: 'Revitalize tired skin with deep-repair bioactive plant cell nutrients',
    badges: ['Paraben Free', 'Swiss Formulated', 'Hypoallergenic'],
    offer: 'UP TO 45% OFF',
    codeLabel: 'On orders > ₹999 · Use:',
    code: 'SWISS45',
    btnText: 'Order Now',
    link: '/Pages/products/all-products',
    bgGradient: 'linear-gradient(135deg, #091a18 0%, #123832 50%, #061210 100%)',
    glowColor: '#10b981',
    accent: '#34d399',
    pattern: 'mesh',
  },
  {
    id: 4,
    tag: '🌟 GLAMOROUS EVENING',
    heading: 'Celestial Eye Shadow\n& Liquid Liner',
    subtext: 'High-shine metallic pearls & intense smudge-proof liquid definition',
    badges: ['Waterproof', 'Smudge Proof', 'Silk Finish'],
    offer: 'FLAT 25% OFF',
    codeLabel: 'Use Code:',
    code: 'GLAM25',
    btnText: 'Shop Makeup',
    link: '/Pages/products/all-products',
    bgGradient: 'linear-gradient(135deg, #1f0b29 0%, #431259 50%, #12051a 100%)',
    glowColor: '#a855f7',
    accent: '#c084fc',
    pattern: 'stars',
  },
  {
    id: 5,
    tag: '🌸 HAIR CARE RITUAL',
    heading: 'Golden Argan Hair\n& Scalp Elixirs',
    subtext: 'Transform dull frizz into silky hair with cold-pressed Moroccan Argan Oil',
    badges: ['Sulfate Free', 'Heat Protectant', 'Deep Repair'],
    offer: 'FLAT ₹200 OFF',
    codeLabel: 'Use Code:',
    code: 'HAIR200',
    btnText: 'Shop Haircare',
    link: '/Pages/products/all-products',
    bgGradient: 'linear-gradient(135deg, #261708 0%, #52300b 50%, #140b03 100%)',
    glowColor: '#f59e0b',
    accent: '#fbbf24',
    pattern: 'waves',
  },
]

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState('next')
  const [isPaused, setIsPaused] = useState(false)

  // Touch handlers for mobile swipe
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const goTo = useCallback(
    (index, dir = 'next') => {
      if (animating) return
      setDirection(dir)
      setAnimating(true)
      setTimeout(() => {
        setCurrentIndex(index)
        setAnimating(false)
      }, 550)
    },
    [animating]
  )

  const goToPrev = useCallback(() => {
    const prev = currentIndex === 0 ? slides.length - 1 : currentIndex - 1
    goTo(prev, 'prev')
  }, [currentIndex, goTo])

  const goToNext = useCallback(() => {
    const next = (currentIndex + 1) % slides.length
    goTo(next, 'next')
  }, [currentIndex, goTo])

  // Auto-slide interval
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [goToNext, isPaused])

  // Copy coupon code to clipboard
  const handleCopyCode = (code, e) => {
    e.stopPropagation()
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code)
      toast.success(`Coupon code "${code}" copied! 🎁`)
    }
  }

  // Touch Swipe Events
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current
    if (distance > 50) {
      goToNext()
    } else if (distance < -50) {
      goToPrev()
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  const slide = slides[currentIndex]

  return (
    <div
      className="bh-noimg-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Background Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`bh-noimg-bg ${i === currentIndex ? 'bh-bg-active' : ''}`}
          style={{ background: s.bgGradient }}
        >
          {/* Animated Ambient Glow Blobs */}
          <div
            className="bh-glow-orb bh-orb-1"
            style={{ background: s.glowColor }}
          />
          <div
            className="bh-glow-orb bh-orb-2"
            style={{ background: s.accent }}
          />

          {/* Abstract SVG Decorative Mesh Overlay */}
          <div className="bh-pattern-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id={`grid-${s.id}`}
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={s.accent}
                    strokeWidth="0.5"
                    strokeOpacity="0.12"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="1"
                    fill={s.accent}
                    fillOpacity="0.2"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${s.id})`} />
            </svg>
          </div>
        </div>
      ))}

      {/* Slide Content */}
      <div className={`bh-noimg-content ${animating ? `bh-exit-${direction}` : 'bh-enter'}`}>
        <div className="bh-noimg-text-block">
          {/* Tag Pill */}
          <div className="bh-noimg-tag-wrap">
            <span
              className="bh-noimg-tag"
              style={{
                background: `linear-gradient(90deg, ${slide.glowColor}, ${slide.accent})`,
              }}
            >
              {slide.tag}
            </span>
          </div>

          {/* Heading */}
          <h2 className="bh-noimg-heading">
            {slide.heading.split('\n').map((line, i) => (
              <span key={i} className="bh-heading-line">
                {line}
              </span>
            ))}
          </h2>

          {/* Subtext */}
          <p className="bh-noimg-subtext">{slide.subtext}</p>

          {/* Feature Badges */}
          <div className="bh-noimg-badges">
            {slide.badges.map((badge, idx) => (
              <span key={idx} className="bh-badge">
                <span className="bh-badge-dot" style={{ background: slide.accent }} />
                {badge}
              </span>
            ))}
          </div>

          {/* Offer & Code Box */}
          <div className="bh-noimg-bottom-row">
            <div
              className="bh-noimg-offer-box"
              onClick={(e) => handleCopyCode(slide.code, e)}
              title="Click to copy coupon code"
            >
              <div className="bh-offer-text-group">
                <span className="bh-noimg-offer">{slide.offer}</span>
                <span className="bh-noimg-code-label">{slide.codeLabel}</span>
              </div>
              <div
                className="bh-noimg-code-pill"
                style={{ borderColor: slide.accent }}
              >
                <span className="bh-noimg-code" style={{ color: slide.accent }}>
                  {slide.code}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={slide.accent}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="bh-copy-icon"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
            </div>

            {/* CTA Button */}
            <Link href={slide.link} passHref>
              <button
                className="bh-noimg-cta"
                style={{
                  background: `linear-gradient(135deg, ${slide.glowColor}, ${slide.accent})`,
                }}
              >
                <span>{slide.btnText}</span>
                <span className="bh-cta-arrow">→</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative Luxury Graphic Art (No Image File Needed) */}
        <div className="bh-noimg-art-side">
          <div
            className="bh-art-card"
            style={{
              borderColor: `${slide.accent}33`,
              background: `radial-gradient(circle at 50% 50%, ${slide.glowColor}22 0%, rgba(0,0,0,0.5) 100%)`,
            }}
          >
            <div className="bh-art-inner">
              <div
                className="bh-art-ring bh-ring-1"
                style={{ borderColor: `${slide.accent}44` }}
              />
              <div
                className="bh-art-ring bh-ring-2"
                style={{ borderColor: `${slide.glowColor}33` }}
              />
              <div className="bh-art-content">
                <span className="bh-art-icon">✨</span>
                <span className="bh-art-brand">BEAUTY HUB</span>
                <span className="bh-art-discount">{slide.offer}</span>
                <span className="bh-art-sub">EXCLUSIVES</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Arrows */}
      <button
        className="bh-noimg-nav bh-prev"
        onClick={goToPrev}
        aria-label="Previous slide"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        className="bh-noimg-nav bh-next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="bh-noimg-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`bh-noimg-dot ${i === currentIndex ? 'bh-dot-active' : ''}`}
            onClick={() => goTo(i, i > currentIndex ? 'next' : 'prev')}
            style={{
              background: i === currentIndex ? slide.accent : 'rgba(255,255,255,0.3)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bh-noimg-progress-bar" key={currentIndex}>
        <div
          className={`bh-noimg-progress-fill ${isPaused ? 'bh-paused' : ''}`}
          style={{ background: slide.accent }}
        />
      </div>
    </div>
  )
}

export default Carousel