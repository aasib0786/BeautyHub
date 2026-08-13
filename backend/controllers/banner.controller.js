import Banner  from "../models/banner.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.util.js";
import SubCategory from "../models/subCategory.model.js";

const CreateBanner = async (req, res) => {
  try {
    
    const { isActive,title,description,subCategory } = req.body;
    if (!isActive || !title || !description || !subCategory) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
  const  ExistingSubCategory = await SubCategory.findById(subCategory);
  if(!ExistingSubCategory){
    return res.status(404).json({ message: "Sub category not found" });
  }
    const bannerImage = await uploadOnCloudinary(req.file.path);
    const banner = await Banner.create({
      bannerImage,
      isActive,
      title,
      description,
      subCategory
    });
    return res
      .status(201)
      .json({ message: "Banner created successfully", banner });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const UpdateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, title, description, subCategory } = req.body;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (req.file && req.file?.path) {
      const url = await uploadOnCloudinary(req.file.path);
      banner.bannerImage = url ? url : banner.bannerImage;
    } else {
      banner.bannerImage = banner.bannerImage;
    }

    banner.isActive = isActive ?? banner.isActive;
    banner.title = title ?? banner.title;
    banner.description = description ?? banner.description;
    if(subCategory){
      const ExistingSubCategory = await SubCategory.findById(subCategory);
      if(!ExistingSubCategory){
        return res.status(404).json({ message: "Sub category not found" });
      }
    }
    banner.subCategory = subCategory ?? banner.subCategory;
    await banner.save();
    return res
      .status(200)
      .json({ message: "Banner updated successfully", banner });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};


const GetAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().populate("subCategory");
    return res.status(200).json({ message: "All banners", banners });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

const GetSingleBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    return res.status(200).json({ message: "Banner found", banner });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
const DeleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

  await  deleteFromCloudinary(banner.bannerImage);
    return res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export { CreateBanner, UpdateBanner, GetAllBanners, GetSingleBanner, DeleteBanner };