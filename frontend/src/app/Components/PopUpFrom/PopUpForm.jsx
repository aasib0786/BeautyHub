"use client";
import React, { useState } from "react";
import styles from "./CustomSizePopup.module.css";
import { axiosInstance } from "@/app/utils/axiosInstance";

export default function CustomSizePopup({ open, onClose, user, product }) {
  const [formData, setFormData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  if (!open) return null;

  const handlechanege = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleInquary = async () => {
    setFormLoading(true);
    if (!formData.name) {
      alert("Please enter your name.");
    }
    if (!formData.phone) {
      alert("Please enter your phone number.");
    }
    if (!formData.size) {
      alert("Please enter your custom size.");
    }
    const body = {
      name: formData.name,
      phone: formData.phone,
      size: formData.size,
      userId: user?._id,
      productId: product?._id
    }
    const response = await axiosInstance.post("/api/v1/product-inquery/create-inquery", body);
    console.log("response===>", response);
    if (response.status === 201) {
      setFormLoading(false);
      alert("Inquary submitted successfully.");
      onClose()
    }
    setFormLoading(false);
  };
  return (
    <div className={styles.overlay} >
      <div className={styles.popup}>
        <span className={styles.closeBtn} onClick={onClose}>
          &times;
        </span>

        <h2 className={styles.popUpFormTitle}>Custom Mattress Size</h2>
        <p >Please enter your custom size and contact details.</p>

        <form className={styles.form}>
          <label>Custom Size (e.g., 78x60 Inch)</label>
          <input type="text" name="size" onChange={handlechanege} placeholder="Enter size" />

          <label>Name</label>
          <input type="text" name="name" onChange={handlechanege} placeholder="Your Name" />

          <label>Phone</label>
          <input type="text" name="phone" onChange={handlechanege} placeholder="Your Phone Number" />

          <button className={styles.submitBtn} onClick={handleInquary}>{formLoading ? "Submitting" : 'Submit'}</button>
        </form>
      </div>
    </div>
  );
}
