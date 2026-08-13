import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
        },
        categoryImage: {
            type: String,
            required: true,
        },
        isCollection: {
            type: Boolean,
            default: false,
        },
        mainCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MainCategory",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);