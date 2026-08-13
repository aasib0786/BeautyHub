import Product from "../models/product.model.js";
import MainCategory from "../models/mainCategory.model.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";
import Brand from "../models/brand.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

const createProduct = async (req, res) => {
  try {
    const {
      productName,
      price,
      discount,
      brand,
      description,
      material,
      weight,
      sku,
      dimensionsInch,
      dimensionsCm,
      mainCategory,
      category,
      subCategory,
      Specifications,
      BrandCollectionOverview,
      CareMaintenance,
      seller,
      Warranty,
      isFeatured,
      size,
      metaTitle,
      metaDescription,
      metaKeywords,
      ingredients,
      howToUse,
      safetyInfo,
      skinType,
      idealFor,
      form,
      shelfLife,
      countryOfOrigin,
      manufacturerDetails,
    } = req.body || {};

    if (!productName || !price || !description) {
      return res.status(400).json({ message: "Product Name, Price, and Description are required" });
    }

    let finalPrice = price - (price * (discount || 0)) / 100;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one product image is required" });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ message: "Maximum 5 images are allowed" });
    }
    const imageUploadPromises = req.files.map((file) =>
      uploadOnCloudinary(file.path)
    );
    const images = await Promise.all(imageUploadPromises);

    let parsedSize = [];
    if (Array.isArray(req.body.size)) {
      parsedSize = req.body.size;
    } else if (typeof req.body.size === "string") {
      try {
        parsedSize = JSON.parse(req.body.size);
      } catch (err) {
        parsedSize = req.body.size.split(",");
      }
    }

    let parsedFeatures = [];
    if (req.body.features) {
      if (Array.isArray(req.body.features)) {
        parsedFeatures = req.body.features;
      } else if (typeof req.body.features === "string") {
        try {
          parsedFeatures = JSON.parse(req.body.features);
        } catch (e) {
          parsedFeatures = req.body.features.split(",").map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    let parsedSeoAttributes = [];
    if (req.body.seoAttributes) {
      if (Array.isArray(req.body.seoAttributes)) {
        parsedSeoAttributes = req.body.seoAttributes;
      } else if (typeof req.body.seoAttributes === "string") {
        try {
          parsedSeoAttributes = JSON.parse(req.body.seoAttributes);
        } catch (e) {
          parsedSeoAttributes = [];
        }
      }
    }

    const newProduct = new Product({
      productName,
      images,
      price,
      discount: discount || 0,
      finalPrice,
      mainCategory: mainCategory || null,
      category: category || null,
      subCategory: subCategory || null,
      brand: brand || null,
      description,
      features: parsedFeatures,
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      metaKeywords: metaKeywords || "",
      seoAttributes: parsedSeoAttributes,
      isFeatured: isFeatured === "true" || isFeatured === true,
      material: material || "",
      weight: weight || "",
      sku: sku || "",
      dimensionsInch: dimensionsInch || "",
      dimensionsCm: dimensionsCm || "",
      Specifications: Specifications || "",
      BrandCollectionOverview: BrandCollectionOverview || "",
      CareMaintenance: CareMaintenance || "",
      seller: seller || "",
      Warranty: Warranty || "",
      size: parsedSize,
      ingredients: ingredients || "",
      howToUse: howToUse || "",
      safetyInfo: safetyInfo || "",
      skinType: skinType || "",
      idealFor: idealFor || "",
      form: form || "",
      shelfLife: shelfLife || "",
      countryOfOrigin: countryOfOrigin || "",
      manufacturerDetails: manufacturerDetails || "",
    });

    await newProduct.save();
    return res.status(201).json({ message: "Product created successfully", data: newProduct });
  } catch (error) {
    console.error("create product error", error);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      price,
      discount,
      stock,
      brand,
      description,
      isFeatured,
      material,
      weight,
      sku,
      dimensionsInch,
      dimensionsCm,
      mainCategory,
      category,
      subCategory,
      Specifications,
      BrandCollectionOverview,
      CareMaintenance,
      seller,
      Warranty,
      size,
      metaTitle,
      metaDescription,
      metaKeywords,
      ingredients,
      howToUse,
      safetyInfo,
      skinType,
      idealFor,
      form,
      shelfLife,
      countryOfOrigin,
      manufacturerDetails,
    } = req.body || {};

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let parsedSize = product.size;
    if (size) {
      if (Array.isArray(size)) {
        parsedSize = size;
      } else if (typeof size === "string") {
        try {
          parsedSize = JSON.parse(size);
        } catch (err) {
          parsedSize = size.split(",");
        }
      }
    }

    if (req.body.features !== undefined) {
      if (Array.isArray(req.body.features)) {
        product.features = req.body.features;
      } else if (typeof req.body.features === "string") {
        try {
          product.features = JSON.parse(req.body.features);
        } catch (e) {
          product.features = req.body.features.split(",").map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    if (req.body.seoAttributes !== undefined) {
      if (Array.isArray(req.body.seoAttributes)) {
        product.seoAttributes = req.body.seoAttributes;
      } else if (typeof req.body.seoAttributes === "string") {
        try {
          product.seoAttributes = JSON.parse(req.body.seoAttributes);
        } catch (e) {
          product.seoAttributes = [];
        }
      }
    }

    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ message: "Maximum 5 images are allowed" });
      }
      const imageUploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path)
      );
      const images = await Promise.all(imageUploadPromises);
      product.images = images;
    }

    let priceValue = price ?? product.price;
    let discountValue = discount ?? product.discount;
    let finalPrice = priceValue - (priceValue * discountValue) / 100;

    product.productName = productName ?? product.productName;
    product.price = priceValue;
    product.discount = discountValue;
    if (stock !== undefined) product.stock = stock;
    product.finalPrice = finalPrice;
    if (mainCategory !== undefined) product.mainCategory = mainCategory || null;
    if (category !== undefined) product.category = category || null;
    if (subCategory !== undefined) product.subCategory = subCategory || null;
    if (brand !== undefined) product.brand = brand || null;
    product.description = description ?? product.description;
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined) product.metaDescription = metaDescription;
    if (metaKeywords !== undefined) product.metaKeywords = metaKeywords;

    if (isFeatured !== undefined) product.isFeatured = isFeatured === "true" || isFeatured === true;
    product.material = material ?? product.material;
    product.weight = weight ?? product.weight;
    product.sku = sku ?? product.sku;
    product.dimensionsInch = dimensionsInch ?? product.dimensionsInch;
    product.dimensionsCm = dimensionsCm ?? product.dimensionsCm;
    product.Specifications = Specifications ?? product.Specifications;
    product.BrandCollectionOverview = BrandCollectionOverview ?? product.BrandCollectionOverview;
    product.CareMaintenance = CareMaintenance ?? product.CareMaintenance;
    product.seller = seller ?? product.seller;
    product.Warranty = Warranty ?? product.Warranty;
    product.size = parsedSize;

    if (ingredients !== undefined) product.ingredients = ingredients;
    if (howToUse !== undefined) product.howToUse = howToUse;
    if (safetyInfo !== undefined) product.safetyInfo = safetyInfo;
    if (skinType !== undefined) product.skinType = skinType;
    if (idealFor !== undefined) product.idealFor = idealFor;
    if (form !== undefined) product.form = form;
    if (shelfLife !== undefined) product.shelfLife = shelfLife;
    if (countryOfOrigin !== undefined) product.countryOfOrigin = countryOfOrigin;
    if (manufacturerDetails !== undefined) product.manufacturerDetails = manufacturerDetails;

    const updatedProduct = await product.save();

    return res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error("update product error", error);
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("mainCategory")
      .populate("category")
      .populate("subCategory")
      .populate("brand")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "Products retrieved successfully", data: products });
  } catch (error) {
    console.error("get all products error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve products", error: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("mainCategory")
      .populate("category")
      .populate("subCategory")
      .populate("brand")
      .populate("size");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    console.error("get single product error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", data: deletedProduct });
  } catch (error) {
    console.error("delete product error", error);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const {
      query,
      keyword,
      search,
      category,
      mainCategory,
      subCategory,
      brand,
      priceMin,
      priceMax,
      discountMin,
      sortBy,
    } = req.query || {};

    const searchTerm = (query || keyword || search || "").trim();
    let mongoQuery = {};

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");

      // Find matching categories, subcategories, brands, main categories by name
      const [matchingMains, matchingCats, matchingSubs, matchingBrands] = await Promise.all([
        MainCategory.find({ mainCategoryName: searchRegex }).select("_id"),
        Category.find({ categoryName: searchRegex }).select("_id"),
        SubCategory.find({ subCategoryName: searchRegex }).select("_id"),
        Brand.find({ brandName: searchRegex }).select("_id"),
      ]);

      const mainIds = matchingMains.map((m) => m._id);
      const catIds = matchingCats.map((c) => c._id);
      const subIds = matchingSubs.map((s) => s._id);
      const brandIds = matchingBrands.map((b) => b._id);

      mongoQuery.$or = [
        { productName: searchRegex },
        { description: searchRegex },
        { metaKeywords: searchRegex },
        { metaTitle: searchRegex },
        { ingredients: searchRegex },
        { skinType: searchRegex },
        { form: searchRegex },
        { idealFor: searchRegex },
        { material: searchRegex },
        { sku: searchRegex },
        { features: searchRegex },
      ];

      if (mainIds.length > 0) mongoQuery.$or.push({ mainCategory: { $in: mainIds } });
      if (catIds.length > 0) mongoQuery.$or.push({ category: { $in: catIds } });
      if (subIds.length > 0) mongoQuery.$or.push({ subCategory: { $in: subIds } });
      if (brandIds.length > 0) mongoQuery.$or.push({ brand: { $in: brandIds } });
    }

    // Category filter
    if (category && category !== "all") {
      mongoQuery.category = category;
    }

    // Main Category filter
    if (mainCategory && mainCategory !== "all") {
      mongoQuery.mainCategory = mainCategory;
    }

    // Sub Category filter
    if (subCategory && subCategory !== "all") {
      mongoQuery.subCategory = subCategory;
    }

    // Brand filter
    if (brand && brand !== "all") {
      mongoQuery.brand = brand;
    }

    // Price range filter
    if (priceMin || priceMax) {
      mongoQuery.finalPrice = {};
      if (priceMin && !isNaN(Number(priceMin))) {
        mongoQuery.finalPrice.$gte = Number(priceMin);
      }
      if (priceMax && !isNaN(Number(priceMax)) && priceMax !== "Infinity") {
        mongoQuery.finalPrice.$lte = Number(priceMax);
      }
    }

    // Discount filter
    if (discountMin && discountMin !== "all" && !isNaN(Number(discountMin))) {
      mongoQuery.discount = { $gte: Number(discountMin) };
    }

    // Sort mapping
    let sortOptions = { createdAt: -1 };
    if (sortBy === "price-low" || sortBy === "price_asc") {
      sortOptions = { finalPrice: 1 };
    } else if (sortBy === "price-high" || sortBy === "price_desc") {
      sortOptions = { finalPrice: -1 };
    } else if (sortBy === "newest" || sortBy === "latest") {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === "discount" || sortBy === "discount_desc") {
      sortOptions = { discount: -1 };
    } else if (sortBy === "featured") {
      sortOptions = { isFeatured: -1, createdAt: -1 };
    }

    const products = await Product.find(mongoQuery)
      .populate("mainCategory")
      .populate("category")
      .populate("subCategory")
      .populate("brand")
      .sort(sortOptions);

    return res
      .status(200)
      .json({ message: "Products search retrieved successfully", count: products.length, data: products });
  } catch (error) {
    console.error("search products error", error);
    res.status(500).json({ message: "Failed to search products", error: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate("mainCategory")
      .populate("category")
      .populate("subCategory")
      .populate("brand");

    return res
      .status(200)
      .json({ message: "Featured products retrieved successfully", data: products });
  } catch (error) {
    console.error("get featured products error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve featured products", error: error.message });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ category: id })
      .populate("mainCategory")
      .populate("category")
      .populate("subCategory")
      .populate("brand");

    return res
      .status(200)
      .json({ message: "Products retrieved by category successfully", data: products });
  } catch (error) {
    console.error("get products by category error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve products", error: error.message });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const materials = await Product.distinct("material");
    return res
      .status(200)
      .json({ message: "Materials retrieved successfully", data: materials.filter(Boolean) });
  } catch (error) {
    console.error("get all materials error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve materials", error: error.message });
  }
};

export {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  searchProducts,
  getFeaturedProducts,
  getProductByCategory,
  getAllMaterials,
};
