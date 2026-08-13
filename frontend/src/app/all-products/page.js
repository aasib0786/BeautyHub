"use client";
import React, { Suspense } from "react";
import AllProductsPage from "../Pages/products/page";

export default function AllProductsRoutePage() {
  return (
    <Suspense fallback={<div className="p-5 text-center text-pink-600 fw-bold">Loading BeautyHub Catalogue...</div>}>
      <AllProductsPage />
    </Suspense>
  );
}
