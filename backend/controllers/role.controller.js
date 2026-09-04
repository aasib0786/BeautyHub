import Role from "../models/role.model.js";

const defaultModules = [
  "Dashboard",
  "Manage Orders",
  "All Main Category",
  "All Category",
  "All SubCategory",
  "Manage Brands",
  "All Products",
  "All Videos",
  "Manage Banners",
  "Manage Sizes",
  "Manage Coupons",
  "All Users",
  "All product Inquiries",
  "All Contact Inquiries",
  "Franchise Requests",
  "Email Inquiries",
  "Manage Reviews",
  "Admin & Staff Roles",
  "System Settings",
];



// Seed Default System Roles if empty or sync modules
const seedDefaultRolesIfEmpty = async (userId) => {
  const count = await Role.countDocuments();
  if (count === 0) {
    const superAdminPerms = defaultModules.map((mod) => ({
      module: mod,
      read: true,
      write: true,
      update: true,
      delete: true,
    }));

    const salesPerms = defaultModules.map((mod) => ({
      module: mod,
      read: true,
      write: ["All Products", "Manage Orders"].includes(mod),
      update: ["All Products", "Manage Orders"].includes(mod),
      delete: false,
    }));

    const packingPerms = defaultModules.map((mod) => ({
      module: mod,
      read: ["Manage Orders", "All Products"].includes(mod),
      write: false,
      update: ["Manage Orders"].includes(mod),
      delete: false,
    }));

    await Role.insertMany([
      { roleName: "Super Admin", description: "Full platform access across all modules", modulePermissions: superAdminPerms, createdBy: userId },
      { roleName: "SALESMAN", description: "Sales orders and product management", modulePermissions: salesPerms, createdBy: userId },
      { roleName: "packing", description: "Order packing & warehouse dispatch status", modulePermissions: packingPerms, createdBy: userId },
    ]);
  } else {
    // Synchronize any existing roles with all 20 modules
    const roles = await Role.find();
    for (const r of roles) {
      const existingMap = new Map((r.modulePermissions || []).map((p) => [p.module, p]));
      let hasChanges = false;
      const updatedPerms = defaultModules.map((mod) => {
        const found = existingMap.get(mod);
        if (!found) {
          hasChanges = true;
          return {
            module: mod,
            read: r.roleName.toLowerCase().includes("super") ? true : false,
            write: r.roleName.toLowerCase().includes("super") ? true : false,
            update: r.roleName.toLowerCase().includes("super") ? true : false,
            delete: r.roleName.toLowerCase().includes("super") ? true : false,
          };
        }
        return found;
      });

      if (hasChanges || updatedPerms.length !== r.modulePermissions.length) {
        r.modulePermissions = updatedPerms;
        await r.save();
      }
    }
  }
};


// 1. Get All Roles
export const getAllRoles = async (req, res) => {
  try {
    await seedDefaultRolesIfEmpty(req?.user?._id);
    const roles = await Role.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: roles.length, data: roles, defaultModules });
  } catch (error) {
    console.error("getAllRoles error:", error);
    return res.status(500).json({ message: "Error fetching roles", error: error.message });
  }
};

// 2. Create New Custom Role
export const createRole = async (req, res) => {
  try {
    const { roleName, description, modulePermissions } = req.body;

    if (!roleName) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const existingRole = await Role.findOne({ roleName: roleName.trim() });
    if (existingRole) {
      return res.status(400).json({ message: "Role with this name already exists" });
    }

    // Process perms or assign defaults
    let perms = modulePermissions;
    if (!perms || perms.length === 0) {
      perms = defaultModules.map((mod) => ({
        module: mod,
        read: false,
        write: false,
        update: false,
        delete: false,
      }));
    }

    const newRole = new Role({
      roleName: roleName.trim(),
      description: description || "",
      modulePermissions: perms,
      createdBy: req?.user?._id,
    });

    await newRole.save();

    return res.status(201).json({
      success: true,
      message: `Role '${newRole.roleName}' created successfully!`,
      data: newRole,
    });
  } catch (error) {
    console.error("createRole error:", error);
    return res.status(500).json({ message: "Error creating role", error: error.message });
  }
};

// 3. Update Role & Permission Matrix
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, description, modulePermissions } = req.body;

    const roleObj = await Role.findById(id);
    if (!roleObj) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (roleName) roleObj.roleName = roleName.trim();
    if (description !== undefined) roleObj.description = description;
    if (modulePermissions) roleObj.modulePermissions = modulePermissions;

    await roleObj.save();

    return res.status(200).json({
      success: true,
      message: `Role '${roleObj.roleName}' updated successfully!`,
      data: roleObj,
    });
  } catch (error) {
    console.error("updateRole error:", error);
    return res.status(500).json({ message: "Error updating role", error: error.message });
  }
};

// 4. Delete Role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const roleObj = await Role.findById(id);
    if (!roleObj) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (roleObj.roleName.toLowerCase() === "super admin") {
      return res.status(400).json({ message: "System Super Admin role cannot be deleted" });
    }

    await Role.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    console.error("deleteRole error:", error);
    return res.status(500).json({ message: "Error deleting role", error: error.message });
  }
};
