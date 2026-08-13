import {Router} from "express";
import { createWishlist, getAllWishlists, deleteWishlist } from "../controllers/wishlist.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router=Router();

router.post("/add-to-wishlist",verifyToken,createWishlist);
router.get("/get-all-wishlists",verifyToken,getAllWishlists);
router.delete("/delete-wishlist/:id",verifyToken,deleteWishlist);

export default router;