"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import Slide4 from '@/app/Components/assets/Slide1.webp'
import Slide3 from '@/app/Components/assets/Slide2.webp'
import Slide2 from '@/app/Components/assets/Slide3.webp'
import Slide1 from '@/app/Components/assets/Slide4.webp'
import image1 from '@/app/Components/assets/matresspro1.jpg'
import image2 from '@/app/Components/assets/matresspro2.jpg'
import image3 from '@/app/Components/assets/matressBanner1.webp'
import image4 from '@/app/Components/assets/matressBanner3.webp'
import './mattressfeature.css'


export default function MattressFeatures() {
    const [content,setContent]=useState(1)
 

    const data = [
        {id:1,title:"Stability Layer" ,subtitle:""}
    ]

    const handleChange = (num)=>{
  console.log(num)
  setContent(num)

    }

  return (
    <>
     <section>
        <div className='MattressFeaturesMainSec'>
            <div className='container'>
                <div>
                    <h2 className='MattressHeading'>See What Make It Miraculous</h2>
                </div>
                <div className='row'>
                    <div className="col-md-8">
                      <div className='MattressImageSec'>
                        <div className='ImageBlock'>
                            <Image src={Slide1} alt=""  className='MattressImg1 MatterssSlide'/>
                            <Image src={Slide2} alt=""  className='MattressImg2 MatterssSlide'/>
                            <Image src={Slide3} alt=""  className='MattressImg3 MatterssSlide'/>
                            <Image src={Slide4} alt=""  className='MattressImg4 MatterssSlide'/>
                            <div className='SpanOverlay'>
                                <span className='span1'onClick={ ()=>handleChange(1)}>1</span>
                                <span className='span2' onClick={ ()=>handleChange(2)}>2</span>
                                <span className='span3' onClick={ ()=>handleChange(3)}>3</span>
                                <span className='span4' onClick={ ()=>handleChange(4)}>4</span>
                            </div>
                        </div>

                      </div>

                    </div>
                    <div className="col-md-4">
                        { content === 1 ?(
                            <div className='MattressSection'>
                                <div >
                                 <h2 className='mattressTitle' >Two cover options</h2>
                                 <p className='mattressSubtitle'>
                                 Go for a Breathable Knit Cover or a Cooling Quilt Top for plush relief from the heat.</p>
                                <div className='MiniImageSec'>
                                <Image src={image1} alt="samplePic" className='miniImage'/>
                                </div>
                                </div>
                            </div>
                        ):""

                        }
                        { content === 2 ?(
                            <div className='MattressSection'>
                                <div className='MattressDetailsSec' >
                                 <h2 className='mattressTitle'> Comfort layer</h2>
                                 <p className='mattressSubtitle' >
                                
Exclusive breathable foam sleeps cool, with the hug and bounce needed for comfort.</p>
<div className='MiniImageSec'>
                                 <Image src={image2} alt="samplePic" className='miniImage'/>
                                </div>
                                </div>
                            </div>
                        ):""

                        }
                        { content === 3 ?(
                            <div className='MattressSection'>
                                <div >
                                 <h2 className='mattressTitle'>Memory foam recovery layer</h2>
                                 <p className='mattressSubtitle'>
                                 Contours to your body to relieve back, hip, and shoulder pressure. </p>
                                 <div className='MiniImageSec'>
                                 <Image src={image3} alt="samplePic" className='miniImage'/>
                                 </div>
                                 </div>
                            </div>
                        ):""

                        }
                        { content === 4 ?(
                            <div className='MattressSection'>
                                <div >
                                 <h2 className='mattressTitle'>Stability Layers</h2>
                                 <p className='mattressSubtitle'>High density foam base provides signature support and durability for all body types </p>
                                 <div className='MiniImageSec'>
                               
                                 <Image src={image4} alt="samplePic" className='miniImage'/>
                                </div>
                                </div>
                            </div>
                        ):""

                        }

                    </div>

                </div>

            </div>


        </div>

     </section>


    </>
  )
}

// "use client";
// import Image from "next/image";
// import React, { useState } from "react";
// import Slide4 from "@/app/Components/assets/Slide1.webp";
// import Slide3 from "@/app/Components/assets/Slide2.webp";
// import Slide2 from "@/app/Components/assets/Slide3.webp";
// import Slide1 from "@/app/Components/assets/Slide4.webp";
// import image1 from "@/app/Components/assets/matresspro1.jpg";
// import image2 from "@/app/Components/assets/matresspro2.jpg";
// import image3 from "@/app/Components/assets/matressBanner1.webp";
// import image4 from "@/app/Components/assets/matressBanner3.webp";

// // ─── Layer data ───────────────────────────────────────────────────────────────
// const layers = [
//   {
//     id: 1,
//     dot: { top: "12%",  left: "52%" },
//     title: "Two Cover Options",
//     subtitle: "Go for a Breathable Knit Cover or a Cooling Quilt Top for plush relief from the heat.",
//     image: image1,
//     emoji: "🧵",
//   },
//   {
//     id: 2,
//     dot: { top: "32%",  left: "28%" },
//     title: "Comfort Layer",
//     subtitle: "Exclusive breathable foam sleeps cool, with the hug and bounce needed for comfort.",
//     image: image2,
//     emoji: "☁️",
//   },
//   {
//     id: 3,
//     dot: { top: "52%",  left: "78%" },
//     title: "Memory Foam Recovery Layer",
//     subtitle: "Contours to your body to relieve back, hip, and shoulder pressure.",
//     image: image3,
//     emoji: "🌙",
//   },
//   {
//     id: 4,
//     dot: { top: "72%",  left: "48%" },
//     title: "Stability Layers",
//     subtitle: "High-density foam base provides signature support and durability for all body types.",
//     image: image4,
//     emoji: "💪",
//   },
// ];

// const slides = [Slide1, Slide2, Slide3, Slide4];

// export default function MattressFeatures() {
//   const [active, setActive] = useState(1);
//   const current = layers.find((l) => l.id === active);

//   return (
//     <>
//       <style>{css}</style>

//       <section className="mf-section">
//         <div className="container">

//           {/* Header */}
//           <div className="mf-header">
//             <span className="mf-chip">✦ Product Details</span>
//             <h2 className="mf-title">See What Makes It <em>Miraculous</em></h2>
//             <p className="mf-sub">Tap any numbered point to explore each layer</p>
//           </div>

//           <div className="mf-body">

//             {/* ── Left: stacked images + hotspot dots ── */}
//             <div className="mf-image-col">
//               <div className="mf-img-stack">
//                 {slides.map((src, i) => (
//                   <Image
//                     key={i}
//                     src={src}
//                     alt={`Layer ${i + 1}`}
//                     className="mf-slide"
//                     priority={i === 0}
//                   />
//                 ))}

//                 {/* Hotspot dots */}
//                 {layers.map((layer) => (
//                   <button
//                     key={layer.id}
//                     className={`mf-dot ${active === layer.id ? "mf-dot-active" : ""}`}
//                     style={{ top: layer.dot.top, left: layer.dot.left }}
//                     onClick={() => setActive(layer.id)}
//                     aria-label={layer.title}
//                   >
//                     {layer.id}
//                     <span className="mf-dot-ring" />
//                     <span className="mf-dot-ring mf-dot-ring2" />
//                   </button>
//                 ))}
//               </div>

//               {/* Dot legend pills */}
//               <div className="mf-legend">
//                 {layers.map((layer) => (
//                   <button
//                     key={layer.id}
//                     className={`mf-legend-pill ${active === layer.id ? "mf-legend-active" : ""}`}
//                     onClick={() => setActive(layer.id)}
//                   >
//                     {layer.id}. {layer.title}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* ── Right: content panel ── */}
//             <div className="mf-detail-col">
//               {current && (
//                 <div className="mf-detail-card" key={current.id}>
//                   {/* Layer number badge */}
//                   <div className="mf-layer-num">Layer {current.id} of {layers.length}</div>

//                   {/* Emoji icon */}
//                   <div className="mf-detail-emoji">{current.emoji}</div>

//                   <h3 className="mf-detail-title">{current.title}</h3>
//                   <p className="mf-detail-sub">{current.subtitle}</p>

//                   {/* Detail image */}
//                   <div className="mf-detail-img-wrap">
//                     <Image
//                       src={current.image}
//                       alt={current.title}
//                       fill
//                       sizes="(max-width: 768px) 90vw, 320px"
//                       className="mf-detail-img"
//                     />
//                   </div>

//                   {/* Nav arrows */}
//                   <div className="mf-nav-arrows">
//                     <button
//                       className="mf-arrow"
//                       onClick={() => setActive((p) => Math.max(1, p - 1))}
//                       disabled={active === 1}
//                     >
//                       ← Prev
//                     </button>
//                     <div className="mf-dots-row">
//                       {layers.map((l) => (
//                         <span
//                           key={l.id}
//                           className={`mf-pip ${active === l.id ? "mf-pip-active" : ""}`}
//                           onClick={() => setActive(l.id)}
//                         />
//                       ))}
//                     </div>
//                     <button
//                       className="mf-arrow"
//                       onClick={() => setActive((p) => Math.min(layers.length, p + 1))}
//                       disabled={active === layers.length}
//                     >
//                       Next →
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');

//   .mf-section {
//     padding: 72px 0 80px;
//     background: linear-gradient(155deg, #fff8fb 0%, #ffffff 50%, #fdf0f5 100%);
//     position: relative;
//     overflow: hidden;
//   }

//   .mf-section::before {
//     content: '';
//     position: absolute;
//     top: -100px; right: -100px;
//     width: 400px; height: 400px;
//     border-radius: 50%;
//     background: radial-gradient(circle, rgba(233,30,140,0.06) 0%, transparent 70%);
//     pointer-events: none;
//   }

//   /* ── Header ── */
//   .mf-header {
//     text-align: center;
//     margin-bottom: 52px;
//   }

//   .mf-chip {
//     display: inline-block;
//     background: #fce4ec;
//     color: #c2185b;
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.7rem;
//     font-weight: 700;
//     letter-spacing: 0.16em;
//     text-transform: uppercase;
//     padding: 5px 16px;
//     border-radius: 20px;
//     margin-bottom: 14px;
//   }

//   .mf-title {
//     font-family: 'Playfair Display', serif;
//     font-size: clamp(1.8rem, 4vw, 2.6rem);
//     font-weight: 700;
//     color: #1a1a1a;
//     line-height: 1.18;
//     margin: 0 0 10px;
//   }

//   .mf-title em {
//     font-style: italic;
//     color: #c2185b;
//   }

//   .mf-sub {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.88rem;
//     color: #999;
//     margin: 0;
//   }

//   /* ── Layout ── */
//   .mf-body {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 40px;
//     align-items: start;
//   }

//   /* ── Image column ── */
//   .mf-image-col {
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//   }

//   .mf-img-stack {
//     position: relative;
//     border-radius: 20px;
//     overflow: hidden;
//     box-shadow: 0 12px 40px rgba(194,24,91,0.12);
//   }

//   .mf-slide {
//     width: 100%;
//     height: auto;
//     display: block;
//   }

//   /* ── Hotspot dots ── */
//   .mf-dot {
//     position: absolute;
//     width: 36px;
//     height: 36px;
//     border-radius: 50%;
//     background: linear-gradient(135deg, #e91e8c, #c2185b);
//     border: 2.5px solid #fff;
//     color: #fff;
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.82rem;
//     font-weight: 800;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transform: translate(-50%, -50%);
//     transition: transform 0.25s, box-shadow 0.25s;
//     z-index: 10;
//     box-shadow: 0 2px 12px rgba(194,24,91,0.35);
//   }

//   .mf-dot:hover,
//   .mf-dot-active {
//     transform: translate(-50%, -50%) scale(1.2);
//     box-shadow: 0 4px 20px rgba(194,24,91,0.55);
//     background: linear-gradient(135deg, #ad1457, #880e4f);
//   }

//   /* Pulsing rings */
//   .mf-dot-ring {
//     position: absolute;
//     inset: -4px;
//     border-radius: 50%;
//     border: 2px solid #e91e8c;
//     opacity: 0;
//     transform: scale(0.6);
//     animation: mfWave 2s ease-out infinite;
//   }

//   .mf-dot-ring2 {
//     animation-delay: 0.7s;
//   }

//   @keyframes mfWave {
//     0%   { opacity: 0.7; transform: scale(0.7); }
//     70%  { opacity: 0.15; transform: scale(1.8); }
//     100% { opacity: 0; transform: scale(2.2); }
//   }

//   /* ── Legend pills ── */
//   .mf-legend {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 8px;
//   }

//   .mf-legend-pill {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.72rem;
//     font-weight: 500;
//     padding: 5px 14px;
//     border-radius: 20px;
//     border: 1.5px solid #e0c0cc;
//     background: #fff;
//     color: #888;
//     cursor: pointer;
//     transition: all 0.2s;
//     white-space: nowrap;
//   }

//   .mf-legend-pill:hover { border-color: #c2185b; color: #c2185b; }

//   .mf-legend-active {
//     background: #c2185b !important;
//     color: #fff !important;
//     border-color: #c2185b !important;
//     font-weight: 700 !important;
//   }

//   /* ── Detail card ── */
//   .mf-detail-col {
//     position: sticky;
//     top: 80px;
//   }

//   .mf-detail-card {
//     background: #fff;
//     border-radius: 20px;
//     padding: 32px 28px 28px;
//     box-shadow: 0 8px 32px rgba(194,24,91,0.10);
//     border: 1px solid #fce4ec;
//     animation: mfSlideIn 0.35s ease both;
//   }

//   @keyframes mfSlideIn {
//     from { opacity: 0; transform: translateY(12px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }

//   .mf-layer-num {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.65rem;
//     font-weight: 700;
//     letter-spacing: 0.18em;
//     text-transform: uppercase;
//     color: #c2185b;
//     background: #fce4ec;
//     display: inline-block;
//     padding: 3px 12px;
//     border-radius: 20px;
//     margin-bottom: 16px;
//   }

//   .mf-detail-emoji {
//     font-size: 2.4rem;
//     margin-bottom: 12px;
//     line-height: 1;
//   }

//   .mf-detail-title {
//     font-family: 'Playfair Display', serif;
//     font-size: 1.6rem;
//     font-weight: 700;
//     color: #1a1a1a;
//     line-height: 1.2;
//     margin: 0 0 12px;
//   }

//   .mf-detail-sub {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.92rem;
//     color: #666;
//     line-height: 1.7;
//     margin: 0 0 22px;
//   }

//   .mf-detail-img-wrap {
//     position: relative;
//     width: 100%;
//     height: 200px;
//     border-radius: 14px;
//     overflow: hidden;
//     background: #fce4ec;
//     margin-bottom: 22px;
//   }

//   .mf-detail-img {
//     object-fit: cover;
//   }

//   /* ── Nav arrows ── */
//   .mf-nav-arrows {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 12px;
//     padding-top: 4px;
//   }

//   .mf-arrow {
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.78rem;
//     font-weight: 600;
//     color: #c2185b;
//     background: none;
//     border: 1.5px solid #c2185b;
//     padding: 7px 16px;
//     border-radius: 20px;
//     cursor: pointer;
//     transition: background 0.2s, color 0.2s;
//   }

//   .mf-arrow:hover:not(:disabled) {
//     background: #c2185b;
//     color: #fff;
//   }

//   .mf-arrow:disabled {
//     opacity: 0.3;
//     cursor: not-allowed;
//   }

//   .mf-dots-row {
//     display: flex;
//     gap: 7px;
//     align-items: center;
//   }

//   .mf-pip {
//     width: 8px;
//     height: 8px;
//     border-radius: 50%;
//     background: #e0c0cc;
//     cursor: pointer;
//     transition: background 0.2s, transform 0.2s;
//   }

//   .mf-pip-active {
//     background: #c2185b;
//     transform: scale(1.35);
//   }

//   /* ── Responsive ── */
//   @media (max-width: 992px) {
//     .mf-body {
//       grid-template-columns: 1fr;
//       gap: 28px;
//     }
//     .mf-detail-col {
//       position: static;
//     }
//     .mf-detail-img-wrap {
//       height: 220px;
//     }
//   }

//   @media (max-width: 576px) {
//     .mf-section { padding: 44px 0 52px; }
//     .mf-header { margin-bottom: 32px; }
//     .mf-detail-card { padding: 22px 18px 20px; }
//     .mf-detail-title { font-size: 1.3rem; }
//     .mf-detail-img-wrap { height: 170px; }
//     .mf-dot { width: 30px; height: 30px; font-size: 0.72rem; }
//     .mf-legend { display: none; } /* hides on very small screens — dots on image are enough */
//     .mf-arrow { padding: 6px 12px; font-size: 0.72rem; }
//   }
// `;