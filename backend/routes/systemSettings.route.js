import express from "express";
import { getSettings, updateSettings } from "../controllers/systemSettings.controller.js";

const router = express.Router();

router.get("/get-settings", getSettings);
router.put("/update-settings", updateSettings);

export default router;
