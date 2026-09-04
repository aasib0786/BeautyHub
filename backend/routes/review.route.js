import express from "express";
import {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
  changeReviewStatus,
} from "../controllers/review.controller.js";

const router = express.Router();

// Create review (Mobile / Web)
router.post("/create", createReview);
router.post("/create-review", createReview);

// Get reviews for a specific product
router.get("/product/:productId", getProductReviews);
router.get("/get-product-reviews/:productId", getProductReviews);

// Admin endpoints
router.get("/all", getAllReviews);
router.get("/get-all-reviews", getAllReviews);

router.delete("/delete/:id", deleteReview);
router.get("/delete-reviews/:id", deleteReview);
router.delete("/delete-reviews/:id", deleteReview);

router.post("/change-status", changeReviewStatus);
router.post("/change-review-status", changeReviewStatus);

export default router;
