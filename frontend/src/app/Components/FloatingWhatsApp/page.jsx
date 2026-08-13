import Link from "next/link";
import React from "react";
import "./floating.css";
import { FaWhatsapp } from "react-icons/fa6";

export default function FloatingWhatsApp() {
  return (
    <div className="floating-whatsapp-box">
      <div className="floating-content">
        <div className="floating-icon">
          <FaWhatsapp className="wa-icon" />
        </div>
        <div className="floating-expanded">
          <p className="floating-title text-dark">How can I help you?</p>
          <button className="floating-btn visit-store">Visit Store</button>
          <Link
            href="https://wa.me/919131734930"
            target="_blank"
            rel="noreferrer"
            className="floating-btn whatsapp-btn"
          >
            <FaWhatsapp className="wa-btn-icon" />
            WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}








// // components/FloatingWhatsApp.js

// import React from "react";
// import Link from "next/link";
// import "./floating.css"; // Make sure this path is correct

// export default function FloatingWhatsApp() {
//   return (
//     <div className="floating-whatsapp-box">
//       <button className="btn btn-outline-success w-100 fw-bold mb-2">
//         Visit Store
//       </button>
//       <Link
//         href="https://wa.me/919999999999"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="btn btn-success w-100 fw-bold"
//       >
//         WhatsApp for Offers
//       </Link>
//     </div>
//   );
// }
