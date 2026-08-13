import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandling.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllMaterials,
  getAllProducts,
  getFeaturedProducts,
  getProductByCategory,
  getSingleProduct,
  searchProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { verifyAdmin } from "../middlewares/adminVerification.middleware.js";

const router = Router();

router.post("/create-product", verifyAdmin, upload.array("images"), multerErrorHandler, createProduct);
router.get("/get-all-products", getAllProducts);
router.get("/get-single-product/:id", getSingleProduct);
router.put("/update-product/:id", verifyAdmin, upload.array("images"), multerErrorHandler, updateProduct);
router.delete("/delete-product/:id", verifyAdmin, deleteProduct);
router.get("/search", searchProducts);
router.get("/featured-products", getFeaturedProducts);
router.get("/get-products-by-category/:id", getProductByCategory);
router.get("/get-all-materials", getAllMaterials);

export default router;