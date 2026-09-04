import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    // Website & Branding
    siteName: { type: String, default: "BeautyHub Store" },
    siteLogo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    supportEmail: { type: String, default: "support@beautyhub.com" },
    supportPhone: { type: String, default: "+91 9131734930" },
    storeAddress: { type: String, default: "123 Commerce Park, Main Highway, India" },
    currencySymbol: { type: String, default: "₹" },
    currencyCode: { type: String, default: "INR" },
    maintenanceMode: { type: Boolean, default: false },

    // Multi-Vendor & Marketplace
    multiVendorEnabled: { type: Boolean, default: true },
    vendorRegistrationOpen: { type: Boolean, default: true },
    autoApproveVendors: { type: Boolean, default: false },
    defaultVendorCommission: { type: Number, default: 15 },
    minVendorPayout: { type: Number, default: 1000 },

    // Security & User Accounts
    requireEmailVerification: { type: Boolean, default: false },
    requireOtpVerification: { type: Boolean, default: true },
    allowGuestCheckout: { type: Boolean, default: true },
    autoActivateUsers: { type: Boolean, default: true },
    maxLoginAttempts: { type: Number, default: 5 },

    // AI & Integration API Keys
    aiProvider: { type: String, default: "gemini" },
    openAiApiKey: { type: String, default: "" },
    geminiApiKey: { type: String, default: "" },
    razorpayKeyId: { type: String, default: "" },
    razorpayKeySecret: { type: String, default: "" },
    whatsappApiToken: { type: String, default: "" },

    // Email SMTP Config
    smtpHost: { type: String, default: "smtp.gmail.com" },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: "" },
    smtpPass: { type: String, default: "" },
    senderEmail: { type: String, default: "no-reply@beautyhub.com" },
    senderName: { type: String, default: "BeautyHub Care" },
  },
  { timestamps: true }
);

export default mongoose.model("SystemSettings", systemSettingsSchema);
