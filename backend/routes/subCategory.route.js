import { Router } from "express";
import {multerErrorHandler} from "../middlewares/multerErrorHandling.middleware.js";
import { getAllSubCategories, getSingleSubCategory, createSubCategory, updateSubCategory, deleteSubCategory, getProductsBySubCategory } from "../controllers/subCategory.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/adminVerification.middleware.js";
const router = Router();

router.post(
  "/create-sub-category",
  verifyAdmin,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    { name: "collection", maxCount: 1 },
  ]),
  multerErrorHandler,
  createSubCategory
);
router.get("/get-all-sub-categories", getAllSubCategories);
router.get("/get-single-sub-category/:id", getSingleSubCategory);
router.put(
  "/update-sub-category/:id",
  verifyAdmin,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    { name: "collection", maxCount: 1 },
  ]),
  multerErrorHandler,
  updateSubCategory
);
router.delete("/delete-sub-category/:id",verifyAdmin, deleteSubCategory);
router.get("/get-products-by-sub-category/:id", getProductsBySubCategory);
export default router;
