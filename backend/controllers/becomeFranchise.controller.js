import becomeFranchiseModel from "../models/becomeFranchise.model.js";

const createFranchise=async(req,res)=>{
    try{
        const {fullName,email,phone,address,investmentBudget,message}=req.body||{};
        if(!fullName||!email||!phone||!address||!investmentBudget||!message){
            return res.status(400).json({message:"All fields are required"});
        }
        const newFranchise=new becomeFranchiseModel({
            fullName,
            email,
            phone,
            address,
            investmentBudget,
            message
        });
        const savedFranchise=await newFranchise.save();
        res.status(201).json({message:"Franchise created successfully",data:savedFranchise});
    }catch(error){
        console.error("create franchise error",error);
        res.status(500).json({message:"Failed to create franchise",error:error.message});
    }
}

const getAllFranchises=async(req,res)=>{
    try{
        const franchises=await becomeFranchiseModel.find();
        res.status(200).json({message:"Franchises fetched successfully",data:franchises});
    }catch(error){
        console.error("get franchises error",error);
        res.status(500).json({message:"Failed to get franchises",error:error.message});
    }
}

const deleteFranchise=async(req,res)=>{
    try{
        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:"Franchise id is required"});
        }
        const deletedFranchise=await becomeFranchiseModel.findByIdAndDelete(id);
        if(!deletedFranchise){
            return res.status(404).json({message:"Franchise not found"});
        }
        res.status(200).json({message:"Franchise deleted successfully",data:deletedFranchise});
    }catch(error){
        console.error("delete franchise error",error);
        res.status(500).json({message:"Failed to delete franchise",error:error.message});
    }
}

export {createFranchise,getAllFranchises,deleteFranchise};