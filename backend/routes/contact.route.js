import {Router} from "express";
import { createContact, getAllContacts, deleteContact } from "../controllers/contact.controller.js";
import { verifyAdmin } from "../middlewares/adminVerification.middleware.js";

const router=Router();

router.post("/create-contact",createContact);
router.get("/get-all-contacts",getAllContacts);
router.delete("/delete-contact/:id",verifyAdmin,deleteContact);

export default router;