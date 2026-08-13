import express from "express";
import {
  createMainCategory,
  getAllMainCategories,
  getSingleMainCategory,
  updateMainCategory,
  deleteMainCategory,
  getNavbarCategoriesTree,
} from "../controllers/mainCategory.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandling.middleware.js";
import { verifyAdmin } from "../middlewares/adminVerification.middleware.js";

const router = express.Router();

router.post("/create-main-category", verifyAdmin, upload.single("image"), multerErrorHandler, createMainCategory);
router.get("/get-all-main-categories", getAllMainCategories);
router.get("/get-navbar-categories-tree", getNavbarCategoriesTree);
router.get("/get-single-main-category/:id", getSingleMainCategory);
router.put("/update-main-category/:id", verifyAdmin, upload.single("image"), multerErrorHandler, updateMainCategory);
router.delete("/delete-main-category/:id", verifyAdmin, deleteMainCategory);

export default router;
