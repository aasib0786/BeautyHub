import express from "express";
import { createEmailInquery, getAllEmailInqueries, deleteEmailInquery } from "../controllers/emailInquery.controller.js";

const router = express.Router();

router.post("/email-inqueries", createEmailInquery);      
router.get("/email-inqueries", getAllEmailInqueries);    
router.delete("/email-inqueries/:id", deleteEmailInquery); 

export default router;