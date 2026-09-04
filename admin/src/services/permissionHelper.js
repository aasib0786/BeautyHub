export const hasPermission = (user, roleDetails, moduleName, action = "read") => {
  if (!user) return false;

  const roleStr = (user.role || "").toLowerCase();

  // Super Admin has full unrestricted access
  if (
    roleStr === "super_admin" ||
    roleStr === "superadmin" ||
    roleStr === "super admin"
  ) {
    return true;
  }

  // Check 4-Column Module Permissions Matrix
  if (roleDetails && Array.isArray(roleDetails.modulePermissions)) {
    const foundMod = roleDetails.modulePermissions.find(
      (m) => m.module?.toLowerCase() === moduleName?.toLowerCase()
    );
    if (foundMod) {
      return !!foundMod[action];
    }
  }

  // Fallback boolean checks from user.permissions
  if (user.permissions) {
    const permMap = {
      "Dashboard": "manageProducts",
      "Manage Orders": "manageOrders",
      "All Main Category": "manageCategories",
      "All Category": "manageCategories",
      "All SubCategory": "manageCategories",
      "Manage Brands": "manageBrands",
      "All Products": "manageProducts",
      "All Videos": "manageVideos",
      "Manage Banners": "manageBanners",
      "Manage Sizes": "manageProducts",
      "Manage Coupons": "manageCoupons",
      "All Users": "manageProducts",
      "All product Inquiries": "manageProducts",
      "All Contact Inquiries": "manageProducts",
      "Franchise Requests": "manageProducts",
      "Email Inquiries": "manageProducts",
      "Manage Reviews": "manageReviews",
      "Admin & Staff Roles": "systemSettings",
      "System Settings": "systemSettings",
    };


    const key = permMap[moduleName];
    if (key && user.permissions[key] !== undefined) {
      return !!user.permissions[key];
    }
  }


  return false;
};
