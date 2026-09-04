import express from "express";
import {
  getAllAdmins,
  getAllVendors,
  createAdminAccount,
  toggleAdminVerification,
  updateAdminPermissions,
  updateVendorKYC,
  deleteAdminAccount,
} from "../controllers/adminManagement.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandling.middleware.js";

const router = express.Router();

const vendorDocFields = upload.fields([
  { name: "panCardDoc", maxCount: 1 },
  { name: "aadharCardDoc", maxCount: 1 },
]);

router.get("/get-all-admins", verifyToken, getAllAdmins);
router.get("/get-all-vendors", verifyToken, getAllVendors);
router.post("/create-admin", vendorDocFields, multerErrorHandler, verifyToken, createAdminAccount);
router.put("/update-vendor-kyc/:id", vendorDocFields, multerErrorHandler, verifyToken, updateVendorKYC);
router.put("/toggle-verification/:id", verifyToken, toggleAdminVerification);
router.put("/update-permissions/:id", verifyToken, updateAdminPermissions);
router.delete("/delete-admin/:id", verifyToken, deleteAdminAccount);

export default router;
