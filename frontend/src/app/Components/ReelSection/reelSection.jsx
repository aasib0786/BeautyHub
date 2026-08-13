// "use client";

// import { useEffect, useRef, useState } from "react";
// import styles from "./ReelSection.module.css"; // CSS Module
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { axiosInstance } from "@/app/utils/axiosInstance";
// import { addToCart, AddToCartToServer } from "@/app/redux/slice/cartSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { useRouter } from "next/navigation";



// export default function ReelSection() {
//   const [videoData, setVideos] = useState([])
//   const videoRefs = useRef([]);
//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const containerRef = useRef(null);
// const router = useRouter();
//   const handleMouseEnter = (index) => {
//     if (expandedIndex !== null) return; // Don't play on hover if a video is expanded
//     videoRefs.current.forEach((video, i) => {
//       if (video) {
//         if (i === index) {
//           video.play();
//         } else {
//           video.pause();
//         }
//       }
//     });
//   };

//   const handleMouseLeave = () => {
//     if (expandedIndex !== null) return; // Don't pause on leave if a video is expanded
//     videoRefs.current.forEach((video) => video && video.pause());
//   };

//   const toggleExpand = (index) => {
//     if (expandedIndex === index) {
//       // If clicking the already expanded video, collapse it
//       setExpandedIndex(null);
//     } else {
//       // Expand the clicked video
//       setExpandedIndex(index);
//       // Play the video when expanded
//       videoRefs.current[index]?.play();
//       // Pause all other videos
//       videoRefs.current.forEach((video, i) => {
//         if (video && i !== index) video.pause();
//       });
//     }
//   };

//   // Close expanded video when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target) &&
//         expandedIndex !== null
//       ) {
//         setExpandedIndex(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [expandedIndex]);

//   useEffect(() => {
//     const handleAutoPlay = () => {
//       const isSmallScreen = window.innerWidth <= 768;
//       videoRefs.current.forEach((video) => {
//         if (video) {
//           if (isSmallScreen && expandedIndex === null) {
//             video.play().catch((e) => {
//               console.warn("Mobile autoplay failed:", e);
//             });
//           } else if (!isSmallScreen && expandedIndex === null) {
//             video.pause();
//           }
//         }
//       });
//     };

//     handleAutoPlay();
//     window.addEventListener("resize", handleAutoPlay);

//     return () => {
//       window.removeEventListener("resize", handleAutoPlay);
//     };
//   }, [expandedIndex]);

//   const fetchVideos = async () => {
//     try {
//         const response = await axiosInstance.get('/api/v1/video/get-all-videos');
//         if (response.status === 200) {
//             setVideos(response?.data?.videos);
//             console.log(response?.data?.videos);
            
//         }
//     } catch (error) {
//         toast.error('Error fetching videos');
//         console.error('Error fetching videos:', error);
//     }
// };  

// const {user} = useSelector((state) => state.auth);
// const dispatch = useDispatch();

// const handleAddToCart=(e,product)=>{
//   e.stopPropagation();
//   let quantity = 1;
  
//   if (quantity > product.stock) {
//     toast.error("Out of stock");
//     return;
//   }

//   if(user?.email){
//     dispatch(AddToCartToServer({productId:product._id,quantity}))
//     toast.success("Product added to cart",{
//       position: "bottom-right",
//     })}
//     else{
//     dispatch(
//       addToCart({
//         productId: product._id,
//         quantity,
//         image: product.images[0],
//         finalPrice: product.finalPrice,
//         name: product.productName,
//         dimensionsCm: product.dimensionsCm,
//         stock: product.stock,
//         discount: product.discount,
//         price: product.price,
//       })
//     );
//     toast.success("Product added to cart", {
//       position: "bottom-right",
//     });
//   }
// }
//   useEffect(() => {
//     fetchVideos();
// }, []);
//   return (
//     <section className="reel-section mt-3" ref={containerRef}>
//   <div className="container">
//     <Swiper className="pt-3 pb-5"
//       modules={[Navigation, Pagination]}
//       spaceBetween={15}
//       pagination={{ clickable: true }}
//       // pagination={false}
//       breakpoints={{
//         320: { slidesPerView: 2 },
//         576: { slidesPerView: 3 },
//         768: { slidesPerView: 4 },
//         992: { slidesPerView: 5 },
//         1200: { slidesPerView: 6 },
//       }}
//     >
//       {videoData.map((item, index) => (
//         <SwiperSlide key={index}>
//           <div
//             className="d-flex flex-column align-items-center position-relative"
//             onClick={() => toggleExpand(index)}
//           >
//             <div
//               onMouseEnter={() => handleMouseEnter(index)}
//               onMouseLeave={handleMouseLeave}
//               className={`${styles.videoContainer} ${
//                 expandedIndex === index ? styles.expanded : ""
//               } ${
//                 expandedIndex !== null && expandedIndex !== index
//                   ? styles.shrunken
//                   : ""
//               }`}
//             >
//               <video
//                 ref={(el) => (videoRefs.current[index] = el)}
//                 src={item?.videoUrl}
//                 muted
//                 loop
//                 playsInline
//                 className={`${styles.videoElement} rounded shadow-sm`}
//               />
//               <div
//                 className={`position-absolute bottom-0 start-0 w-100 p-2 bg-dark d-flex bg-opacity-75 text-white justify-content-center rounded-bottom ${styles.overlay}`}
//               >
//                 <div className="ms-2 d-grid">
//                   <p className="small mb-1">{item?.productId?.productName}</p>
//                   <p className="fw-bold mb-1">₹{item?.productId?.finalPrice}</p>
//                   <div className="d-flex align-items-center">
//                     {/* <button
//                       className="btn btn-sm"
//                       style={{ background: "var(--brown)", color: "white" }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAddToCart(e, item?.productId);
//                       }}
//                     >
//                       Add to Cart
//                     </button> */}
//                      <button
//                       className="btn btn-sm"
//                       style={{ background: "var(--brown)", color: "white" }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                        router.push(`/Pages/products/${item?.productId?._id}`);
//                       }}
//                     >
//                      View Product
//                     </button>
//                     <i
//                       className={`fa fa-eye ms-3 ${styles.cursorPointer}`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleExpand(index);
//                       }}
//                     ></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   </div>
// </section>

//   );
// }















// // "use client";

// // import { useEffect, useRef, useState } from "react";
// // import styles from "./ReelSection.module.css"; // CSS Module
// // import Link from "next/link";

// // const videoData = [
// //   {
// //     src: "/videos/video1.mp4",
// //     price: "$49.99",
// //     details: "Elegant Red Dress",
// //     description: "Perfect for evening parties.",
// //   },
// //   {
// //     src: "/videos/video2.mp4",
// //     price: "$39.99",
// //     details: "Casual Summer",
// //     description: "Light and comfortable.",
// //   },
// //   {
// //     src: "/videos/video3.mp4",
// //     price: "$59.99",
// //     details: "Formal Black Gown",
// //     description: "Ideal for formal events.",
// //   },
// //   {
// //     src: "/videos/video4.mp4",
// //     price: "$29.99",
// //     details: "Floral Beach Dress",
// //     description: "Great for vacations.",
// //   },
// //   {
// //     src: "/videos/video5.mp4",
// //     price: "$45.99",
// //     details: "Chic Office Wear",
// //     description: "Stylish and professional.",
// //   },
// //   {
// //     src: "/videos/video6.mp4",
// //     price: "$34.99",
// //     details: "Boho Maxi Dress",
// //     description: "Relaxed and trendy.",
// //   },
// // ];

// // export default function ReelSection() {
// //   const videoRefs = useRef([]);
// //   const [expandedIndex, setExpandedIndex] = useState(null);

// //   const handleMouseEnter = (index) => {
// //     // Optional hover effect for non-mobile users to play the video
// //     videoRefs.current.forEach((video, i) => {
// //       if (video) {
// //         if (i === index) {
// //           video.play();
// //         } else {
// //           video.pause();
// //         }
// //       }
// //     });
// //   };

// //   const handleMouseLeave = () => {
// //     // Stop video on mouse leave for non-mobile users
// //     videoRefs.current.forEach((video) => video && video.pause());
// //   };

// //   const toggleExpand = (index) => {
// //     // Toggle the expanded state for the clicked video
// //     setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
// //   };

// //   useEffect(() => {
// //     // Handle autoplay based on screen size (mobile vs desktop)
// //     const handleAutoPlay = () => {
// //       const isSmallScreen = window.innerWidth <= 768;
// //       videoRefs.current.forEach((video) => {
// //         if (video) {
// //           if (isSmallScreen) {
// //             video.play().catch((e) => {
// //               console.warn("Mobile autoplay failed:", e);
// //             });
// //           } else {
// //             video.pause();
// //           }
// //         }
// //       });
// //     };

// //     handleAutoPlay(); // Run on mount

// //     window.addEventListener("resize", handleAutoPlay);

// //     return () => {
// //       window.removeEventListener("resize", handleAutoPlay);
// //     };
// //   }, []);

// //   return (
// //     <section className="reel-section mt-3">
// //       <div className="container">
// //         <div className="row g-3">
// //           {videoData.map((item, index) => (
// //             <div
// //               key={index}
// //               className={`col-md-2 col-sm-4 col-6 d-flex flex-column align-items-center position-relative`}
// //             >
// //               <div
// //                 onMouseEnter={() => handleMouseEnter(index)}
// //                 onMouseLeave={handleMouseLeave}
// //                 className={`${styles.videoContainer} ${expandedIndex === index ? styles.expanded : ""}`}
// //               >
// //                 <video
// //                   ref={(el) => (videoRefs.current[index] = el)}
// //                   src={item.src}
// //                   muted
// //                   loop
// //                   playsInline
// //                   className={`${styles.videoElement} rounded shadow-sm`}
// //                 />
// //                 <div
// //                   className={`position-absolute bottom-0 start-0 w-100 p-2 bg-dark d-flex bg-opacity-75 text-white justify-content-center rounded-bottom ${styles.overlay}`}
// //                 >
// //                   <div className="ms-2 d-grid">
// //                     <p className="small mb-1">{item.details}</p>
// //                     <p className="fw-bold mb-1">{item.price}</p>
// //                     <div className="d-flex align-items-center">
// //                       <Link href={"/Pages/videosec"}>
// //                         <button
// //                           className="btn btn-sm"
// //                           style={{
// //                             background: "var(--brown)",
// //                             color: "white",
// //                           }}
// //                         >
// //                           Add to Cart
// //                         </button>
// //                       </Link>
// //                       <i
// //                         className={`fa fa-eye ms-3 ${styles.cursorPointer}`}
// //                         onClick={() => toggleExpand(index)}
// //                       ></i>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }


"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ReelSection.module.css";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { addToCart, AddToCartToServer } from "@/app/redux/slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

export default function ReelSection() {
  const [videoData, setVideos] = useState([]);
  const [loading, setLoading]  = useState(true);
  const videoRefs              = useRef([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [mutedMap, setMutedMap]           = useState({});
  const containerRef = useRef(null);
  const router       = useRouter();
  const { user }     = useSelector((state) => state.auth);
  const dispatch     = useDispatch();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/video/get-all-videos");
      if (response.status === 200) {
        setVideos(response?.data?.videos || []);
      }
    } catch {
      toast.error("Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  // ── Video controls ─────────────────────────────────────────────────────────
  const playOnly = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) video.play().catch(() => {});
      else video.pause();
    });
  };

  const pauseAll = () => {
    videoRefs.current.forEach((v) => v && v.pause());
  };

  const handleMouseEnter = (index) => {
    if (expandedIndex !== null) return;
    playOnly(index);
  };

  const handleMouseLeave = () => {
    if (expandedIndex !== null) return;
    pauseAll();
  };

  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      pauseAll();
    } else {
      setExpandedIndex(index);
      playOnly(index);
    }
  };

  const toggleMute = (e, index) => {
    e.stopPropagation();
    const video = videoRefs.current[index];
    if (!video) return;
    video.muted = !video.muted;
    setMutedMap((prev) => ({ ...prev, [index]: video.muted }));
  };

  // ── Mobile autoplay ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleAutoPlay = () => {
      const isMobile = window.innerWidth <= 768;
      videoRefs.current.forEach((video) => {
        if (!video) return;
        if (isMobile && expandedIndex === null) {
          video.play().catch(() => {});
        } else if (!isMobile && expandedIndex === null) {
          video.pause();
        }
      });
    };
    handleAutoPlay();
    window.addEventListener("resize", handleAutoPlay);
    return () => window.removeEventListener("resize", handleAutoPlay);
  }, [expandedIndex, videoData]);

  // ── Click outside to collapse ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && expandedIndex !== null) {
        setExpandedIndex(null);
        pauseAll();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expandedIndex]);

  // ── Cart ───────────────────────────────────────────────────────────────────
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!product) return;
    if (product.stock < 1) { toast.error("Out of stock"); return; }
    if (user?.email) {
      dispatch(AddToCartToServer({ productId: product._id, quantity: 1 }));
    } else {
      dispatch(addToCart({
        productId:     product._id,
        quantity:      1,
        image:         product.images?.[0],
        finalPrice:    product.finalPrice,
        name:          product.productName,
        dimensionsCm:  product.dimensionsCm,
        stock:         product.stock,
        discount:      product.discount,
        price:         product.price,
      }));
    }
    toast.success("Added to cart!", { position: "bottom-right" });
  };

  // ── Skeleton ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section style={{ padding: "32px 0 48px", background: "#fff8fb" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={chipStyle}>✨ Explore</span>
            <h2 style={headingStyle}>Top Picks For You</h2>
            <p style={subStyle}>Curated beauty collections just for you</p>
          </div>
          <div style={{ display: "flex", gap: 14, overflowX: "hidden" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={skeletonStyle} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!videoData.length) return null;

  return (
    <>
      <style>{sectionCSS}</style>

      <section className="bh-reel-section" ref={containerRef}>
        <div className="container">

          {/* Section header */}
          <div className="bh-reel-header">
            <span className="bh-reel-chip">✨ Explore</span>
            <h2 className="bh-reel-title">Top Picks For You</h2>
            <p className="bh-reel-sub">Curated beauty collections just for you</p>
          </div>

          <Swiper
            className="bh-swiper pb-5"
            modules={[Navigation, Pagination]}
            spaceBetween={14}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 2 },
              576: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
              1200: { slidesPerView: 6 },
            }}
          >
            {videoData.map((item, index) => {
              const product   = item?.productId;
              const isExpanded = expandedIndex === index;
              const isShrunken = expandedIndex !== null && !isExpanded;
              const isMuted    = mutedMap[index] !== false; // default muted

              return (
                <SwiperSlide key={index}>
                  <div
                    className={`bh-reel-card ${isExpanded ? "bh-expanded" : ""} ${isShrunken ? "bh-shrunken" : ""}`}
                    onClick={() => toggleExpand(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Video */}
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={item?.videoUrl}
                      muted
                      loop
                      playsInline
                      className="bh-reel-video"
                    />

                    {/* Gradient overlay */}
                    <div className="bh-reel-overlay" />

                    {/* Mute toggle */}
                    <button
                      className="bh-mute-btn"
                      onClick={(e) => toggleMute(e, index)}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? "🔇" : "🔊"}
                    </button>

                    {/* Bottom info */}
                    <div className="bh-reel-info">
                      {product?.productName && (
                        <p className="bh-reel-name">{product.productName}</p>
                      )}
                      {product?.finalPrice && (
                        <p className="bh-reel-price">₹{product.finalPrice}</p>
                      )}
                      <div className="bh-reel-actions">
                        <button
                          className="bh-btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/Pages/products/${product?._id}`);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="bh-btn-cart"
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          + Cart
                        </button>
                      </div>
                    </div>

                    {/* Expand icon */}
                    <button
                      className="bh-expand-btn"
                      onClick={(e) => { e.stopPropagation(); toggleExpand(index); }}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? "✕" : "⛶"}
                    </button>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
    </>
  );
}

// ─── Inline styles for skeleton (before CSS loads) ───────────────────────────
const chipStyle    = { display: "inline-block", background: "#fce4ec", color: "#c2185b", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", padding: "4px 14px", borderRadius: 20, marginBottom: 10 };
const headingStyle = { fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", margin: "6px 0 8px" };
const subStyle     = { color: "#888", fontSize: "0.88rem", margin: 0 };
const skeletonStyle = { flexShrink: 0, width: 160, height: 280, borderRadius: 16, background: "linear-gradient(90deg,#fce4ec 25%,#fce8ef 50%,#fce4ec 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" };

// ─── Section CSS ──────────────────────────────────────────────────────────────
const sectionCSS = `
  .bh-reel-section {
    padding: 36px 0 52px;
    background: linear-gradient(to bottom, #fff8fb, #ffffff);
  }

  .bh-reel-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .bh-reel-chip {
    display: inline-block;
    background: #fce4ec;
    color: #c2185b;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 4px 16px;
    border-radius: 20px;
    margin-bottom: 10px;
  }

  .bh-reel-title {
    font-family: 'Georgia', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 6px 0 8px;
  }

  .bh-reel-sub {
    color: #888;
    font-size: 0.88rem;
    margin: 0;
  }

  /* ── Card ── */
  .bh-reel-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 9 / 16;
    background: #1a1a1a;
    transition: transform 0.35s ease, box-shadow 0.35s ease, opacity 0.35s ease;
    box-shadow: 0 4px 18px rgba(0,0,0,0.12);
  }

  .bh-reel-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 10px 32px rgba(194,24,91,0.18);
  }

  .bh-reel-card.bh-expanded {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    width: min(340px, 90vw);
    height: min(600px, 85vh);
    z-index: 1050;
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.55);
    aspect-ratio: unset;
  }

  .bh-reel-card.bh-shrunken {
    opacity: 0.35;
    transform: scale(0.94);
    pointer-events: none;
  }

  /* ── Video ── */
  .bh-reel-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* ── Gradient overlay ── */
  .bh-reel-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.82) 0%,
      rgba(0,0,0,0.2) 45%,
      transparent 70%
    );
    pointer-events: none;
  }

  /* ── Bottom info ── */
  .bh-reel-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 10px 14px;
    color: #fff;
  }

  .bh-reel-name {
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 0 0 2px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .bh-reel-price {
    font-size: 0.88rem;
    font-weight: 800;
    color: #ffd6e7;
    margin: 0 0 8px;
  }

  .bh-reel-actions {
    display: flex;
    gap: 6px;
  }

  .bh-btn-view {
    flex: 1;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 5px 8px;
    border-radius: 8px;
    border: 1.5px solid rgba(255,255,255,0.7);
    background: transparent;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s;
  }
  .bh-btn-view:hover { background: rgba(255,255,255,0.15); }

  .bh-btn-cart {
    flex: 1;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 5px 8px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #e91e8c, #c2185b);
    color: #fff;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .bh-btn-cart:hover { opacity: 0.88; }

  /* ── Mute button ── */
  .bh-mute-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0,0,0,0.45);
    border: none;
    color: #fff;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    transition: background 0.2s;
    z-index: 2;
  }
  .bh-mute-btn:hover { background: rgba(0,0,0,0.7); }

  /* ── Expand button ── */
  .bh-expand-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0,0,0,0.45);
    border: none;
    color: #fff;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    transition: background 0.2s;
    z-index: 2;
  }
  .bh-expand-btn:hover { background: rgba(194,24,91,0.8); }

  /* ── Swiper overrides ── */
  .bh-swiper .swiper-pagination-bullet { background: #c2185b; }
  .bh-swiper .swiper-button-prev,
  .bh-swiper .swiper-button-next {
    color: #c2185b;
    background: rgba(255,255,255,0.9);
    width: 34px;
    height: 34px;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  }
  .bh-swiper .swiper-button-prev::after,
  .bh-swiper .swiper-button-next::after { font-size: 0.85rem; font-weight: 800; }

  /* ── Backdrop when expanded ── */
  .bh-reel-card.bh-expanded::before {
    content: '';
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: -1;
    backdrop-filter: blur(4px);
  }

  /* ── Responsive ── */
  @media (max-width: 576px) {
    .bh-reel-title { font-size: 1.5rem; }
    .bh-reel-card.bh-expanded {
      width: 90vw;
      height: 75vh;
    }
  }
`;