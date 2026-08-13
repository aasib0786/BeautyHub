import { Wishlist } from "../models/wishlist.model.js";
import mongoose from "mongoose";

// const createWishlist = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { productId } = req.body;
//     console.log("product , id==>", _id, productId);
//     if (!productId) {
//       return res.status(400).json({ message: "Product ID is required" });
//     }

//     const wishlist = await Wishlist.findOne({ user: _id });
//     if (wishlist) {
//       const alreadyExists = wishlist.products.includes(productId);
//       if (!alreadyExists) {
//         wishlist.products.push(productId);
//         await wishlist.save();
//       } else {
//         wishlist.products = wishlist.products.filter((id) => id !== JSON.stringify(productId));
//         console.log("wishlist==>", wishlist.products);
//         await wishlist.save();
//         return res.status(201).json({ message: "Wishlist removed successfully" });
//       }
//     } else {
//       await Wishlist.create({ productId: [productId], user: _id });
//     }
//     return res.status(201).json({ message: "Wishlist created successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// };


const createWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    // 👉 If wishlist does not exist → CREATE & ADD
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [productId], });

      return res.status(201).json({ message: "Product added to wishlist", action: "added", wishlist, });
    }

    // 👉 Check if product already exists
    const productIndex = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    // 👉 REMOVE
    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();

      return res.status(200).json({ message: "Product removed from wishlist", action: "removed", wishlist, });
    }

    // 👉 ADD
    wishlist.products.push(productId);
    await wishlist.save();

    return res.status(200).json({ message: "Product added to wishlist", action: "added", wishlist, });
  } catch (error) {
    console.error("createWishlist error:", error);
    return res.status(500).json({ message: "Internal server error", });
  }
};


const getAllWishlists = async (req, res) => {
  try {
    if (!req?.user?._id) {
      return res.status(400).json({ message: "You are not logged in" });
    }
    const wishlists = await Wishlist.findOne({ user: req?.user?._id }).populate("products");
    console.log("wishlists==>", wishlists);
    return res.status(200).json({ message: "All wishlists", wishlists });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    if (!req?.user?._id) {
      return res.status(400).json({ message: "You are not logged in" });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const wishlist = await Wishlist.findOneAndUpdate({ user: req?.user?._id }, { $pull: { products: id } }, { new: true });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    return res.status(200).json({ message: "Wishlist deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export { createWishlist, getAllWishlists, deleteWishlist };
