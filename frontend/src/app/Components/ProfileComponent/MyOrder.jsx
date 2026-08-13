// app/my-orders/page.jsx or wherever your page is
"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './MyOrder.css';

import pic1 from "@/app/Components/assets/icon1.jpg";
import pic2 from "@/app/Components/assets/icon2.webp";
import toast from 'react-hot-toast';
import { axiosInstance } from '@/app/utils/axiosInstance';
import { NoItem } from '@/app/utils/NoItem';


const MyOrder = () => {
const [orders,setOrders]=useState([])
  const fetchOrders=async()=>{
try {
 const response = await axiosInstance.get("/api/v1/order/get-order")
  if (response.status === 200) {
    setOrders(response?.data?.order);
  }
} catch (error) {
  console.log("Error fetching orders:", error);
  toast.error(error?.response?.data?.message || "Failed to fetch orders.");
}
  }

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="container py-4">
      <div className="row g-4">
        {orders.length > 0 ? orders.map((order) => (
          <div className="col-md-6 col-12" key={order._id}>
            
              <div className="myproduct-div shadow p-3 rounded bg-white h-100">
                <div className="d-flex gap-3 align-items-center">
                  <div className="product-image">
                    <Image src={order?.items[0]?.productId?.images?.[0]} alt="product" width={100} height={100} className="rounded" />
                  </div>
                  <div className="myorder-product-details">
                    <h5 className="mb-1 text-dark">{order.items[0]?.productId?.productName}</h5>
                    <p className="mb-1 text-muted">Order No: {order?.orderUniqueId}</p>
                    <p className="mb-1 text-muted">₹{order?.totalAmount}</p>
                    <p className="mb-0 text-muted">Buy Date: <b>{order?.createdAt && new Date(order.createdAt).toLocaleDateString()}</b></p>
                    <Link href={`/Pages/my-order/${order?._id}`} className="text-decoration-none">
                    <button className='btn themeColor mt-3 text-light'>View Details</button>
                    </Link>
                  </div>
                </div>
              </div>
          </div>
        )):(
          <NoItem name={"Order"}/>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
