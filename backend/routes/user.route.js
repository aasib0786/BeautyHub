import { Router } from "express";
import { ForgotPassword, GetAllUsers, GetSingleUser, LogOut, ResetPassword, SignIn, SignUp,AdminSignIn, vendorRegister, verifyLoggedIn,updateProfile, changePassword, verifyAdminLoggedIn, SignUpRequest, verifySignUpOtp, updateUserRole, deleteUser, updateUserByAdmin } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandling.middleware.js";

const router=Router()

router.post("/send-sign-up-otp",SignUpRequest)
router.post("/verify-sign-up-otp",verifySignUpOtp)
router.post("/sign-up",SignUp)
router.post("/sign-in",SignIn)
router.post("/vendor/register", upload.fields([{ name: "panCardDoc", maxCount: 1 }, { name: "aadharCardDoc", maxCount: 1 }]), multerErrorHandler, vendorRegister)
router.post("/forgot-password",ForgotPassword)
router.post("/reset-password/:id/:token",ResetPassword)
router.get("/get-all-users",verifyToken,GetAllUsers)
router.get("/get-single-user",verifyToken,GetSingleUser)
router.get("/logout",verifyToken,LogOut)
router.get("/verify-user",verifyToken,verifyLoggedIn)
router.put("/update-profile",upload.single("image"),multerErrorHandler,verifyToken,updateProfile)
router.put("/change-password",verifyToken,changePassword)

//admin routes
router.post("/admin/sign-in",AdminSignIn)
router.get("/admin/verify-admin",verifyToken,verifyAdminLoggedIn)
router.put("/admin/update-profile",verifyToken,updateProfile)
router.put("/admin/change-password",verifyToken,changePassword)
router.put("/admin/update-user-role/:id",verifyToken,updateUserRole)
router.put("/admin/update-user/:id",verifyToken,updateUserByAdmin)
router.delete("/admin/delete-user/:id",verifyToken,deleteUser)
export default router
