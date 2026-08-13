import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: Number.MAX_SAFE_INTEGER
        },
        finalPrice: {
            type: Number,
            required: true,
        },
        mainCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MainCategory",
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
        },
        brandName: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        features: {
            type: [String],
            default: [],
        },
        metaTitle: {
            type: String,
            default: "",
        },
        metaDescription: {
            type: String,
            default: "",
        },
        metaKeywords: {
            type: String,
            default: "",
        },
        seoAttributes: [
            {
                key: { type: String, required: true },
                value: { type: String, required: true },
            }
        ],
        material: {
            type: String,
        },
        weight: {
            type: String,
        },
        size: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Size",
        }],
        sku: {
            type: String,
        },
        dimensionsInch: {
            type: String,
        },
        dimensionsCm: {
            type: String,
        },
        Specifications: {
            type: String,
        },
        BrandCollectionOverview: {
            type: String,
        },
        CareMaintenance: {
            type: String,
        },
        seller: {
            type: String
        },
        Warranty: {
            type: String,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        ingredients: {
            type: String,
            default: "",
        },
        howToUse: {
            type: String,
            default: "",
        },
        safetyInfo: {
            type: String,
            default: "",
        },
        skinType: {
            type: String,
            default: "",
        },
        idealFor: {
            type: String,
            default: "",
        },
        form: {
            type: String,
            default: "",
        },
        shelfLife: {
            type: String,
            default: "",
        },
        countryOfOrigin: {
            type: String,
            default: "",
        },
        manufacturerDetails: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);