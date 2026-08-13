import { OTP } from "../models/otp.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.util.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  domain:
    process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined,
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
    if (isUserExisted.role !== "admin") {
      return res.status(400).json({
        message: "Unauthorized ! Don't try to be smart you are not admin",
      });
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
      message: "Sign-in successfully",
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
    res.status(500).json({ message: "Admin Sign-in server error" });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const isAdmin = req?.user?.role;
    if (isAdmin !== "admin") {
      return res.status(403).json({
        message: "Unauthorized ! Don't try to be smart you are not admin",
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
      "-password -resetPasswordToken -resetPasswordExpires -role"
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
    const user = req?.user;
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized ! Don't try to be smart you are not admin",
      });
    }
    return res.status(200).json({ message: "Admin logged in", user });
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
    const {
      name,
      phone,
      city,
      pincode,
      address,
    } = req.body || {};

    user.name = name ?? user.name ?? "";
    user.phone = phone ?? user.phone ?? "";
    user.city = city ?? user.city ?? "";
    user.pincode = pincode ?? user.pincode ?? "";
    user.address = address ?? user.address ?? "";
    if (req.file && req.file?.path) {
      if (user.profileImage) {
        await deleteFromCloudinary(user.profileImage);
      }
      const imageUrl = await uploadOnCloudinary(req.file.path);
      user.profileImage = imageUrl ? imageUrl : user?.profileImage;
    }
    await user.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log("update profile in error", error);
    res.status(500).json({ message: "update profile in server error" });
  }
};

export {
  SignUpRequest,
  verifySignUpOtp,
  AdminSignIn,
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
};
