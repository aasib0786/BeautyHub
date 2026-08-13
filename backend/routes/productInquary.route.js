import express from "express";
import {
    createProductInquary,
    getAllProductInquary,
    getProductInquaryById,
    deleteProductInquary,
} from "../controllers/productInquary.controller.js";

const router = express.Router();

router.post("/create-inquery", createProductInquary);          // CREATE
router.get("/get-all-inquery", getAllProductInquary);            // READ ALL
router.get("/:id", getProductInquaryById);        // READ ONE
router.delete("/delete-inquery/:id", deleteProductInquary);      // DELETE

export default router;
