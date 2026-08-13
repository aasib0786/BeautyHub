import HeroSection from "./Components/HeroSection/Page";
import TopTrending from "./Components/TopTrending/page";
import Collection from "@/app/Components/Collections/page";
import Carousel from "./Components/Carousel/page";
import ReelSection from "./Components/ReelSection/reelSection";
import FloatingWhatsApp from "./Components/FloatingWhatsApp/page";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FAQ from "./Components/Faq/FAQ";
import TestimonialSlider from "./Components/Testimonial/page";
import ProductSlider from "./Components/ProductSlider/ProductSlider";
import CoustomerService from "./Components/CoustomerService/CoustomerService";
import Features from "./Components/Features/Features";
import BrandShowcase from "./Components/BrandShowcase/page";
import CategoryExplorer from "./Components/CategoryExplorer/page";

export default function Home() {
  return (
    <main style={{ overflowX: "hidden" }}>
      {/* 1. Luxury Hero Banner Carousel */}
      <HeroSection />

      {/* 2. Key Features & Guarantee Banner */}
      <Features />

      {/* 3. Main Category & SubCategory Interactive Explorer */}
      <CategoryExplorer />

      {/* 4. Top Trending Beauty, Teddy Bears & Gift Products */}
      <TopTrending />

      {/* 5. Featured Brands Showcase (L'Oréal Paris, Huggy Teddies, etc.) */}
      <BrandShowcase />

      {/* 6. Floating Customer Support WhatsApp */}
      <FloatingWhatsApp />

      {/* 7. Reels / Video Highlights */}
      <ReelSection />

      {/* 8. Products Slider Carousel */}
      <ProductSlider />

      {/* 9. Exclusive Gift & Beauty Collections */}
      <Collection />

      {/* 10. Imageless Luxury Promotional Banner Carousel */}
      <Carousel />

      {/* 11. Customer Service & Support */}
      <CoustomerService />

      {/* 12. Testimonials & FAQs */}
      <TestimonialSlider />
      <FAQ />
    </main>
  );
}
