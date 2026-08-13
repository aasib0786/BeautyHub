// components/TestimonialSlider.jsx
"use client";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./testimonial.css";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    message: "Absolutely in love with the 24K Gold Rose Serum! My skin feels hydrated, radiant, and glass-like after just 3 days of use. Delivery was super fast!",
  },
  {
    name: "Priya Patel",
    role: "Ahmedabad, Gujarat",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80",
    message: "Ordered the 5ft Velvet Teddy Bear for my daughter's birthday. It is unbelievably soft, huge, and hypoallergenic! Truly high quality.",
  },
  {
    name: "Rohan Verma",
    role: "New Delhi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    message: "Sent a custom Beauty & Chocolate Gift Hamper to my fiance. The wooden box packaging and personalized card were so romantic and luxury!",
  },
  {
    name: "Sneha Kapoor",
    role: "Bengaluru, Karnataka",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80",
    message: "The Velvet Matte Lipsticks are transfer-proof and non-drying even after 12 hours. BeautyHub is now my go-to store for cosmetics!",
  }
];

const TestimonialSlider = () => {
  return (
    <>    
      <h2 className="theme-text text-center mt-3">What Our Customers Say</h2>  
      <div className="testimonialMainSec">
        <div className="testimonial-container">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop={true}
          >
            {testimonials.map((t, index) => (
              <SwiperSlide key={index}>
                <div className="testimonial-card">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="testimonial-img"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"; }}
                  />
                  <h3 className="text-light">{t.name}</h3>
                  <p className="role text-light ">{t.role}</p>
                  <p className="message text-light pb-3">“{t.message}”</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default TestimonialSlider;

