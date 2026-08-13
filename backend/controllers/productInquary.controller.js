import ProductInquary from "../models/productInquary.model.js";

/**
 * CREATE product inquiry
 */
export const createProductInquary = async (req, res) => {
    try {
        const { name, size, phone, userId, productId } = req.body || {};
        console.log("XXXXXXX::=>", req.body)
        if (!name || !size || !phone || !productId) {
            return res.status(400).json({
                success: false,
                message: "Name, email and phone are required",
            });
        }

        const inquiry = await ProductInquary.create({
            name,
            size,
            productId,
            phone,
            userId: userId || null,
        });

        return res.status(201).json({
            success: true,
            message: "Product inquiry created successfully",
            data: inquiry,
        });
    } catch (error) {
        console.error("create product inquiry error", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create product inquiry",
        });
    }
};

/**
 * GET all product inquiries
 */
export const getAllProductInquary = async (req, res) => {
    try {
        const inquiries = await ProductInquary.find()
            .sort({ createdAt: -1 })
            .populate("userId", "name email").populate("productId", "productName images");

        return res.status(200).json({
            success: true,
            message: "Product inquiries fetched successfully",
            data: inquiries,
        });
    } catch (error) {
        console.error("get product inquiries error", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch product inquiries",
        });
    }
};

/**
 * GET single inquiry by ID
 */
export const getProductInquaryById = async (req, res) => {
    try {
        const { id } = req.params;

        const inquiry = await ProductInquary.findById(id);
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Product inquiry not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: inquiry,
        });
    } catch (error) {
        console.error("get inquiry by id error", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch product inquiry",
        });
    }
};

/**
 * DELETE inquiry
 */
export const deleteProductInquary = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ProductInquary.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Product inquiry not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product inquiry deleted successfully",
        });
    } catch (error) {
        console.error("delete inquiry error", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete product inquiry",
        });
    }
};
