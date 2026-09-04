import Review from "../models/review.model.js";

// 1. Create a new review
export const createReview = async (req, res) => {
  try {
    const {
      productId,
      product,
      name,
      email,
      rating,
      reviewTitle,
      reviewText,
      comment,
      profileImage,
    } = req.body;

    const targetProductId = productId || product;
    const textContent = reviewText || comment;

    if (!targetProductId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required to post a review.",
      });
    }

    if (!name || !textContent) {
      return res.status(400).json({
        success: false,
        message: "Name and Review comment are required.",
      });
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview = new Review({
      product: targetProductId,
      user: req.user?._id || req.user?.id || null,
      name: name.trim(),
      email: (email || "").trim(),
      rating: numericRating,
      reviewTitle: (reviewTitle || "").trim(),
      reviewText: textContent.trim(),
      profileImage: profileImage || "",
      status: true,
      isVerifiedBuyer: true,
    });

    const savedReview = await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review: savedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit review.",
    });
  }
};

// 2. Get reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const reviews = await Review.find({
      product: productId,
      status: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : 5.0;

    return res.status(200).json({
      success: true,
      totalReviews,
      averageRating: Number(averageRating),
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product reviews.",
    });
  }
};

// 3. Get all reviews (for Admin Panel)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch all reviews.",
    });
  }
};

// 4. Delete a review by ID
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully!",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete review.",
    });
  }
};

// 5. Change review visibility status (Show / Hide)
export const changeReviewStatus = async (req, res) => {
  try {
    const { reviewId, status } = req.body;

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required.",
      });
    }

    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { status: Boolean(status) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review status updated successfully!",
      review: updated,
    });
  } catch (error) {
    console.error("Change review status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update review status.",
    });
  }
};
