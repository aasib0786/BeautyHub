import MainCategory from "../models/mainCategory.model.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

const createMainCategory = async (req, res) => {
  try {
    const { mainCategoryName, isCollection } = req.body || {};
    if (!mainCategoryName) {
      return res.status(400).json({ message: "Main Category Name is required" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image is required" });
    }

    const mainCategoryImageUrl = await uploadOnCloudinary(req.file.path);
    const newMainCategory = new MainCategory({
      mainCategoryName,
      mainCategoryImage: mainCategoryImageUrl,
      isCollection: isCollection === "true" || isCollection === true,
    });

    const savedMainCategory = await newMainCategory.save();
    return res.status(201).json({
      message: "Main Category created successfully",
      data: savedMainCategory,
    });
  } catch (error) {
    console.error("create main category error", error);
    res.status(500).json({ message: "Failed to create main category", error: error.message });
  }
};

const getAllMainCategories = async (req, res) => {
  try {
    const mainCategories = await MainCategory.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Main Categories retrieved successfully",
      data: mainCategories,
    });
  } catch (error) {
    console.error("get all main categories error", error);
    res.status(500).json({ message: "Failed to retrieve main categories", error: error.message });
  }
};

const getSingleMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const mainCategory = await MainCategory.findById(id);
    if (!mainCategory) {
      return res.status(404).json({ message: "Main Category not found" });
    }

    return res.status(200).json({
      message: "Main Category retrieved successfully",
      data: mainCategory,
    });
  } catch (error) {
    console.error("get single main category error", error);
    res.status(500).json({ message: "Failed to retrieve main category", error: error.message });
  }
};

const updateMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { mainCategoryName, isCollection } = req.body || {};
    const mainCategory = await MainCategory.findById(id);
    if (!mainCategory) {
      return res.status(404).json({ message: "Main Category not found" });
    }

    let mainCategoryImageUrl;
    if (req.file && req.file.path) {
      mainCategoryImageUrl = await uploadOnCloudinary(req.file.path);
    }

    mainCategory.mainCategoryName = mainCategoryName ?? mainCategory.mainCategoryName;
    if (mainCategoryImageUrl) {
      mainCategory.mainCategoryImage = mainCategoryImageUrl;
    }
    if (isCollection !== undefined) {
      mainCategory.isCollection = isCollection === "true" || isCollection === true;
    }

    const updatedMainCategory = await mainCategory.save();
    return res.status(200).json({
      message: "Main Category updated successfully",
      data: updatedMainCategory,
    });
  } catch (error) {
    console.error("update main category error", error);
    res.status(500).json({ message: "Failed to update main category", error: error.message });
  }
};

const deleteMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMainCategory = await MainCategory.findByIdAndDelete(id);
    if (!deletedMainCategory) {
      return res.status(404).json({ message: "Main Category not found" });
    }

    return res.status(200).json({
      message: "Main Category deleted successfully",
      data: deletedMainCategory,
    });
  } catch (error) {
    console.error("delete main category error", error);
  }
};

const getNavbarCategoriesTree = async (req, res) => {
  try {
    // Strictly fetch ONLY MainCategories where isCollection === true (Show in Header/Navbar)
    const mainCategories = await MainCategory.find({ isCollection: true }).sort({ createdAt: -1 });

    const [categories, subCategories] = await Promise.all([
      Category.find().populate("mainCategory"),
      SubCategory.find().populate("Category").populate("mainCategory"),
    ]);



    const getIdStr = (val) => {
      if (!val) return "";
      if (typeof val === "object" && val._id) return String(val._id);
      return String(val);
    };

    let tree = [];

    if (mainCategories && mainCategories.length > 0) {
      tree = mainCategories.map((main) => {
        const mainIdStr = String(main._id);
        const matchingCats = categories.filter(
          (c) => getIdStr(c.mainCategory) === mainIdStr
        );

        const categoriesWithSubs = matchingCats.map((cat) => {
          const catIdStr = String(cat._id);
          const matchingSubs = subCategories.filter(
            (s) => getIdStr(s.Category) === catIdStr
          );
          return {
            _id: cat._id,
            categoryName: cat.categoryName,
            categoryImage: cat.categoryImage,
            subCategories: matchingSubs.map((s) => ({
              _id: s._id,
              subCategoryName: s.subCategoryName,
              subCategoryImage: s.subCategoryImage,
            })),
          };
        });

        return {
          _id: main._id,
          mainCategoryName: main.mainCategoryName,
          mainCategoryImage: main.mainCategoryImage,
          categories: categoriesWithSubs,
        };
      });

      const unattachedCats = categories.filter(
        (c) => !c.mainCategory || !mainCategories.some((m) => String(m._id) === getIdStr(c.mainCategory))
      );

      if (unattachedCats.length > 0) {
        const unattachedWithSubs = unattachedCats.map((cat) => {
          const catIdStr = String(cat._id);
          const matchingSubs = subCategories.filter(
            (s) => getIdStr(s.Category) === catIdStr
          );
          return {
            _id: cat._id,
            categoryName: cat.categoryName,
            categoryImage: cat.categoryImage,
            subCategories: matchingSubs.map((s) => ({
              _id: s._id,
              subCategoryName: s.subCategoryName,
              subCategoryImage: s.subCategoryImage,
            })),
          };
        });

        tree.push({
          _id: "other-categories",
          mainCategoryName: "More Categories",
          mainCategoryImage: "",
          categories: unattachedWithSubs,
        });
      }
    } else {
      const categoriesWithSubs = categories.map((cat) => {
        const catIdStr = String(cat._id);
        const matchingSubs = subCategories.filter(
          (s) => getIdStr(s.Category) === catIdStr
        );
        return {
          _id: cat._id,
          categoryName: cat.categoryName,
          categoryImage: cat.categoryImage,
          subCategories: matchingSubs.map((s) => ({
            _id: s._id,
            subCategoryName: s.subCategoryName,
            subCategoryImage: s.subCategoryImage,
          })),
        };
      });

      if (categoriesWithSubs.length > 0) {
        tree.push({
          _id: "all-db-categories",
          mainCategoryName: "All Categories",
          mainCategoryImage: "",
          categories: categoriesWithSubs,
        });
      }
    }

    return res.status(200).json({
      message: "Navbar category tree retrieved successfully",
      data: tree,
    });
  } catch (error) {
    console.error("getNavbarCategoriesTree error", error);
    return res.status(500).json({ message: "Failed to load navbar categories tree", error: error.message });
  }
};

export {
  createMainCategory,
  getAllMainCategories,
  getSingleMainCategory,
  updateMainCategory,
  deleteMainCategory,
  getNavbarCategoriesTree,
};
