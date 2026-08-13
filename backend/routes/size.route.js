import express from "express";
import {
    createSize,
    getAllSizes,
    getSizeById,
    updateSize,
    deleteSize,
} from "../controllers/size.controller.js";

const router = express.Router();

router.post("/create-size", createSize);
router.get("/get-all-sizes", getAllSizes);
router.get("/get-size/:id", getSizeById);
router.put("/update-size/:id", updateSize);
router.delete("/delete-size/:id", deleteSize);

export default router;
