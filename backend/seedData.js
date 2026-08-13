import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import MainCategory from "./models/mainCategory.model.js";
import Category from "./models/category.model.js";
import SubCategory from "./models/subCategory.model.js";
import Brand from "./models/brand.model.js";
import Product from "./models/product.model.js";
import { connectDB } from "./db/index.js";

async function seedData() {
  try {
    await connectDB();
    console.log("Connected to DB for seeding...");

    // 1. Seed Main Categories
    const mainCatsData = [
      { mainCategoryName: "Beauty & Skincare" },
      { mainCategoryName: "Teddy Bears & Plushies" },
      { mainCategoryName: "Gift Hampers & Combos" },
      { mainCategoryName: "Luxury Fragrances" },
    ];

    const mainCats = [];
    for (const mc of mainCatsData) {
      let existing = await MainCategory.findOne({ mainCategoryName: mc.mainCategoryName });
      if (!existing) {
        existing = await MainCategory.create(mc);
      }
      mainCats.push(existing);
    }
    console.log(`Seeded ${mainCats.length} Main Categories.`);

    // 2. Seed Brands
    const brandsData = [
      { brandName: "L'Oréal Paris", isFeatured: true },
      { brandName: "Huggy Teddies", isFeatured: true },
      { brandName: "Forest Essentials", isFeatured: true },
      { brandName: "Royal Gift Combo", isFeatured: true },
      { brandName: "MAC Cosmetics", isFeatured: true },
    ];

    const brands = [];
    for (const b of brandsData) {
      let existing = await Brand.findOne({ brandName: b.brandName });
      if (!existing) {
        existing = await Brand.create(b);
      }
      brands.push(existing);
    }
    console.log(`Seeded ${brands.length} Brands.`);

    // 3. Seed Categories
    const categoriesData = [
      {
        categoryName: "Glowing Skincare",
        mainCategory: mainCats[0]._id,
        categoryImage: "https://images.unsplash.com/photo-1608248597266-c89a9c148386?w=600&q=80",
        isCollection: true,
      },
      {
        categoryName: "Glamour Makeup",
        mainCategory: mainCats[0]._id,
        categoryImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
        isCollection: true,
      },
      {
        categoryName: "Giant & Soft Teddies",
        mainCategory: mainCats[1]._id,
        categoryImage: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&q=80",
        isCollection: true,
      },
      {
        categoryName: "Luxury Gift Combos",
        mainCategory: mainCats[2]._id,
        categoryImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
        isCollection: true,
      },
    ];

    const categories = [];
    for (const cat of categoriesData) {
      let existing = await Category.findOne({ categoryName: cat.categoryName });
      if (!existing) {
        existing = await Category.create(cat);
      }
      categories.push(existing);
    }
    console.log(`Seeded ${categories.length} Categories.`);

    // 4. Seed SubCategories
    const subCategoriesData = [
      {
        subCategoryName: "Rose Glow Serum",
        mainCategory: mainCats[0]._id,
        Category: categories[0]._id,
        subCategoryImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
      },
      {
        subCategoryName: "Velvet Matte Lipstick",
        mainCategory: mainCats[0]._id,
        Category: categories[1]._id,
        subCategoryImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
      },
      {
        subCategoryName: "5ft Life Size Teddy Bear",
        mainCategory: mainCats[1]._id,
        Category: categories[2]._id,
        subCategoryImage: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&q=80",
      },
      {
        subCategoryName: "Valentine Pamper Box",
        mainCategory: mainCats[2]._id,
        Category: categories[3]._id,
        subCategoryImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
      },
    ];

    const subCats = [];
    for (const sc of subCategoriesData) {
      let existing = await SubCategory.findOne({ subCategoryName: sc.subCategoryName });
      if (!existing) {
        existing = await SubCategory.create(sc);
      }
      subCats.push(existing);
    }
    console.log(`Seeded ${subCats.length} Sub Categories.`);

    // 5. Seed Sample Beauty, Teddy & Gift Products
    const sampleProducts = [
      {
        productName: "Radiant 24K Gold Rose Serum",
        price: 2499,
        discount: 30,
        finalPrice: 1749,
        mainCategory: mainCats[0]._id,
        category: categories[0]._id,
        subCategory: subCats[0]._id,
        brand: brands[2]._id,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"],
        description: "<p>100% Organic 24K Gold infused rose face serum for instant glass skin glow and 24-hour hydration.</p>",
        features: ["24K Gold Infused", "100% Organic & Cruelty Free", "24H Moisture Lock", "Dermatologist Tested"],
        metaTitle: "Radiant 24K Gold Rose Glow Serum - BeautyHub",
        metaDescription: "Shop 100% organic 24K Gold rose face serum for instant glass skin radiance.",
        metaKeywords: "serum, gold serum, rose face oil, glow",
        seoAttributes: [
          { key: "Skin Type", value: "All Skin Types" },
          { key: "Volume", value: "50 ml" },
          { key: "Finish", value: "Radiant Glass Glow" },
        ],
        isFeatured: true,
      },
      {
        productName: "Velvet Matte Ruby Red Lipstick",
        price: 1299,
        discount: 25,
        finalPrice: 974,
        mainCategory: mainCats[0]._id,
        category: categories[1]._id,
        subCategory: subCats[1]._id,
        brand: brands[4]._id,
        images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80"],
        description: "<p>High-pigment, non-drying velvet matte lipstick with up to 16-hour long-stay formula.</p>",
        features: ["16-Hour Stay", "Transfer Proof", "Enriched with Vitamin E", "Smudge-Free Matte"],
        metaTitle: "Velvet Matte Ruby Red Lipstick - MAC BeautyHub",
        metaDescription: "Long-lasting transfer proof ruby red lipstick for glamour look.",
        metaKeywords: "lipstick, matte lipstick, red lipstick, mac makeup",
        seoAttributes: [
          { key: "Finish", value: "Velvet Matte" },
          { key: "Shade", value: "Ruby Red 01" },
          { key: "Stay Time", value: "Up to 16 Hours" },
        ],
        isFeatured: true,
      },
      {
        productName: "Giant 5ft Ultra Soft Velvet Teddy Bear",
        price: 4999,
        discount: 40,
        finalPrice: 2999,
        mainCategory: mainCats[1]._id,
        category: categories[2]._id,
        subCategory: subCats[2]._id,
        brand: brands[1]._id,
        images: ["https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&q=80"],
        description: "<p>Premium 5ft life size cuddly teddy bear crafted with hypoallergenic soft velvet plush fabric.</p>",
        features: ["5 Feet Life Size", "Hypoallergenic Velvet", "Non-Toxic Soft Filling", "Includes Satin Ribbon"],
        metaTitle: "Giant 5ft Soft Cuddly Teddy Bear - HuggyTeddies",
        metaDescription: "Buy giant 5ft plush teddy bear for birthdays, anniversaries & surprise gifts.",
        metaKeywords: "teddy bear, plush toy, 5ft teddy, gift teddy",
        seoAttributes: [
          { key: "Size", value: "5 Feet (152 cm)" },
          { key: "Fabric", value: "Ultra Soft Premium Velvet" },
          { key: "Occasion", value: "Birthday / Anniversary / Valentine" },
        ],
        isFeatured: true,
      },
      {
        productName: "Royal Pamper Beauty & Chocolate Gift Hamper",
        price: 3999,
        discount: 35,
        finalPrice: 2599,
        mainCategory: mainCats[2]._id,
        category: categories[3]._id,
        subCategory: subCats[3]._id,
        brand: brands[3]._id,
        images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"],
        description: "<p>Luxury wooden gift box packed with Rose Serum, Scented Candle, Artisan Chocolates & Teddy Keychain.</p>",
        features: ["Luxury Wooden Trunk", "Includes Scented Candle", "Artisan Chocolates", "Personalized Gift Card"],
        metaTitle: "Royal Pamper Beauty & Chocolate Gift Hamper - BeautyHub",
        metaDescription: "Curated luxury gift hamper with beauty essentials, chocolates & greeting card.",
        metaKeywords: "gift hamper, beauty combo, gift box, birthday gift",
        seoAttributes: [
          { key: "Box Material", value: "Handcrafted Wooden Gift Box" },
          { key: "Contents", value: "Serum, Candle, Chocolates & Teddy" },
          { key: "Customization", value: "Free Personalized Message Card" },
        ],
        isFeatured: true,
      },
    ];

    for (const prod of sampleProducts) {
      let existing = await Product.findOne({ productName: prod.productName });
      if (!existing) {
        await Product.create(prod);
      }
    }
    console.log("Seeded sample products successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedData();
