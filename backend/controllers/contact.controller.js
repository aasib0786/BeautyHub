import Contact from "../models/contact.model.js";

const createContact = async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body || {};

        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newContact = new Contact({
            fullName,
            email,
            subject,
            message,
        });

        const savedContact = await newContact.save();
        res.status(201).json({ message: "Contact created successfully", data: savedContact });
    } catch (error) {
        console.error("create contact error", error);
        res.status(500).json({ message: "Failed to create contact", error: error.message });
    }
};
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ message: "Contacts retrieved successfully", data: contacts });
    } catch (error) {
        console.error("get all contacts error", error);
        res.status(500).json({ message: "Failed to retrieve contacts", error: error.message });
    }
};
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json({ message: "Contact deleted successfully", data: deletedContact });
    } catch (error) {
        console.error("delete contact error", error);
        res.status(500).json({ message: "Failed to delete contact", error: error.message });
    }
};

export {createContact,getAllContacts,deleteContact}