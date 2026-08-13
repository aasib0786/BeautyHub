// "use client";

// import Image from "next/image";
// import React from "react";
// import Banner from "@/app/Components/assets/ReviewBanner.webp";
// import Shot from "@/app/Components/assets/shot.webp";
// import "./review.css";
// import pic1 from "@/app/Components/assets/testimonial2.jpg";
// import pic2 from "@/app/Components/assets/testimonial3.jpeg";
// import pic3 from "@/app/Components/assets/testimonial4.jpeg";
// import pic4 from "@/app/Components/assets/testimonial4.jpeg";

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/autoplay";

// import { Navigation, Pagination, Autoplay, Keyboard, A11y } from "swiper/modules";

// export default function Reviews() {
//   const reviews = [
//     {
//       id: 1,
//       title: "Best Night Sleep",
//       img: pic1,
//       subtitle: "More like to experience",
//       client: "Mukesh Singh",
//       description:
//         "Easy to order, free and fast delivery. the mattress is comfortable as are the cushions, not more back and neck pain.",
//     },
//     {
//       id: 2,
//       title: "Best Night Sleep",
//       img: pic2,
//       subtitle: "More like to experience",
//       client: "Mukesh Singh",
//       description:
//         "Easy to order, free and fast delivery. the mattress is comfortable as are the cushions, not more back and neck pain.",
//     },
//     {
//       id: 3,
//       title: "Best Night Sleep",
//       img: pic3,
//       subtitle: "More like to experience",
//       client: "Mukesh Singh",
//       description:
//         "Easy to order, free and fast delivery. the mattress is comfortable as are the cushions, not more back and neck pain.",
//     },
//     {
//       id: 4,
//       title: "Best Night Sleep",
//       img: pic4,
//       subtitle: "More like to experience",
//       client: "Mukesh Singh",
//       description:
//         "Easy to order, free and fast delivery. the mattress is comfortable as are the cushions, not more back and neck pain.",
//     },
//   ];

//   return (
//     <section className="ReviewsMainSec">
//       <div className="container-fluid">
//         <div className="row align-items-center gx-4">
//           <div className="col-md-6">
//             <div className="ReviewBannerSection">
//               <Image src={Banner} alt="review banner" className="ReviewBanner" priority />
//             </div>
//           </div>

//           <div className="col-md-6">
//             <div className="ReviewRightSec">
//               <div className="detailSec">
//                 <p className="eyebrow">Review</p>
//                 <h2>Don't Just Take Our Word for It</h2>
//                 <h5>Find Out What Our Customers Say About Emma's Best Mattress In India</h5>
//               </div>

//               <div className="socialImgSec">
//                 <Image src={Shot} alt="social shot" className="socialImg" />
//               </div>

//               <div className="CardSliderSection">
//               <Swiper
//   modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
//   spaceBetween={10}
//   slidesPerView={1}
//   navigation
//   pagination={{ clickable: true }}
//   loop={true}
//   centeredSlides={false}
//   autoplay={{ delay: 2500, disableOnInteraction: true }}
//   keyboard={{ enabled: true }}
//   grabCursor={true}
//   breakpoints={{
//     576: { slidesPerView: 1.2 },
//     768: { slidesPerView: 2 },
//     992: { slidesPerView: 2.5 },
//     1200: { slidesPerView: 3 },
//   }}
//   className="mySwiper"
// >

//                   {reviews.map((r) => (
//                     <SwiperSlide key={r.id}>
//                       <article className="ReviewCard card">
//                         <div className="CardTopSection d-flex align-items-center">
//                           <div className="ClientImgWrap">
//                             <Image
//                               src={r.img}
//                               alt={`${r.client} image`}
//                               width={72}
//                               height={72}
//                               className="ClientImg"
//                               style={{ objectFit: "cover", borderRadius: "50%" }}
//                               priority={false}
//                             />
//                           </div>

//                           <div className="detailsSec ms-3">
//                             <p className="subtitle">{r.subtitle}</p>
//                             <h3 className="title">{r.title}</h3>
//                           </div>
//                         </div>

//                         <div className="bottomDetailSec">
//                           <p className="desc">{r.description}</p>
//                           <span className="clientName">{r.client}</span>
//                         </div>
//                       </article>
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import Image from "next/image";
import React from "react";
import Banner from "@/app/Components/assets/ReviewBanner.webp";
import Shot from "@/app/Components/assets/shot.webp";
import "./review.css";
import pic1 from "@/app/Components/assets/testimonial2.jpg";
import pic2 from "@/app/Components/assets/testimonial3.jpeg";
import pic3 from "@/app/Components/assets/testimonial4.jpeg";
import pic4 from "@/app/Components/assets/testimonial4.jpeg";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Navigation, Pagination, Autoplay, Keyboard, A11y } from "swiper/modules";

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5a623" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const reviews = [
  {
    id: 1,
    title: "Best Night Sleep",
    img: pic1,
    subtitle: "Verified Buyer",
    client: "Mukesh Singh",
    rating: 5,
    description:
      "Easy to order, free and fast delivery. The mattress is comfortable — no more back and neck pain. Highly recommend!",
  },
  {
    id: 2,
    title: "Game Changer!",
    img: pic2,
    subtitle: "Verified Buyer",
    client: "Priya Sharma",
    rating: 5,
    description:
      "Absolutely love this mattress. Woke up feeling completely refreshed for the first time in years. Worth every rupee.",
  },
  {
    id: 3,
    title: "Premium Quality",
    img: pic3,
    subtitle: "Verified Buyer",
    client: "Rahul Verma",
    rating: 4,
    description:
      "Great quality and fast delivery. The support is perfect — not too firm, not too soft. My whole family loves it.",
  },
  {
    id: 4,
    title: "Highly Recommend",
    img: pic4,
    subtitle: "Verified Buyer",
    client: "Anjali Mehta",
    rating: 5,
    description:
      "I was skeptical at first but after 2 weeks, I can say this is the best purchase I've made. Deep, restful sleep every night.",
  },
];

export default function Reviews() {
  return (
    <section className="rv-section">
      <div className="container-fluid px-0">
        <div className="row align-items-center gx-0">

          {/* ── Left: Banner image ── */}
          <div className="col-md-6">
            <div className="rv-banner-wrap">
              <Image
                src={Banner}
                alt="Customers enjoying their mattress"
                className="rv-banner-img"
                priority
              />
              <div className="rv-banner-overlay" />
            </div>
          </div>

          {/* ── Right: Text + Slider ── */}
          <div className="col-md-6">
            <div className="rv-right">

              {/* Header copy */}
              <div className="rv-header">
                <span className="rv-eyebrow">Customer Reviews</span>
                <h2 className="rv-heading">Don't Just Take<br />Our Word for It</h2>
                <p className="rv-subheading">
                  Find out what our customers say about India's best-rated mattress
                </p>
              </div>

              {/* Social proof strip */}
              <div className="rv-social-strip">
                <Image
                  src={Shot}
                  alt="Social proof — trusted by thousands"
                  className="rv-social-img"
                />
              </div>

              {/* Swiper */}
              <div className="rv-slider-wrap">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  loop={true}
                  autoplay={{ delay: 3000, disableOnInteraction: true }}
                  keyboard={{ enabled: true }}
                  grabCursor={true}
                  breakpoints={{
                    576: { slidesPerView: 1.2 },
                    768: { slidesPerView: 1.5 },
                    992: { slidesPerView: 2 },
                    1200: { slidesPerView: 2.2 },
                  }}
                  className="rv-swiper"
                >
                  {reviews.map((r) => (
                    <SwiperSlide key={r.id}>
                      <article className="rv-card">
                        {/* Quote mark decoration */}
                        <span className="rv-quote">&ldquo;</span>

                        {/* Stars */}
                        <div className="rv-stars">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <StarIcon key={i} />
                          ))}
                        </div>

                        {/* Review text */}
                        <p className="rv-desc">{r.description}</p>

                        {/* Divider */}
                        <hr className="rv-divider" />

                        {/* Client row */}
                        <div className="rv-client-row">
                          <div className="rv-avatar-wrap">
                            <Image
                              src={r.img}
                              alt={r.client}
                              width={48}
                              height={48}
                              className="rv-avatar"
                            />
                          </div>
                          <div className="rv-client-info">
                            <span className="rv-client-name">{r.client}</span>
                            <span className="rv-subtitle">{r.subtitle}</span>
                          </div>
                        </div>
                      </article>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}