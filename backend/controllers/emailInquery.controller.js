import EmailInquery from "../models/emailInquery.model.js";

const createEmailInquery = async (req, res) => {
    try {
        const { email } = req.body || {};
        const newInquery = new EmailInquery({ email });
        const saved = await newInquery.save();
        res.status(201).json({ message: "Email inquiry created", data: saved });
    } catch (error) {
        res.status(500).json({ message: "Failed to create inquiry", error: error.message });
    }
};


const getAllEmailInqueries = async (req, res) => {
    try {
        const inqueries = await EmailInquery.find();
        res.status(200).json({ message: "All email inquiries", data: inqueries });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch inquiries", error: error.message });
    }
};

const deleteEmailInquery = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await EmailInquery.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json({ message: "Inquiry deleted", data: deleted });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete inquiry", error: error.message });
    }
};

export { createEmailInquery, getAllEmailInqueries, deleteEmailInquery };