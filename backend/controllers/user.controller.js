import { OTP } from "../models/otp.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import crypto from "crypto";

import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.util.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 2592000000,
};

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 1000000);
  return otp.toString();
};

const sentSignUpMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,  // use 587 for TLS
      secure: true,
      // requireTLS: true,
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAILUSER,
      email: process.env.EMAILUSER,
      to: email,
      subject: "Your OTP for Verification - BeautyHub",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #c2185b; text-align: center;">BeautyHub</h2>
            <p style="font-size: 16px;">Dear User,</p>
            <p style="font-size: 16px;">Your One-Time Password (OTP) for verifying your account is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold; background-color: #fff0f5; color: #c2185b; padding: 10px 20px; border-radius: 8px; display: inline-block; letter-spacing: 5px;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #555;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
            <p style="font-size: 14px; margin-top: 30px;">Best regards,<br><strong>BeautyHub Team</strong></p>
          </div>
        `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent: ", info.response);
      }
    });
  } catch (error) {
    console.error("Error while sending email: ", error);
  }
};
const sentResetPasswordMail = async (email, myToken, id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAILUSER,
      to: email,
      subject: "For Reset password",
      html: `
      <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Password</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #e6f4fb;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 50px auto;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #4e342e;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 30px;
        color: #333;
      }
      .content h2 {
        margin-top: 0;
      }
      .button {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 25px;
        background-color:#4e342e;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        padding: 15px;
        font-size: 13px;
        color: #888;
        text-align: center;
        background-color: #f0f9ff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <h2>Hello,</h2>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
  
        <a href="${process.env.BASE_URL}/Pages/reset-password/${id}/${myToken}" >${process.env.BASE_URL
        }/Pages/reset-password/${id}/${myToken}</a>
        <p><strong>Note:</strong> This link will expire after a short time for your security.</p>
        <p style="color: red;"><strong>Do not share this email or link with anyone.</strong> If you didn’t request a password reset, please ignore this email or contact support.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} BeautyHub. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent: ", info.response);
      }
    });
  } catch (error) {
    console.error("Error while sending email: ", error);
  }
};
const SignUpRequest = async (req, res) => {
  try {
    const { email } = req.body || {};
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const otp = generateOTP();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await sentSignUpMail(email, otp);
    const isExisted = await OTP.find({ email })
    if (isExisted.length > 0) {
      await OTP.deleteMany({ email });
    }
    await OTP.create({ email, otp: hashedOtp, expiresAt: otpExpiry });

    return res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("sign up request error", error);
    return res.status(500).json({ message: "Sign-up request server error" });
  }
};

const verifySignUpOtp = async (req, res) => {
  try {
    const { otp, email } = req.body || {};
    const hashedOtp = crypto.createHash("sha256").update(otp.toString()).digest("hex");
    const isExisted = await OTP.findOne({ email, otp: hashedOtp });
    if (!isExisted) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    isExisted.isVerified = true;
    await isExisted.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log("verify sign up otp error", error);
    return res.status(500).json({ message: "verify sign up otp server error" });
  }
};
const SignUp = async (req, res) => {
  try {
    const { email, fullName, phone, password } = req.body || {};

    if (!email || !fullName || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isVerifiedUser = await OTP.findOne({ email, isVerified: true });
    if (!isVerifiedUser) {
      return res.status(400).json({ message: "OTP not verified" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({ email, name: fullName, phone, password });
    await isVerifiedUser.deleteOne();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sign-up server error" });
  }
};

const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const isUserExisted = await User.findOne({ email });
    if (!isUserExisted) {
      return res.status(400).json({ message: "User not found" });
    }

    const IsCorrectPassword = await bcrypt.compare(
      password,
      isUserExisted?.password
    );

    if (!IsCorrectPassword) {
      return res
        .status(400)
        .json({ message: "Authorized failed ! password is incorrect" });
    }

    const token = await isUserExisted.generateJwtToken();
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Sign-in successful",
      token,
      user: {
        id: isUserExisted._id,
        fullName: isUserExisted.fullName,
        email: isUserExisted.email,
        phone: isUserExisted.phone,
        role: isUserExisted.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sign-in server error" });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found " });
    }
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15;
    await user.save();

    await sentResetPasswordMail(email, token, user._id);
    return res
      .status(200)
      .json({ message: "Reset password link sent successfully" });
  } catch (error) {
    console.log("forgot password error", error);
    res.status(500).json({ message: "forgot password server error" });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body || {};

    if (!id || !token || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      _id: id,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found or Your reset link is expired" });

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("reset password error", error);
    res.status(500).json({ message: "reset password server error" });
  }
};
const AdminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const isUserExisted = await User.findOne({ email });
    if (!isUserExisted) {
      return res.status(400).json({ message: "Admin account not found. Please verify email or username." });
    }
    if (!["admin", "super_admin", "superadmin", "vendor", "staff"].includes(isUserExisted.role)) {
      return res.status(400).json({
        message: "Unauthorized ! You do not have admin access privileges.",
      });
    }

    if (isUserExisted.role === "vendor" && isUserExisted.isVerified === false) {
      return res.status(403).json({
        message: "Your Vendor account is pending verification & approval by the Admin. Please wait for approval.",
      });
    }

    const IsCorrectPassword = await bcrypt.compare(
      password,
      isUserExisted?.password
    );
    if (!IsCorrectPassword) {
      return res
        .status(400)
        .json({ message: "Authorization failed ! Password is incorrect" });
    }
    const token = await isUserExisted.generateJwtToken();
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      message: "Sign-in successfully",
      token,
      user: {
        id: isUserExisted._id,
        fullName: isUserExisted.name || isUserExisted.fullName,
        email: isUserExisted.email,
        phone: isUserExisted.phone,
        role: isUserExisted.role,
        permissions: isUserExisted.permissions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Admin Sign-in server error" });
  }
};

const vendorRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      businessName,
      gstNumber,
      panNumber,
      aadharNumber,
    } = req.body || {};

    if (!name || !email || !password || !phone || !businessName || !panNumber || !aadharNumber) {
      return res.status(400).json({
        message: "Name, email, password, phone, business name, PAN, and Aadhaar numbers are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    let panCardDocUrl = "";
    let aadharCardDocUrl = "";

    if (req.files) {
      if (req.files.panCardDoc && req.files.panCardDoc[0]) {
        panCardDocUrl = await uploadOnCloudinary(req.files.panCardDoc[0].path);
      }
      if (req.files.aadharCardDoc && req.files.aadharCardDoc[0]) {
        aadharCardDocUrl = await uploadOnCloudinary(req.files.aadharCardDoc[0].path);
      }
    }

    const defaultPerms = {
      manageProducts: true,
      manageOrders: true,
      manageCategories: false,
      manageBrands: false,
      manageBanners: false,
      manageVideos: false,
      manageCoupons: false,
      manageReviews: false,
      systemSettings: false,
    };

    const newVendor = new User({
      name,
      email,
      password,
      phone,
      businessName,
      gstNumber: gstNumber || "",
      panNumber,
      aadharNumber,
      panCardDoc: panCardDocUrl || "",
      aadharCardDoc: aadharCardDocUrl || "",
      role: "vendor",
      isVerified: false,
      permissions: defaultPerms,
    });

    await newVendor.save();

    const result = newVendor.toObject();
    delete result.password;

    return res.status(201).json({
      success: true,
      message: "Vendor registration request submitted successfully! Pending Admin verification and approval.",
      data: result,
    });
  } catch (error) {
    console.error("vendorRegister error:", error);
    return res.status(500).json({ message: "Vendor registration server error", error: error.message });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const isAdmin = req?.user?.role;
    if (!["admin", "super_admin", "superadmin"].includes(isAdmin)) {
      return res.status(403).json({
        message: "Unauthorized access",
      });
    }
    const users = await User.find().select("-password");
    return res.status(200).json({ message: "All users", users });
  } catch (error) {
    console.log("get all users error", error);
    res.status(500).json({ message: "get all users server error" });
  }
};

const GetSingleUser = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      return res.status(400).json({ message: "User id is required" });
    }
    const user = await User.findById(_id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    return res.status(200).json({ message: "Single user", user });
  } catch (error) {
    console.log("get single user error", error);
    res.status(500).json({ message: "get single user server error" });
  }
};

const LogOut = async (req, res) => {
  try {
    const id = req?.user?._id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "Admin account not found. Please verify email or username." });
    }

    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log("logout error", error);
    res.status(500).json({ message: "logout server error" });
  }
};

const verifyAdminLoggedIn = async (req, res) => {
  try {
    const tokenUser = req?.user;
    if (!tokenUser || !["admin", "super_admin", "superadmin", "vendor", "staff"].includes(tokenUser.role)) {
      return res.status(403).json({
        message: "Unauthorized access",
      });
    }

    const user = await User.findById(tokenUser._id).select("-password");

    if (user && user.role === "vendor" && user.isVerified === false) {
      return res.status(403).json({
        message: "Your Vendor account is pending verification and approval by Admin.",
      });
    }

    let roleDetails = null;
    if (user && user.role) {
      roleDetails = await Role.findOne({
        roleName: { $regex: new RegExp(`^${user.role.replace("_", " ")}$`, "i") },
      });
      if (!roleDetails) {
        roleDetails = await Role.findOne({
          roleName: { $regex: new RegExp(`^${user.role}$`, "i") },
        });
      }
    }

    return res.status(200).json({ message: "Admin logged in", user: user || tokenUser, roleDetails });
  } catch (error) {
    console.log("verify admin logged in error", error);
    res.status(500).json({ message: "verify admin logged in server error" });
  }
};

const verifyLoggedIn = async (req, res) => {
  try {
    const data = req?.user;
    const user = await User.findById(data._id).select(
      "-password -resetPasswordToken -resetPasswordExpires "
    );
    return res.status(200).json({ message: "user logged in", user });
  } catch (error) {
    console.log("verify logged in error", error);
    res.status(500).json({ message: "verify admin logged in server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = req?.user;
    if (!data) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = await User.findById(data._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      name,
      email,
      phone,
      city,
      pincode,
      address,
    } = req.body || {};

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "This email address is already in use" });
      }
      user.email = email.toLowerCase();
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (pincode !== undefined) user.pincode = pincode;
    if (address !== undefined) user.address = address;

    if (req.file && req.file?.path) {
      if (user.profileImage) {
        await deleteFromCloudinary(user.profileImage);
      }
      const imageUrl = await uploadOnCloudinary(req.file.path);
      user.profileImage = imageUrl ? imageUrl : user?.profileImage;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.resetPasswordToken;
    delete updatedUser.resetPasswordExpires;

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log("update profile in error", error);
    res.status(500).json({ message: "update profile in server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const data = req?.user;
    if (!data || !data._id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }

    const user = await User.findById(data._id);
    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ message: "Server error while changing password", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!id || !role) {
      return res.status(400).json({ message: "User ID and Role are required" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = role;
    await user.save();
    return res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("update user role error", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("delete user error", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    await user.save();
    return res.status(200).json({ success: true, message: "User details updated successfully", user });
  } catch (error) {
    console.error("update user details error", error);
    res.status(500).json({ message: "Error updating user details" });
  }
};

export {
  SignUpRequest,
  verifySignUpOtp,
  AdminSignIn,
  vendorRegister,
  SignUp,
  SignIn,
  GetAllUsers,
  GetSingleUser,
  ForgotPassword,
  ResetPassword,
  LogOut,
  verifyAdminLoggedIn,
  verifyLoggedIn,
  updateProfile,
  changePassword,
  updateUserRole,
  deleteUser,
  updateUserByAdmin,
};
