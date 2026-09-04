import mongoose from "mongoose";

const productInquarySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            default: "",
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        size: {
            type: String,
            default: "N/A",
        },
        needDescription: {
            type: String,
            default: "",
        },
        chatHistory: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model("ProductInquary", productInquarySchema);
