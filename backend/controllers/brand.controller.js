import Brand from "../models/brand.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

const createBrand = async (req, res) => {
  try {
    const { brandName, description, isFeatured } = req.body || {};
    if (!brandName) {
      return res.status(400).json({ message: "Brand Name is required" });
    }

    let brandLogoUrl = "";
    if (req.file && req.file.path) {
      brandLogoUrl = await uploadOnCloudinary(req.file.path);
    }

    const newBrand = new Brand({
      brandName,
      brandLogo: brandLogoUrl,
      description,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    const savedBrand = await newBrand.save();
    return res.status(201).json({
      message: "Brand created successfully",
      data: savedBrand,
    });
  } catch (error) {
    console.error("create brand error", error);
    res.status(500).json({ message: "Failed to create brand", error: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Brands retrieved successfully",
      data: brands,
    });
  } catch (error) {
    console.error("get all brands error", error);
    res.status(500).json({ message: "Failed to retrieve brands", error: error.message });
  }
};

const getSingleBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    return res.status(200).json({
      message: "Brand retrieved successfully",
      data: brand,
    });
  } catch (error) {
    console.error("get single brand error", error);
    res.status(500).json({ message: "Failed to retrieve brand", error: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, description, isFeatured } = req.body || {};

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    let brandLogoUrl;
    if (req.file && req.file.path) {
      brandLogoUrl = await uploadOnCloudinary(req.file.path);
    }

    brand.brandName = brandName ?? brand.brandName;
    if (brandLogoUrl) {
      brand.brandLogo = brandLogoUrl;
    }
    if (description !== undefined) {
      brand.description = description;
    }
    if (isFeatured !== undefined) {
      brand.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    const updatedBrand = await brand.save();
    return res.status(200).json({
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("update brand error", error);
    res.status(500).json({ message: "Failed to update brand", error: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    return res.status(200).json({
      message: "Brand deleted successfully",
      data: deletedBrand,
    });
  } catch (error) {
    console.error("delete brand error", error);
    res.status(500).json({ message: "Failed to delete brand", error: error.message });
  }
};

export {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
