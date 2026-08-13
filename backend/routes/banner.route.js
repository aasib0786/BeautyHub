import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandling.middleware.js";
import { DeleteBanner, GetAllBanners, GetSingleBanner, UpdateBanner, CreateBanner } from "../controllers/banner.controller.js";
import { verifyAdmin } from "../middlewares/adminVerification.middleware.js";

const router = Router();

router.post("/create-banner",verifyAdmin,   
    upload.single("image"),
    multerErrorHandler,CreateBanner)
router.put("/update-banner/:id",verifyAdmin,        
    upload.single("image"),
    multerErrorHandler,UpdateBanner)
router.get("/get-all-banners",GetAllBanners)
router.get("/get-single-banner/:id",GetSingleBanner)
router.delete("/delete-banner/:id",verifyAdmin,DeleteBanner)

export default router