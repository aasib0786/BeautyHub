// app/my-orders/[id]/page.jsx
"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/app/utils/axiosInstance';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});

  const fetchOrderDetails = async () => {
    try {
      const response = await axiosInstance(`/api/v1/order/get-order-by-id/${id}`);
      setOrder(response?.data?.order || {});
    } catch (error) {
      console.log("Error fetching order details:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch order details.");
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Order Details</h2>

      <div className="mb-4 p-3 bg-light rounded">
        <p><strong>Order ID:</strong> {order?.orderUniqueId || "N/A"}</p>
        <p><strong>Order Date:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`badge ${
            order?.orderStatus === "Placed" ? "bg-primary" :
            order?.orderStatus === "Confirmed" ? "bg-info" :
            order?.orderStatus === "Shipped" ? "bg-warning" :
            order?.orderStatus === "Delivered" ? "bg-success" :
            order?.orderStatus === "Cancelled" ? "bg-danger" :
            "bg-secondary"
          }`}>
            {order?.orderStatus || "Pending"}
          </span>
        </p>
        <p><strong>Payment Method:</strong> {order?.paymentStatus || "N/A"}</p>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Details</th>
              <th scope="col">Price</th>
              <th scope="col">Qty</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {order?.items?.map((item, idx) => {
              const product = item?.productId || {};
              const unitPrice = item?.price || item?.mattressFinalPrice || product?.finalPrice || 0;
              const qty = item?.quantity || 1;
              const lineTotal = unitPrice * qty;
              return (
                <tr key={product?._id || idx}>
                  <td>
                    {product?.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product?.productName || "Product"}
                        width={80}
                        height={80}
                        className="rounded"
                      />
                    ) : (
                      <div className="bg-secondary rounded text-white text-center py-4" style={{ width: 80, height: 80 }}>
                        🛍️
                      </div>
                    )}
                  </td>
                  <td>{product?.productName || "Product Item"}</td>
                  <td>₹{unitPrice.toLocaleString("en-IN")}</td>
                  <td>{qty}</td>
                  <td>₹{lineTotal.toLocaleString("en-IN")}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-end"><strong>Grand Total:</strong></td>
              <td><strong>₹{(order?.totalAmount || 0).toLocaleString("en-IN")}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;

