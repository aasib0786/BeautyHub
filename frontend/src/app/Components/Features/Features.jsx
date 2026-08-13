import React from 'react';
import { TbTruck, TbShieldCheck, TbStar, TbCreditCard } from "react-icons/tb";
import { MdOutlineSpa, MdOutlineVerified } from "react-icons/md";
import './features.css';

const features = [
  {
    id: 1,
    icon: <TbTruck />,
    title: "Free & Fast Delivery",
    desc: "Free shipping on orders above ₹499",
  },
  {
    id: 2,
    icon: <TbShieldCheck />,
    title: "100% Authentic Products",
    desc: "All products are genuine & certified",
  },
  {
    id: 3,
    icon: <MdOutlineSpa />,
    title: "Cruelty Free",
    desc: "Ethically sourced, skin-friendly formulas",
  },
  {
    id: 4,
    icon: <TbCreditCard />,
    title: "No Cost EMI",
    desc: "Easy EMI options on all major cards",
  },
];

export default function Features() {
  return (
    <section className="feat-section">
      <div className="container">
        <div className="feat-grid">
          {features.map((item) => (
            <div className="feat-card" key={item.id}>
              <div className="feat-icon-wrap">
                <span className="feat-icon">{item.icon}</span>
              </div>
              <div className="feat-content">
                <h4 className="feat-title">{item.title}</h4>
                <p className="feat-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}