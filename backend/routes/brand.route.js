import express from "express";
import {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandling.middleware.js";
import { verifyAdmin } from "../middlewares/adminVerification.middleware.js";

const router = express.Router();

router.post("/create-brand", verifyAdmin, upload.single("image"), multerErrorHandler, createBrand);
router.get("/get-all-brands", getAllBrands);
router.get("/get-single-brand/:id", getSingleBrand);
router.put("/update-brand/:id", verifyAdmin, upload.single("image"), multerErrorHandler, updateBrand);
router.delete("/delete-brand/:id", verifyAdmin, deleteBrand);

export default router;
