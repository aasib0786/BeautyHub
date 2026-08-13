import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

// ─── Add To Cart Controller ───────────────────────────────────────────────────
const AddToCart = async (req, res) => {
  try {
    const userId = req?.user?._id;
    let { items } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Support single item object or items array
    if (req.body && req.body.productId) {
      items = [req.body];
    } else if (req.body && req.body.items && !Array.isArray(req.body.items)) {
      items = [req.body.items];
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required to add to cart" });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    for (const item of items) {
      const {
        productId,
        quantity = 1,
        sizeName = "",
        thickness = "",
        mattressDimension = "",
        mattressPrice,
        mattressFinalPrice,
      } = item;

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const qty = safeNumber(quantity, 1);
      if (qty <= 0) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }

      const product = await Product.findById(productId).lean();
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const itemPrice = safeNumber(mattressPrice, product.price || 0);
      const itemFinalPrice = safeNumber(
        mattressFinalPrice,
        product.finalPrice || product.price || 0
      );

      // Find existing item in cart
      const existingItemIndex = cart.items.findIndex(
        (ci) =>
          ci.productId.toString() === productId &&
          (ci.sizeName || "") === (sizeName || "") &&
          (ci.thickness || "") === (thickness || "") &&
          (ci.mattressDimension || "") === (mattressDimension || "")
      );

      const maxStock = product.stock || 100;

      if (existingItemIndex > -1) {
        const newQty = cart.items[existingItemIndex].quantity + qty;
        if (newQty > maxStock) {
          return res.status(400).json({
            message: `Only ${maxStock} units available for ${product.productName}`,
          });
        }
        cart.items[existingItemIndex].quantity = newQty;
        cart.items[existingItemIndex].mattressPrice = itemPrice;
        cart.items[existingItemIndex].mattressFinalPrice = itemFinalPrice;
      } else {
        if (qty > maxStock) {
          return res.status(400).json({
            message: `Only ${maxStock} units available for ${product.productName}`,
          });
        }
        cart.items.push({
          productId,
          quantity: qty,
          sizeName,
          thickness,
          mattressDimension,
          mattressPrice: itemPrice,
          mattressFinalPrice: itemFinalPrice,
        });
      }
    }

    // Recalculate total amount
    let total = 0;
    for (const ci of cart.items) {
      const pData = await Product.findById(ci.productId).lean();
      const unitPrice =
        safeNumber(ci.mattressFinalPrice) ||
        (pData ? pData.finalPrice || pData.price : 0);
      total += ci.quantity * unitPrice;
    }
    cart.totalAmount = Math.max(0, total);

    const updatedCart = await cart.save();
    const populatedCart = await Cart.findById(updatedCart._id).populate("items.productId");

    return res.status(200).json({
      message: "Item added to cart successfully",
      cart: populatedCart,
      updatedCart: populatedCart,
    });
  } catch (error) {
    console.error("Error in AddToCart:", error);
    return res.status(500).json({ message: "Failed to add item to cart", error: error.message });
  }
};

// ─── Update Cart Quantity ─────────────────────────────────────────────────────
const UpdateCartQuantity = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId, action } = req.body || {};

    if (!action) {
      return res.status(400).json({ message: "action ('increase' or 'decrease') is required" });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid user or product ID" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const product = await Product.findById(productId).lean();
    const maxStock = product?.stock || 100;
    const item = cart.items[itemIndex];

    if (action === "increase") {
      if (item.quantity + 1 > maxStock) {
        return res.status(400).json({
          message: `Cannot exceed stock limit. Available: ${maxStock}`,
        });
      }
      item.quantity += 1;
    } else if (action === "decrease") {
      if (item.quantity <= 1) {
        return res.status(400).json({ message: "Quantity cannot be less than 1" });
      }
      item.quantity -= 1;
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'increase' or 'decrease'" });
    }

    // Recalculate total amount
    let total = 0;
    for (const ci of cart.items) {
      const pData = await Product.findById(ci.productId).lean();
      const unitPrice =
        safeNumber(ci.mattressFinalPrice) ||
        (pData ? pData.finalPrice || pData.price : 0);
      total += ci.quantity * unitPrice;
    }
    cart.totalAmount = Math.max(0, total);

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.productId");

    return res.status(200).json({
      message: "Cart quantity updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error in UpdateCartQuantity:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ─── Remove From Cart ─────────────────────────────────────────────────────────
const RemoveFromCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body || {};

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    // Recalculate total amount
    let total = 0;
    for (const ci of cart.items) {
      const pData = await Product.findById(ci.productId).lean();
      const unitPrice =
        safeNumber(ci.mattressFinalPrice) ||
        (pData ? pData.finalPrice || pData.price : 0);
      total += ci.quantity * unitPrice;
    }
    cart.totalAmount = Math.max(0, total);

    const updatedCart = await cart.save();
    const populatedCart = await Cart.findById(updatedCart._id).populate("items.productId");

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart: populatedCart,
      updatedCart: populatedCart,
    });
  } catch (error) {
    console.error("Error in RemoveFromCart:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ─── Get Cart ─────────────────────────────────────────────────────────────────
const GetCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
      await cart.save();
    }

    let subtotal = 0;
    for (const item of cart.items) {
      if (item.productId) {
        const unitPrice =
          safeNumber(item.mattressFinalPrice) ||
          item.productId.finalPrice ||
          item.productId.price ||
          0;
        subtotal += unitPrice * item.quantity;
      }
    }

    const shippingCharge = subtotal >= 499 || subtotal === 0 ? 0 : 50;

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart,
      subtotal,
      shippingCharge,
    });
  } catch (error) {
    console.error("Error in GetCart:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ─── Delete / Empty Cart ──────────────────────────────────────────────────────
const DeleteCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(200).json({ message: "Cart emptied successfully" });
  } catch (error) {
    console.error("Error in DeleteCart:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export { AddToCart, GetCart, DeleteCart, RemoveFromCart, UpdateCartQuantity };
