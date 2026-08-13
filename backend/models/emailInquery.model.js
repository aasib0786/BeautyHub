import mongoose from "mongoose";

const emailInquerySchema=new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
},{timestamps:true})

export default mongoose.model("EmailInquery", emailInquerySchema);