// import React from 'react'
// import './aboutus.css'
// import aboutImage from "../../Components/assets/aboutsection.avif"
// import aboutImage2 from "../../Components/assets/about2.png"
// import Image from 'next/image'
// import { IoArrowRedoCircleSharp } from "react-icons/io5";
// import Link from 'next/link'

// const page = () => {
//     return (
//         <>
//           <nav aria-label="breadcrumb" className="pretty-breadcrumb">
//                 <div className="container">
//                     <ol className="breadcrumb align-items-center">
//                         <li className="breadcrumb-item">
//                             <Link href="/">
//                                 <span className="breadcrumb-link"> Home</span>
//                             </Link>
//                         </li>
//                         <li className="breadcrumb-item active" aria-current="page">
//                             About Us
//                         </li>
//                     </ol>
//                 </div>
//             </nav>

//             <section className='aboutUs'>
//                 <div className='container'>
//                     <div className='row align-items-center'>
//                         <div className='col-md-6'>
//                             <div className='aboutUsText'>
//                                 <h1>
//                                     Premium Mattresses Engineered for Superior Comfort, Durability & Healthy Sleep.
//                                 </h1>
//                                 <h3>Crafted by Morph Industries  Designed to Transform Your Sleep Experience</h3>
//                             </div>
//                         </div>
//                         <div className='col-md-6'>
//                             <div className='aboutUsImage'>
//                                 <Image src={aboutImage} alt="About Us" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className='aboutUsContent'>
//                         <h2>About Morph Industries</h2>
//                         <p>
//                             Morph Industries is a trusted mattress manufacturing company based in Haryana, delivering high-quality, comfortable, and durable mattresses across India. With years of expertise in sleep technology, we are committed to providing products that enhance your sleep quality and overall well-being.
//                         </p>
//                         <p>
//                             Our mattresses are crafted using advanced materials, precision engineering, and strict quality control—ensuring long-lasting performance and exceptional comfort.
//                         </p>
//                         <p>
//                             From luxury memory foam to orthopedic support mattresses, we offer a wide range of sleep solutions for homes, hotels, hospitals, and commercial spaces.
//                         </p>
//                         <p>
//                             Every Morph mattress is designed to deliver the perfect balance of support, comfort, and breathability so you wake up refreshed every day.
//                         </p>
//                     </div>

//                     <div className='whyUs'>
//                         <h2>Why Choose Us</h2>
//                         <p>Here’s what makes Morph Industries a trusted name in the mattress industry:</p>
//                         <ul className='list-unstyled'>
//                             <li> 
//                                 <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> 
//                                 100% in-house manufacturing with strict quality checks for consistent, reliable products.
//                             </li>
//                             <li> 
//                                 <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> 
//                                 Wide range of mattresses including orthopedic, memory foam, dual-comfort, spring, and premium luxury mattresses.
//                             </li>
//                             <li> 
//                                 <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> 
//                                 Competitive factory-direct pricing without compromising on quality.
//                             </li>
//                             <li> 
//                                 <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> 
//                                 Custom sizes available for home, hotels, hostels, PGs, and institutions.
//                             </li>
//                             <li> 
//                                 <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> 
//                                 Fast delivery and doorstep service for a smooth and hassle-free experience.
//                             </li>
//                         </ul>
//                     </div>

//                     <div className='row align-items-center'>
//                         <div className='col-md-6'>
//                             <div className='aboutUsText'>
//                                 <h1>
//                                     Your Trusted Mattress Partner
//                                 </h1>
//                                 <p>
//                                     At Morph Industries, we believe everyone deserves a healthier and more restful sleep. Our team works tirelessly to provide innovative sleep solutions backed by advanced technology and premium materials.
//                                 </p>
//                                 <p>
//                                     Whether you're setting up a home, hotel, or commercial space, we are here to deliver mattresses that promise durability, comfort, and long-term reliability.
//                                 </p>
//                             </div>
//                         </div>
//                         <div className='col-md-6'>
//                             <div className='aboutUsImage'>
//                                 <Image src={aboutImage2} alt="About Us" />
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <h2>
//                             Premium Mattress Manufacturer Near You
//                         </h2>
//                         <p>
//                             Based in Sampla, Rohtak Haryana, Morph Industries manufactures a wide range of premium mattresses that suit all comfort preferences and budgets. Our products include spring mattresses, dual-comfort mattresses, memory foam mattresses, PU foam mattresses, bonded foam, and orthopedic mattresses.
//                         </p>
//                         <p>
//                             We supply across Delhi NCR, Haryana, Punjab, Rajasthan, UP, and pan India—ensuring quality sleep solutions delivered quickly and reliably.
//                         </p>
//                         <p>
//                             Product Highlights:
//                         </p>
//                         <ul className='list-unstyled'>
//                             <li> <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> High-density foam for long-lasting durability</li>
//                             <li> <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> Orthopedic support options for back care</li>
//                             <li> <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> Breathable fabrics for cooler sleep</li>
//                             <li> <span className='about-arrow-icon'> <IoArrowRedoCircleSharp /> </span> Luxury comfort layers for premium feel</li>
//                         </ul>
//                         <p>
//                             Choose Morph Industries for reliable, comfortable, and expertly designed mattresses that elevate the way you sleep.
//                         </p>
//                         <p>
//                             Mattress Manufacturer in Haryana | Mattress Supplier in Delhi NCR | Orthopedic Mattress Manufacturer | Memory Foam Mattress Supplier | Spring Mattress Factory | Custom Size Mattresses | Mattress Manufacturer in Rohtak | Mattress Factory in Sampla
//                         </p>
//                     </div>

//                 </div>
//             </section>
//         </>
//     )
// }

// export default page


import React from "react";
import styles from "./aboutus.module.css";
import Image from "next/image";
import Link from "next/link";
import { IoArrowRedoCircleSharp } from "react-icons/io5";

import aboutImage from '@/app/Components/assets/aboutsection.avif';
import aboutImage2 from "@/app/Components/assets/about2.png";

const Page = () => {
  return (
    <>
      <nav aria-label="breadcrumb" className={styles.prettyBreadcrumb}>
        <div className="container">
          <ol className="breadcrumb align-items-center mt-2">
            <li className="breadcrumb-item">
              <Link href="/">
                <span className={styles.breadcrumbLink}>Home</span>
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              About Us
            </li>
          </ol>
        </div>
      </nav>

      <section className={styles.aboutUs}>
        <div className="container">

          <div className="row align-items-center">
            <div className="col-md-6">
              <div className={styles.aboutUsText}>
                <h1>
                  Luxury Beauty, Organic Skincare & Thoughtfully Curated Gifts.
                </h1>
                <h3>
                  Crafted with Elegance by BeautyHub — Elevating Your Everyday Beauty & Gifting Rituals
                </h3>
              </div>
            </div>

            <div className="col-md-6">
              <div className={styles.aboutUsImage}>
                <Image src={aboutImage} alt="BeautyHub About Us" />
              </div>
            </div>
          </div>

          <div className={styles.aboutUsContent}>
            <h2>About BeautyHub</h2>
            <p>
              BeautyHub is India&apos;s premier destination for high-performance skincare, glamour cosmetics, hypoallergenic soft plush teddies, and bespoke gift hampers. We believe that true beauty and genuine gifting start with passion, safety, and unmatched craftsmanship.
            </p>
            <p>
              All our beauty products are 100% cruelty-free, dermatologist-tested, and ethically formulated using organic botanical extracts and clinical-grade actives.
            </p>
            <p>
              Whether you are looking for glowing rose serums, transfer-proof matte lipsticks, giant cuddly teddy bears, or celebratory gift trunks, BeautyHub offers curated collections designed to delight.
            </p>
          </div>

          <div className={styles.whyUs}>
            <h2>Why Choose BeautyHub</h2>
            <ul className="list-unstyled">
              {[
                "100% Authentic & Dermatologist Certified Products",
                "Wide range of Skincare, Makeup, Plush Teddies & Gift Combos",
                "Direct-from-Brand prices with exclusive seasonal offers",
                "Customized gift hamper boxes & personalized message cards",
                "Fast, safe express doorstep delivery across India",
              ].map((text, index) => (
                <li key={index}>
                  <span className={styles.aboutArrowIcon}>
                    <IoArrowRedoCircleSharp />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="row align-items-center">
            <div className="col-md-6">
              <div className={styles.aboutUsText}>
                <h1>Your Trusted Beauty & Gift Destination</h1>
                <p>
                  At BeautyHub, we believe everyone deserves self-care luxury and joyful gifting experiences. Our team meticulously handpicks every product to ensure uncompromising quality, elegance, and satisfaction.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className={styles.aboutUsImage}>
                <Image src={aboutImage2} alt="BeautyHub Collections" />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Page;

