import Category from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import SubCategory from "../models/subCategory.model.js";
import Product from "../models/product.model.js";

const createCategory = async (req, res) => {
  try {
    const { categoryName, isCollection, mainCategory } = req.body || {};
    if (!categoryName) {
      return res.status(400).json({ message: "Category Name is required" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image is required" });
    }
    const categoryImageUrl = await uploadOnCloudinary(req.file.path);
    const newCategory = new Category({
      categoryName,
      categoryImage: categoryImageUrl,
      isCollection,
      mainCategory: mainCategory || null,
    });

    const savedCategory = await newCategory.save();
    return res
      .status(201)
      .json({ message: "Category created successfully", data: savedCategory });
  } catch (error) {
    console.error("create category error", error);
    res
      .status(500)
      .json({ message: "Failed to create category", error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("mainCategory").sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Categories retrieved successfully", data: categories });
  } catch (error) {
    console.error("get all categories error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve categories", error: error.message });
  }
};

const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate("mainCategory");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res
      .status(200)
      .json({ message: "Category retrieved successfully", data: category });
  } catch (error) {
    console.error("get single category error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve category", error: error.message });
  }
};

const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategories = await SubCategory.find({ Category: id }).populate("Category");
    return res.status(200).json({ message: "Sub categories retrieved successfully", data: subCategories });
  } catch (error) {
    console.log("get sub categories by category error", error);
    return res.status(500).json({ message: "Failed to retrieve sub categories", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, isCollection, mainCategory } = req.body || {};
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    let categoryImageUrl;
    if (req.file && req.file.path) {
      categoryImageUrl = await uploadOnCloudinary(req.file.path);
    }
    category.categoryName = categoryName ?? category.categoryName;
    if (categoryImageUrl) {
      category.categoryImage = categoryImageUrl;
    }
    category.isCollection = isCollection ?? category.isCollection;
    if (mainCategory !== undefined) {
      category.mainCategory = mainCategory || null;
    }
    const updatedCategory = await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("update category error", error);
    res
      .status(500)
      .json({ message: "Failed to update category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error("delete category error", error);
    res
      .status(500)
      .json({ message: "Failed to delete category", error: error.message });
  }
};

const getCategoriesWithSubcategoriesAndProducts = async (req, res) => {
  try {
    const topCategoryIds = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          productCount: { $sum: 1 },
        },
      },
      { $sort: { productCount: -1 } },
      { $limit: 5 },
    ]);

    const categoryIds = topCategoryIds.map((item) => item._id);

    const categories = await Category.find({ _id: { $in: categoryIds } }).select("_id categoryName").limit(6);

    const result = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await SubCategory.find({ Category: category._id }).limit(5);
        const subCategoriesWithProducts = await Promise.all(
          subCategories.map(async (sub) => {
            const products = await Product.find({ subCategory: sub._id }).select("productName _id");
            return {
              _id: sub._id,
              name: sub.subCategoryName,
              products,
            };
          })
        );

        return {
          _id: category._id,
          name: category.categoryName,
          subCategories: subCategoriesWithProducts,
        };
      })
    );

    return res.status(200).json({
      message: "Top categories with subcategories and products retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log("get category with subcategories and products", error);
    return res.status(500).json({ message: "Failed to retrieve categories", error: error.message });
  }
};

export {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getSubCategoriesByCategory,
  getCategoriesWithSubcategoriesAndProducts
};
