import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

// 1. Get All Admins & Staff (For Super Admin & Parent Admins)
export const getAllAdmins = async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const userId = req?.user?._id;

    // Admin & Staff Roles console sees ONLY Admin, Staff, Vendor, and Custom Roles (excluding customers)
    const accounts = await User.find({ role: { $ne: "user" } }).select("-password").sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: accounts.length, data: accounts });

  } catch (error) {
    console.error("getAllAdmins error:", error);
    return res.status(500).json({ message: "Error fetching admin accounts", error: error.message });
  }
};

// Get All Vendor Accounts with Product Counts
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("-password").sort({ createdAt: -1 });

    const vendorsWithCounts = await Promise.all(
      vendors.map(async (v) => {
        const vObj = v.toObject();
        const productCount = await Product.countDocuments({ createdBy: v._id });
        vObj.productCount = productCount;
        return vObj;
      })
    );

    return res.status(200).json({ success: true, count: vendorsWithCounts.length, data: vendorsWithCounts });
  } catch (error) {
    console.error("getAllVendors error:", error);
    return res.status(500).json({ message: "Error fetching vendor accounts", error: error.message });
  }
};

// Update Vendor KYC Details & Documents (Admin Console)
export const updateVendorKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      businessName,
      gstNumber,
      panNumber,
      aadharNumber,
      isVerified,
    } = req.body || {};

    const vendor = await User.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor account not found" });
    }

    if (businessName !== undefined) vendor.businessName = businessName;
    if (gstNumber !== undefined) vendor.gstNumber = gstNumber;
    if (panNumber !== undefined) vendor.panNumber = panNumber;
    if (aadharNumber !== undefined) vendor.aadharNumber = aadharNumber;

    if (isVerified !== undefined) {
      vendor.isVerified = isVerified === "true" || isVerified === true;
    }

    if (req.files) {
      if (req.files.panCardDoc && req.files.panCardDoc[0]) {
        const panUrl = await uploadOnCloudinary(req.files.panCardDoc[0].path);
        if (panUrl) vendor.panCardDoc = panUrl;
      }
      if (req.files.aadharCardDoc && req.files.aadharCardDoc[0]) {
        const aadharUrl = await uploadOnCloudinary(req.files.aadharCardDoc[0].path);
        if (aadharUrl) vendor.aadharCardDoc = aadharUrl;
      }
    }

    await vendor.save();

    const updatedVendor = vendor.toObject();
    delete updatedVendor.password;

    return res.status(200).json({
      success: true,
      message: "Vendor KYC details and documents updated successfully!",
      data: updatedVendor,
    });
  } catch (error) {
    console.error("updateVendorKYC error:", error);
    return res.status(500).json({ message: "Error updating vendor KYC", error: error.message });
  }
};

// 2. Create New Admin / Staff Account
export const createAdminAccount = async (req, res) => {
  try {
    const loggedInRole = req?.user?.role;
    const loggedInId = req?.user?._id;

    const { name, email, password, phone, role, permissions, businessName, gstNumber, panNumber, aadharNumber } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Name, email, password, and phone are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    let targetRole = role || "staff";

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
      manageCategories: true,
      manageBrands: true,
      manageBanners: true,
      manageVideos: true,
      manageCoupons: true,
      manageReviews: true,
      systemSettings: false,
      ...permissions,
    };

    const newAccount = new User({
      name,
      email,
      password,
      phone,
      businessName: businessName || "",
      gstNumber: gstNumber || "",
      panNumber: panNumber || "",
      aadharNumber: aadharNumber || "",
      panCardDoc: panCardDocUrl || "",
      aadharCardDoc: aadharCardDocUrl || "",
      role: targetRole,
      isVerified: true,
      createdBy: loggedInId,
      parentAdmin: loggedInRole === "admin" ? loggedInId : null,
      permissions: defaultPerms,
    });

    await newAccount.save();

    const result = newAccount.toObject();
    delete result.password;

    return res.status(201).json({
      success: true,
      message: `${targetRole.toUpperCase()} account created successfully!`,
      data: result,
    });
  } catch (error) {
    console.error("createAdminAccount error:", error);
    return res.status(500).json({ message: "Error creating admin account", error: error.message });
  }
};

// 3. Toggle Admin / Vendor Verification Status
export const toggleAdminVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = (req?.user?.role || "").toLowerCase();
    if (!["admin", "superadmin", "super_admin"].includes(userRole)) {
      return res.status(403).json({ message: "Only Admin or Super Admin can toggle verification status" });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "Account not found" });
    }

    targetUser.isVerified = !targetUser.isVerified;
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `Account verification updated to: ${targetUser.isVerified ? "VERIFIED" : "UNVERIFIED"}`,
      data: targetUser,
    });
  } catch (error) {
    console.error("toggleAdminVerification error:", error);
    return res.status(500).json({ message: "Error toggling verification", error: error.message });
  }
};

// 4. Update Admin Modular Permissions (Super Admin / Parent Admin)
export const updateAdminPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions, role } = req.body;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (permissions) {
      targetUser.permissions = {
        ...targetUser.permissions,
        ...permissions,
      };
    }

    if (role) {
      targetUser.role = role;
    }

    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      data: targetUser,
    });
  } catch (error) {
    console.error("updateAdminPermissions error:", error);
    return res.status(500).json({ message: "Error updating permissions", error: error.message });
  }
};

// 5. Delete Admin / Staff / Vendor Account
export const deleteAdminAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = (req?.user?.role || "").toLowerCase();

    if (!["admin", "superadmin", "super_admin"].includes(userRole)) {
      return res.status(403).json({ message: "Only Admin or Super Admin can delete accounts" });
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("deleteAdminAccount error:", error);
    return res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};

