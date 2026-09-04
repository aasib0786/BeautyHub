import express from "express";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/role.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get("/get-all-roles", verifyToken, getAllRoles);
router.post("/create-role", verifyToken, createRole);
router.put("/update-role/:id", verifyToken, updateRole);
router.delete("/delete-role/:id", verifyToken, deleteRole);

export default router;
