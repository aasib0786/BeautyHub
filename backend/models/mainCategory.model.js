import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema(
    {
        mainCategoryName: {
            type: String,
            required: true,
            trim: true,
        },
        mainCategoryImage: {
            type: String,
            required: true,
        },
        isCollection: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("MainCategory", mainCategorySchema);
