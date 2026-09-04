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
import { aiAutoCreateProduct, aiChatAssistant } from "../controllers/aiProduct.controller.js";
import {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
  changeReviewStatus,
} from "../controllers/review.controller.js";
import { verifyAdmin } from "../middlewares/adminVerification.middleware.js";

const router = Router();

router.post("/ai-auto-create", verifyAdmin, upload.array("images"), multerErrorHandler, aiAutoCreateProduct);
router.post("/ai-chat-assistant", aiChatAssistant);
router.post("/create-product", verifyAdmin, upload.array("images"), multerErrorHandler, createProduct);


router.get("/get-all-products", getAllProducts);
router.get("/get-single-product/:id", getSingleProduct);
router.put("/update-product/:id", verifyAdmin, upload.array("images"), multerErrorHandler, updateProduct);
router.delete("/delete-product/:id", verifyAdmin, deleteProduct);
router.get("/search", searchProducts);
router.get("/featured-products", getFeaturedProducts);
router.get("/get-products-by-category/:id", getProductByCategory);
router.get("/get-all-materials", getAllMaterials);

// Review routes under product router as well
router.post("/create-review", createReview);
router.get("/get-all-reviews", getAllReviews);
router.get("/get-product-reviews/:productId", getProductReviews);
router.delete("/delete-reviews/:id", deleteReview);
router.get("/delete-reviews/:id", deleteReview);
router.post("/change-review-status", changeReviewStatus);

export default router;