import express from "express";
import {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    getSubCategoriesByCategory,
    getCategoriesWithSubcategoriesAndProducts,
} from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandling.middleware.js";
import { verifyAdmin } from "../middlewares/adminVerification.middleware.js";

const router = express.Router();

router.post("/create-category",verifyAdmin,upload.single("image"),multerErrorHandler, createCategory); 
router.get("/get-all-categories", getAllCategories); 
router.get("/get-single-category/:id", getSingleCategory); 
router.get("/get-subcategories-by-category/:id", getSubCategoriesByCategory);
router.put("/update-category/:id",verifyAdmin,upload.single("image"),multerErrorHandler, updateCategory); 
router.delete("/delete-category/:id", verifyAdmin,deleteCategory); 
router.get("/get-categories-with-subcategories-and-products",getCategoriesWithSubcategoriesAndProducts)

export default router;