import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
       videoUrl: {
            type: String,
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },

    { timestamps: true }
);

export default mongoose.model("Video", videoSchema);