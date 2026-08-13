import Size from "../models/size.model.js";

/* ---------------- CREATE ---------------- */
export const createSize = async (req, res) => {
    try {
        const size = await Size.create(req.body);
        res.status(201).json({
            success: true,
            message: "Size created successfully",
            data: size,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/* ---------------- READ ALL ---------------- */
export const getAllSizes = async (req, res) => {
    try {
        const sizes = await Size.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: sizes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ---------------- READ ONE ---------------- */
export const getSizeById = async (req, res) => {
    try {
        const size = await Size.findById(req.params.id);
        if (!size) {
            return res.status(404).json({
                success: false,
                message: "Size not found",
            });
        }
        res.status(200).json({
            success: true,
            data: size,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ---------------- UPDATE ---------------- */
export const updateSize = async (req, res) => {
    try {
        const updatedSize = await Size.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSize) {
            return res.status(404).json({
                success: false,
                message: "Size not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Size updated successfully",
            data: updatedSize,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/* ---------------- DELETE ---------------- */
export const deleteSize = async (req, res) => {
    try {
        const size = await Size.findByIdAndDelete(req.params.id);

        if (!size) {
            return res.status(404).json({
                success: false,
                message: "Size not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Size deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
