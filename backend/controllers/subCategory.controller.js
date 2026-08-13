import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import SubCategory from "../models/subCategory.model.js";
import Product from "../models/product.model.js";

const createSubCategory = async (req, res) => {
  try {
    const { mainCategory, category, subCategoryName, isCollection } = req.body || {};
    if (!category || !subCategoryName) {
      return res.status(400).json({ message: "Category and Sub Category Name are required" });
    }

    const subCategoryImage = req.files?.image?.[0]?.path;
    if (!subCategoryImage) {
      return res.status(400).json({ message: "Image is required" });
    }
    const subCategoryImageUrl = await uploadOnCloudinary(subCategoryImage);
    const collectionImage = req.files?.collection?.[0]?.path;
    let collectionImageURL;
    if (collectionImage) {
      collectionImageURL = await uploadOnCloudinary(collectionImage);
    }

    const newSubCategory = await SubCategory.create({
      subCategoryName,
      subCategoryImage: subCategoryImageUrl,
      collectionImage: collectionImageURL ?? "",
      mainCategory: mainCategory || null,
      Category: category,
      isCollection: isCollection === "true" || isCollection === true,
    });

    return res.status(201).json({
      message: "Sub category created successfully",
      data: newSubCategory,
    });
  } catch (error) {
    console.log("create sub category error", error);
    return res
      .status(500)
      .json({ message: "Failed to create sub category", error: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { mainCategory, category, subCategoryName, isCollection } = req.body || {};

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub category not found" });
    }

    let subCategoryImageUrl;
    if (req.files?.image?.[0]?.path) {
      subCategoryImageUrl = await uploadOnCloudinary(req.files.image[0].path);
    }
    let collectionImageURL;
    if (req.files?.collection?.[0]?.path) {
      collectionImageURL = await uploadOnCloudinary(req.files.collection[0].path);
    }

    subCategory.subCategoryName = subCategoryName ?? subCategory.subCategoryName;
    if (subCategoryImageUrl) {
      subCategory.subCategoryImage = subCategoryImageUrl;
    }
    if (collectionImageURL) {
      subCategory.collectionImage = collectionImageURL;
    }
    if (mainCategory !== undefined) {
      subCategory.mainCategory = mainCategory || null;
    }
    if (category !== undefined) {
      subCategory.Category = category || null;
    }
    if (isCollection !== undefined) {
      subCategory.isCollection = isCollection === "true" || isCollection === true;
    }

    const updatedSubCategory = await subCategory.save();

    return res.status(200).json({
      message: "Sub category updated successfully",
      data: updatedSubCategory,
    });
  } catch (error) {
    console.log("update sub category error", error);
    return res
      .status(500)
      .json({ message: "Failed to update sub category", error: error.message });
  }
};

const getSingleSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id)
      .populate("mainCategory")
      .populate("Category");

    if (!subCategory) {
      return res.status(404).json({ message: "Sub category not found" });
    }

    return res.status(200).json({
      message: "Sub category retrieved successfully",
      data: subCategory,
    });
  } catch (error) {
    console.log("get single sub category error", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve sub category", error: error.message });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("mainCategory")
      .populate("Category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Sub categories retrieved successfully",
      data: subCategories,
    });
  } catch (error) {
    console.log("get all sub categories error", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve sub categories", error: error.message });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await SubCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Sub category not found" });
    }
    return res.status(200).json({
      message: "Sub category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error("delete sub category error", error);
    res
      .status(500)
      .json({ message: "Failed to delete sub category", error: error.message });
  }
};

const getProductsBySubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ subCategory: id }).populate("subCategory");
    return res.status(200).json({ message: "Products retrieved successfully", data: products });
  } catch (error) {
    console.log("get products by sub category error", error);
    return res.status(500).json({ message: "Failed to retrieve products", error: error.message });
  }
};

export {
  createSubCategory,
  updateSubCategory,
  getSingleSubCategory,
  getAllSubCategories,
  deleteSubCategory,
  getProductsBySubCategory,
};