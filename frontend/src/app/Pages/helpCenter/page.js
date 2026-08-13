"use client";
import React from "react";
import "./HelpCenter.css";
import Link from "next/link";

const page = () => {
  const helpTopics = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add items to your cart, and proceed to checkout. Follow the steps to enter your address and payment info.",
    },
    {
      question: "What are the delivery charges?",
      answer:
        "Delivery is free for all orders above ₹5,000. For orders below ₹5,000, a nominal shipping fee may apply depending on your location.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "We usually deliver within 5–10 working days. Delivery time may vary depending on your location and product availability.",
    },
    {
      question: "Can I return or exchange furniture?",
      answer:
        "Yes, we offer a 7-day return policy for eligible products. Please ensure the product is unused and in original condition with packaging.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you’ll receive a tracking link via email and SMS. You can also track it from the ‘My Orders’ section.",
    },
    {
      question: "Do you offer assembly services?",
      answer:
        "Yes! For most products, we provide free assembly by our professional team after delivery.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept UPI, debit/credit cards, net banking, and cash on delivery for selected locations.",
    },
    {
      question: "Still need help?",
      answer:
        "You can contact our support team at support@manmohanfurniture.com or call us at +91-9876543210.",
    },
  ];

  return (
    <>
      <nav aria-label="breadcrumb" className="pretty-breadcrumb">
        <div className="container">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <Link href="/">
                <span className="breadcrumb-link"> Home</span>
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Help Center
            </li>
          </ol>
        </div>
      </nav>

      <div className="help-center">
        <div className="help-hero">
          <h1>Help Center</h1>
          <p>Need assistance? We’re here to help you every step of the way.</p>
        </div>

        <div className="help-container">
          {helpTopics.map((item, index) => (
            <div key={index} className="help-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default page;
