import mongoose from "mongoose";
import dns from "dns"

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


export const connectDB=async()=>{
try {
 const connection= await mongoose.connect(process.env.MONGO_URL);  
 console.log("mongodb connected",connection.connection.host);
} catch (error) {
    console.log("mongoose error",error);
    process.exit(1);
}
}