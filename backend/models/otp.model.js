import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: Date,
    isVerified: { type: Boolean, default: false },
  });

  export const OTP = mongoose.model("OTP", otpSchema);