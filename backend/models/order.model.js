import mongoose from "mongoose";
import { itemsSchema } from "./cart.model.js";

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderUniqueId: {
      type: String,
      trim: true,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [itemsSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: [addressSchema],
    shippingCost: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "Failed"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Online"],
    },
    paymentInfo: {
      orderId: {
        type: String,
      },
      transactionId: {
        type: String,
      },
      paymentId: {
        type: String,
      },
      razorpaySignature: {
        type: String,
      },
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered", "Cancelled","Confirmed"],
      default: "Placed",
    },
    deliveredAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Checkout = mongoose.model("Order", orderSchema);
export default Checkout;
