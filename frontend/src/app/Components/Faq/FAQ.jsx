// import React from "react";
// import styles from "./faq.css";

// const faqData = [
//   {
//     question: "What types of Aqualite Mattres do you offer?",
//     answer:
//       "We offer a wide range of Aqualite Mattres including sofas, beds, dining tables, chairs, wardrobes, and more for homes and offices.",
//   },
//   {
//     question: "Do you offer custom Aqualite Mattres designs?",
//     answer:
//       "Yes, we provide custom Aqualite Mattres options based on your requirements. You can contact our team to discuss your ideas.",
//   },
//   {
//     question: "How long does delivery take?",
//     answer:
//       "Delivery usually takes 5-10 business days depending on your location and the type of Aqualite Mattres ordered.",
//   },
//   {
//     question: "What is your return policy?",
//     answer:
//       "We accept returns within 7 days of delivery if the product is damaged or defective. Please refer to our return policy page for more details.",
//   },
//   {
//     question: "Do you offer installation services?",
//     answer:
//       "Yes, we provide free installation services for selected Aqualite Mattres items. Our delivery team will handle the setup.",
//   },
// ];

// const FAQ = () => {
//   return (
//     <div className={`container  faqSection`}>
//       <h2 className="toptrandheading text-center">Frequently Asked Questions</h2>
//       <div className={`accordion accordionCustom`} id="faqAccordion">
//         {faqData.map((item, index) => (
//           <div className={`accordion-item accordionItem`} key={index}>
//             <h2 className="accordion-header" id={`faq${index}`}>
//               <button
//                 className={`accordion-button ${index !== 0 ? "collapsed" : ""} accordionButton`}
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target={`#collapse${index}`}
//                 aria-expanded={index === 0 ? "true" : "false"}
//                 aria-controls={`collapse${index}`}
//               >
//                 {item.question}
//               </button>
//             </h2>
//             <div
//               id={`collapse${index}`}
//               className={`accordion-collapse collapse ${index === 0 ? "" : ""}`}
//               aria-labelledby={`faq${index}`}
//               data-bs-parent="#faqAccordion"
//             >
//               <div className={`accordion-body accordionBody`}>
//                 {item.answer}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FAQ;

"use client";

import React, { useState } from "react";
import "./faq.css";

const faqData = [
  {
    question: "Are BeautyHub cosmetics and skincare products 100% authentic?",
    answer:
      "Yes! All products sold on BeautyHub are 100% authentic, dermatologist-tested, cruelty-free, and directly sourced from authorized brand distributors.",
  },
  {
    question: "Do you offer customized gift hampers & personalized cards?",
    answer:
      "Absolutely! You can customize your luxury gift hamper box with curated beauty essentials, chocolates, teddy plushies, and a personalized printed card at checkout.",
  },
  {
    question: "How long does shipping & doorstep delivery take?",
    answer:
      "Domestic delivery usually takes 3–5 business days. Express same-day or next-day delivery options are available for select metro cities.",
  },
  {
    question: "What is your return & exchange policy?",
    answer:
      "We accept hassle-free returns within 7 days of delivery for unopened, sealed items or damaged products. Contact our 24/7 customer support for instant assistance.",
  },
  {
    question: "Are your plush teddies hypoallergenic & safe for children?",
    answer:
      "Yes, all our plush toys and giant teddy bears are crafted using non-toxic, hypoallergenic ultra-soft velvet fabrics with extra safety stitching.",
  },
  {
    question: "How can I track my order status?",
    answer:
      "Once dispatched, you will receive an SMS and email notification with a live tracking link. You can also track your package anytime on our Track Order page.",
  },
];

const ChevronIcon = () => (
  <svg
    className="faq-chevron"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        {/* Header */}
        <div className="faq-header">
          <span className="faq-eyebrow">Support</span>
          <h2 className="faq-heading">Frequently Asked Questions</h2>
          <p className="faq-subheading">
            Everything you need to know about BeautyHub products & orders. Can't find an answer?{" "}
            <a href="/Pages/contact-us" className="faq-contact-link">Contact our team →</a>
          </p>
        </div>

        {/* Accordion */}
        <div className="faq-list" role="list">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                role="listitem"
              >
                <button
                  className="faq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-btn-${index}`}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-icon-wrap">
                    <ChevronIcon />
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  className="faq-answer-wrap"
                  style={{ maxHeight: isOpen ? "300px" : "0px" }}
                >
                  <div className="faq-answer">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;