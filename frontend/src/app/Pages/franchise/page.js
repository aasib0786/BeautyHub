"use client";
import React, { useState } from "react";
import "./Franchise.css";
import Link from "next/link";
import { axiosInstance } from "@/app/utils/axiosInstance";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaWallet,
  FaCommentDots,
  FaPaperPlane,
  FaStore,
  FaShieldHalved,
  FaChartLine,
  FaTruckFast,
  FaBullhorn,
  FaAward,
  FaHandshake,
  FaHeadset,
  FaCircleCheck,
} from "react-icons/fa6";
import { IoSparkles, IoArrowForward } from "react-icons/io5";

const Franchise = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.city,
      investmentBudget: formData.budget,
      message: formData.message,
    };

    try {
      const response = await axiosInstance.post(
        "/api/v1/become-franchise/create-franchise",
        payload
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Thank you for applying! We’ll be in touch soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          budget: "",
          message: "",
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const benefitsList = [
    {
      title: "Trusted Brand Legacy",
      desc: "Partner with India's premier beauty, plush teddy, and luxury gift boutique brand.",
      icon: <FaAward />,
    },
    {
      title: "Diverse Product Portfolio",
      desc: "Wide range of Skincare, Glamour Makeup, Soft Plush Teddies, Perfumes & Celebration Gift Hampers.",
      icon: <FaStore />,
    },
    {
      title: "360° Franchise Support",
      desc: "End-to-end guidance from boutique interior design, visual merchandising, stock supply to sales training.",
      icon: <FaHandshake />,
    },
    {
      title: "High ROI & Strong Margins",
      desc: "Enjoy attractive profit margins with fast payback period in the rapidly booming beauty & gifting sector.",
      icon: <FaChartLine />,
    },
    {
      title: "Protected Exclusive Territory",
      desc: "Get dedicated city or shopping hub territory rights with zero internal brand competition.",
      icon: <FaShieldHalved />,
    },
    {
      title: "Nationwide Express Supply",
      desc: "Reliable & fast supply chain management with door-step stock dispatch across India.",
      icon: <FaTruckFast />,
    },
    {
      title: "Omnichannel Marketing Support",
      desc: "Benefit from continuous influencer campaigns, digital ads, social media buzz, and in-store promotional kits.",
      icon: <FaBullhorn />,
    },
  ];

  const stepsList = [
    {
      step: "01",
      title: "Apply Online",
      desc: "Fill out the franchise inquiry form with your details & city preference.",
    },
    {
      step: "02",
      title: "Discussion & Approval",
      desc: "Our business development team contacts you to discuss potential & target market.",
    },
    {
      step: "03",
      title: "Store Setup & Stocking",
      desc: "Receive luxury boutique design guidelines, initial stock inventory, and staff sales training.",
    },
    {
      step: "04",
      title: "Grand Launch",
      desc: "Inaugurate your BeautyHub boutique with localized marketing launch events & ongoing support.",
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
              Franchise
            </li>
          </ol>
        </div>
      </nav>

      <div className="franchise-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-badge">
            <IoSparkles className="sparkle-icon" /> Franchise Opportunity
          </div>
          <h1>Become a BeautyHub Franchise Partner</h1>
          <p>
            Join India’s Fast-Growing Beauty, Plush & Luxury Gift Boutique Network. Build a High-Growth Business with Complete Brand Support.
          </p>
        </section>

        {/* Stats Highlights */}
        <div className="container">
          <div className="stats-grid-wrapper">
            <div className="stat-card">
              <h3>50+</h3>
              <p>Boutique Stores Pan-India</p>
            </div>
            <div className="stat-card">
              <h3>100%</h3>
              <p>Authentic Certified Brands</p>
            </div>
            <div className="stat-card">
              <h3>35%+</h3>
              <p>Attractive Profit Margins</p>
            </div>
            <div className="stat-card">
              <h3>100%</h3>
              <p>Setup & Marketing Support</p>
            </div>
          </div>
        </div>

        {/* Main Content & Form Section */}
        <div className="container mt-4">
          <div className="franchise-content-row">
            <div className="row g-4">
              {/* Left Column: Benefits */}
              <div className="col-lg-7">
                <div className="franchise-content">
                  <div className="section-header">
                    <span className="sub-title">Why Choose BeautyHub?</span>
                    <h2>Why Partner With BeautyHub?</h2>
                    <p className="lead-text">
                      We empower our franchise partners with proven boutique business models, high-demand products, and dedicated operational guidance.
                    </p>
                  </div>

                  <div className="benefits-grid">
                    {benefitsList.map((item, idx) => (
                      <div className="benefit-card" key={idx}>
                        <div className="benefit-icon">{item.icon}</div>
                        <div className="benefit-text">
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights Banner */}
                  <div className="highlight-banner">
                    <div className="highlight-icon">
                      <FaHeadset />
                    </div>
                    <div>
                      <h5>Need Direct Assistance?</h5>
                      <p>Call our Franchise Relations team directly for immediate assistance.</p>
                      <a href="tel:+919876543210" className="call-link">
                        +91 98765 43210 <IoArrowForward />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Application Form */}
              <div className="col-lg-5">
                <div className="form-wrapper">
                  <form className="franchise-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                      <h3>Apply for Franchise</h3>
                      <p>Fill out the details below & our team will reach out to you.</p>
                    </div>

                    <div className="form-group">
                      <label>Full Name *</label>
                      <div className="input-with-icon">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email Address *</label>
                      <div className="input-with-icon">
                        <FaEnvelope className="input-icon" />
                        <input
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Phone Number *</label>
                      <div className="input-with-icon">
                        <FaPhone className="input-icon" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Enter 10-digit mobile number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>City / Location *</label>
                      <div className="input-with-icon">
                        <FaLocationDot className="input-icon" />
                        <input
                          type="text"
                          name="city"
                          placeholder="Target city for boutique store"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Investment Budget *</label>
                      <div className="input-with-icon">
                        <FaWallet className="input-icon" />
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          required
                          className="select-input"
                        >
                          <option value="">Select your investment budget</option>
                          <option value="₹5–10 Lakhs">₹5 – 10 Lakhs</option>
                          <option value="₹10–20 Lakhs">₹10 – 20 Lakhs</option>
                          <option value="₹20–30 Lakhs">₹20 – 30 Lakhs</option>
                          <option value="Above ₹30 Lakhs">Above ₹30 Lakhs</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Message / Experience (Optional)</label>
                      <div className="input-with-icon textarea-icon-wrapper">
                        <FaCommentDots className="input-icon textarea-icon" />
                        <textarea
                          name="message"
                          placeholder="Tell us about your retail background or space..."
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="franchise-submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <FaPaperPlane className="btn-icon" />
                        </>
                      )}
                    </button>

                    <div className="form-footer-note">
                      <FaCircleCheck className="check-icon" /> Your information is 100% confidential & safe.
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps to Own a Franchise Section */}
        <section className="steps-section mt-5">
          <div className="container">
            <div className="text-center mb-4">
              <span className="sub-title">Simple Process</span>
              <h2 className="section-title">4 Easy Steps to Launch Your Boutique</h2>
            </div>
            <div className="row g-4">
              {stepsList.map((step, idx) => (
                <div className="col-md-3 col-sm-6" key={idx}>
                  <div className="step-card">
                    <span className="step-number">{step.step}</span>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Franchise;

