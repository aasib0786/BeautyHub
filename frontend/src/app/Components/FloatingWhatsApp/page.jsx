"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./floating.css";
import { FaWhatsapp, FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import { axiosInstance } from "@/app/utils/axiosInstance";

export default function FloatingWhatsApp() {
  const { user } = useSelector((state) => state.auth || {});

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isLeadSaved, setIsLeadSaved] = useState(false);

  // Auto-fill logged-in user credentials
  useEffect(() => {
    if (user) {
      const uName = user.fullName || user.name || user.username || "";
      const uPhone = user.phone || user.mobileNumber || user.mobile || "";
      const uEmail = user.email || "";

      if (uName) setLeadName(uName);
      if (uPhone) setLeadPhone(uPhone);
      if (uEmail) setLeadEmail(uEmail);

      if (uName || uPhone || uEmail) {
        setIsLeadSaved(true);
      }
    } else {
      try {
        const localUser = JSON.parse(localStorage.getItem("user") || "null");
        if (localUser) {
          const uName = localUser.fullName || localUser.name || "";
          const uPhone = localUser.phone || localUser.mobileNumber || "";
          const uEmail = localUser.email || "";

          if (uName) setLeadName(uName);
          if (uPhone) setLeadPhone(uPhone);
          if (uEmail) setLeadEmail(uEmail);

          if (uName || uPhone || uEmail) {
            setIsLeadSaved(true);
          }
        }
      } catch (e) {
        console.log("Error reading local user:", e);
      }
    }
  }, [user]);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! 👋 Welcome to BeautyHub. I am your AI Shopping & Sales Assistant. What product or category are you looking for today?",
      products: [],
      time: new Date(),
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inquiryId, setInquiryId] = useState(null);

  const chatEndRef = useRef(null);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiModalOpen]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const userText = inputMsg.trim();
    if (!userText || isLoading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", text: userText, time: new Date() },
    ];
    setMessages(updatedMessages);
    setInputMsg("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/v1/product/ai-chat-assistant", {
        name: leadName || "Store Visitor",
        phone: leadPhone || "Not Provided",
        email: leadEmail || "",
        message: userText,
        chatHistory: updatedMessages,
        inquiryId,
      });

      if (response?.data?.data) {
        const data = response.data.data;
        if (data.inquiryId) setInquiryId(data.inquiryId);

        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            text: data.reply,
            products: data.products || [],
            time: new Date(),
          },
        ]);
        if (leadPhone || leadEmail || leadName) {
          setIsLeadSaved(true);
        }
      }
    } catch (err) {
      console.error("AI Chat Assistant error:", err);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          text: "Thank you for reaching out! Your inquiry has been registered with our sales team.",
          products: [],
          time: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Buttons Bar */}
      <div className="floating-whatsapp-box">
        <div className="floating-content">
          <div className="floating-icon">
            <FaWhatsapp className="wa-icon" />
          </div>
          <div className="floating-expanded">
            <p className="floating-title text-dark fw-bold">How can I help you?</p>

            {/* ✨ Visit Store / Chat with AI Button */}
            <button
              type="button"
              className="floating-btn visit-store d-flex align-items-center justify-content-center gap-2"
              onClick={() => setIsAiModalOpen(true)}
            >
              <FaRobot style={{ color: "#153964", fontSize: "1.1rem" }} />
              <span>AI Store Assistant</span>
            </button>

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

      {/* 🤖 Interactive AI Customer Sales Assistant Drawer Modal */}
      {isAiModalOpen && (
        <div className="ai-chat-modal-overlay">
          <div className="ai-chat-modal-card">
            {/* Modal Header */}
            <div className="ai-chat-header">
              <div className="d-flex align-items-center gap-2">
                <div className="ai-avatar">
                  <FaRobot />
                </div>
                <div>
                  <h6 className="m-0 fw-bold text-white" style={{ fontSize: "0.95rem" }}>
                    BeautyHub AI Assistant
                  </h6>
                  <small className="text-warning d-block" style={{ fontSize: "0.75rem" }}>
                    {leadName ? `👤 Logged in: ${leadName}` : "● Online | Instant Product Finder"}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="ai-close-btn"
                onClick={() => setIsAiModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Customer Details Lead Form Bar */}
            <div className="ai-lead-form-bar">
              <small className="text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.74rem" }}>
                {leadName ? "Your Saved Profile Details (Auto-filled):" : "Enter contact info for custom sales offers:"}
              </small>
              <div className="row g-1">
                <div className="col-4">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Your Name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    placeholder="Phone No"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    placeholder="Email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>


            {/* Chat Body */}
            <div className="ai-chat-body">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`ai-chat-bubble-wrapper ${
                    msg.role === "user" ? "user-msg" : "bot-msg"
                  }`}
                >
                  <div className="ai-chat-bubble">
                    <p style={{ margin: 0, whiteSpace: "pre-line" }}>{msg.text}</p>

                    {/* Matching Product Recommendations */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="ai-chat-products-grid mt-2">
                        {msg.products.map((prod) => (
                          <div key={prod._id} className="ai-chat-prod-card">
                            <img
                              src={Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : "/icon1.jpg"}
                              alt={prod.productName}
                              className="ai-chat-prod-img"
                              onError={(e) => { e.target.src = "/icon1.jpg"; }}
                            />
                            <div className="ai-chat-prod-details">
                              <div className="ai-chat-prod-name">{prod.productName}</div>
                              <div className="ai-chat-prod-price">₹{prod.finalPrice}</div>
                              <Link
                                href={`/Pages/products/${prod._id}`}
                                className="btn btn-sm btn-outline-primary py-0 px-2 mt-1"
                                style={{ fontSize: "0.72rem" }}
                                onClick={() => setIsAiModalOpen(false)}
                              >
                                View Product →
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="ai-chat-bubble-wrapper bot-msg">
                  <div className="ai-chat-bubble">
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    AI Assistant is finding products...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="ai-chat-footer">
              <input
                type="text"
                className="form-control ai-chat-input"
                placeholder="Ask AI for products, prices, or advice..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-warning fw-bold d-flex align-items-center justify-content-center"
                disabled={isLoading || !inputMsg.trim()}
                style={{ borderRadius: "20px", padding: "8px 16px" }}
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
