import SystemSettings from "../models/systemSettings.model.js";

// Get Global Settings
export const getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
      await settings.save();
    }
    return res.status(200).json({
      success: true,
      message: "System settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching system settings",
      error: error.message,
    });
  }
};

// Update System Settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }

    const fields = req.body || {};
    Object.keys(fields).forEach((key) => {
      if (key in settings) {
        settings[key] = fields[key];
      }
    });

    await settings.save();
    return res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating system settings",
      error: error.message,
    });
  }
};
