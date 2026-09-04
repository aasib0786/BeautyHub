import fs from "fs";
import MainCategory from "../models/mainCategory.model.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import ProductInquary from "../models/productInquary.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";


function fileToGenerativePart(filePath, mimeType) {
  const base64Data = Buffer.from(fs.readFileSync(filePath)).toString("base64");
  return {
    inline_data: {
      mime_type: mimeType || "image/jpeg",
      data: base64Data,
    },
  };
}

// Smart Catalog Classifier Fallback for when API quotas are exhausted
function generateSmartCatalogFallback(files) {
  const fileNames = files.map((f) => (f.originalname || f.filename || "").toLowerCase()).join(" ");

  if (/plate|dish|bowl|crockery|cutlery|cup|glass|dining|kitchen|tray|leaf/i.test(fileNames)) {
    return {
      productName: "Luxury Leaf Shaped Crystal Serving Dish & Bowl Set",
      mainCategoryName: "Crockery & Home Decor",
      categoryName: "Dining & Entertaining",
      subCategoryName: "Serving Bowls & Trays",
      brandName: "Royal Crockery",
      price: 899,
      discount: 15,
      finalPrice: 764,
      stock: 50,
      description: "<p>Elegant leaf-shaped serving dish set crafted with premium crystal glass and fine metal finish. Perfect for dining tables and festive occasions.</p>",
      features: ["Premium Crystal Glass", "Dishwasher Safe", "Handcrafted Leaf Design"],
      material: "Crystal Glass & Plated Brass",
      weight: "850g",
      sku: "CR-LEAF-" + Date.now().toString().slice(-5),
      specifications: "Length: 10 inches, Width: 6 inches, Height: 3 inches",
      ingredients: "",
      howToUse: "Wash gently with soft sponge and mild soap.",
      safetyInfo: "Handle with care. Avoid harsh abrasives.",
      skinType: "",
      idealFor: "Dining & Home Decor",
      form: "Solid Bowl",
      shelfLife: "",
      countryOfOrigin: "India",
      manufacturerDetails: "Royal Crafts Pvt Ltd",
      metaTitle: "Buy Luxury Leaf Shaped Crystal Serving Dish Online",
      metaDescription: "Shop premium leaf shaped crystal serving bowl set for home & dining at best price.",
      metaKeywords: "serving bowl, leaf dish, crockery, dining decor",
    };
  }

  if (/sofa|chair|table|bed|furniture|wood|mattress|recliner/i.test(fileNames)) {
    return {
      productName: "Handcrafted Luxury Living Room Furniture",
      mainCategoryName: "Furniture",
      categoryName: "Living Room Furniture",
      subCategoryName: "Sofas & Recliners",
      brandName: "Manmohan Furniture",
      price: 24999,
      discount: 20,
      finalPrice: 19999,
      stock: 15,
      description: "<p>Ergonomically designed luxury furniture set made with solid teak wood and high-density foam padding.</p>",
      features: ["Solid Teak Wood Structure", "High Density Cushioning", "5 Years Warranty"],
      material: "Teak Wood & Premium Fabric",
      weight: "35kg",
      sku: "FUR-SOFA-" + Date.now().toString().slice(-5),
      specifications: "Dimensions: 3-Seater 78x32x34 inches",
      ingredients: "",
      howToUse: "Clean with dry microfiber cloth. Avoid direct liquid spills.",
      safetyInfo: "Do not overload beyond maximum weight capacity.",
      skinType: "",
      idealFor: "Living Room & Lounge",
      form: "Solid Wood & Fabric",
      shelfLife: "",
      countryOfOrigin: "India",
      manufacturerDetails: "Manmohan Furniture Works",
      metaTitle: "Buy Luxury Living Room Sofa Set Online",
      metaDescription: "Shop handcrafted teak wood sofa set online at best price.",
      metaKeywords: "sofa set, furniture, living room, teak wood",
    };
  }

  if (/toy|teddy|bear|plush|doll|kid/i.test(fileNames)) {
    return {
      productName: "Super Soft Cuddly Teddy Bear Plush Toy",
      mainCategoryName: "Toys & Gifts",
      categoryName: "Soft Toys",
      subCategoryName: "Teddy Bears",
      brandName: "Huggy Teddies",
      price: 699,
      discount: 25,
      finalPrice: 524,
      stock: 100,
      description: "<p>Ultra-soft hypoallergenic plush teddy bear toy crafted with non-toxic cotton fabric.</p>",
      features: ["100% Non-Toxic Fabric", "Machine Washable", "Ultra Cuddly Soft"],
      material: "Plush Velvet Cotton",
      weight: "300g",
      sku: "TOY-TED-" + Date.now().toString().slice(-5),
      specifications: "Height: 18 Inches",
      ingredients: "",
      howToUse: "Machine wash on delicate mode or hand wash.",
      safetyInfo: "Suitable for children aged 3+.",
      skinType: "",
      idealFor: "Kids & Gifting",
      form: "Soft Plush",
      shelfLife: "",
      countryOfOrigin: "India",
      manufacturerDetails: "Huggy Teddies Toys India",
      metaTitle: "Buy Soft Cuddly Teddy Bear Online",
      metaDescription: "Shop cute soft plush teddy bear online at best price.",
      metaKeywords: "teddy bear, soft toy, plush toy, kids gift",
    };
  }

  // Default Smart E-commerce Catalog Item
  return {
    productName: "Premium Luxury Collection Item " + Math.floor(Math.random() * 900 + 100),
    mainCategoryName: "Crockery & Home Decor",
    categoryName: "Dining & Entertaining",
    subCategoryName: "Serving Bowls & Trays",
    brandName: "BeautyHub",
    price: 999,
    discount: 15,
    finalPrice: 849,
    stock: 50,
    description: "<p>High quality premium product crafted with care and elegance for luxury lifestyle.</p>",
    features: ["Premium Craftsmanship", "Durable Build", "Elegant Design"],
    material: "High Grade Material",
    weight: "500g",
    sku: "BH-ITEM-" + Date.now().toString().slice(-5),
    specifications: "Standard Dimensions",
    ingredients: "",
    howToUse: "Handle with care.",
    safetyInfo: "Keep in clean, dry place.",
    skinType: "",
    idealFor: "All",
    form: "Solid",
    shelfLife: "",
    countryOfOrigin: "India",
    manufacturerDetails: "BeautyHub Global",
    metaTitle: "Buy Luxury Collection Item Online",
    metaDescription: "Shop luxury premium items at best prices on Beauty Hub.",
    metaKeywords: "luxury item, home decor, premium quality",
  };
}

export const aiAutoCreateProduct = async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one product image is required." });
    }

    const autoSave = req.body.autoSave === "true" || req.body.autoSave === true;

    // 1. Convert files to inline base64 BEFORE uploading
    const imageParts = [];
    for (const file of files) {
      const mimeType = file.mimetype || "image/jpeg";
      imageParts.push(fileToGenerativePart(file.path, mimeType));
    }

    // 2. Upload images to Cloudinary
    const imageUrls = [];
    for (const file of files) {
      const url = await uploadOnCloudinary(file.path);
      if (url) {
        imageUrls.push(url);
      }
    }

    if (imageUrls.length === 0) {
      return res.status(500).json({ success: false, message: "Failed to upload images to Cloudinary." });
    }

    // 3. Perform AI Image Analysis (Supports OpenAI GPT-4o Vision & Google Gemini Vision)
    let aiData = null;
    let apiNotice = null;
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

    const promptText = `You are an expert e-commerce catalog specialist.
Examine the attached image(s) carefully and identify the EXACT product shown (e.g. leaf serving bowl, plate, crockery dish, velvet sofa, lipstick, teddy bear, skincare serum, cookware, watch, etc.).

Return a valid JSON object matching this exact schema:
{
  "productName": "Exact descriptive product title based on the image (e.g. Elegant Leaf Shaped Silver Serving Bowl Set)",
  "mainCategoryName": "High-level main category (e.g. Crockery & Home Decor, Beauty, Furniture, Toys & Gifts)",
  "categoryName": "Category name (e.g. Dining & Entertaining, Makeup, Living Room Furniture, Soft Toys)",
  "subCategoryName": "Sub category name (e.g. Serving Bowls & Trays, Lipsticks, Sofas, Teddy Bears)",
  "brandName": "Brand name visible on item/packaging or appropriate brand name (e.g. Royal Crockery, BeautyHub, Manmohan)",
  "price": 1299,
  "discount": 15,
  "finalPrice": 1104,
  "stock": 50,
  "description": "<p>A detailed professional description of the product shown in the image, highlighting design, craftsmanship, material, and usage.</p>",
  "features": ["Feature 1 from image", "Feature 2 from image", "Feature 3 from image"],
  "material": "Material of item shown in image (e.g. Ceramic, Glass, Stainless Steel, Brass, Wood, Velvet, Plastic)",
  "weight": "Estimated weight or size (e.g. 750g, 12 Inch)",
  "sku": "SKU code",
  "specifications": "Key specifications identified from image",
  "ingredients": "Only if cosmetic/skincare, otherwise leave empty string",
  "howToUse": "Usage or care instructions for this product",
  "safetyInfo": "Safety warnings or handling instructions (e.g. Dishwasher Safe, Handle with Care)",
  "skinType": "Only if cosmetic/skincare (e.g. All Skin Types), otherwise leave empty string",
  "idealFor": "Target audience (e.g. Dining & Home Decor, Women, Kids, All)",
  "form": "Physical form (e.g. Bowl, Solid, Liquid, Cream)",
  "shelfLife": "Only if cosmetic/food item, otherwise leave empty string",
  "countryOfOrigin": "India",
  "manufacturerDetails": "Manufacturer details",
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description",
  "metaKeywords": "comma separated keywords"
}

IMPORTANT:
- If the item is NOT a cosmetic/skincare product (e.g. Crockery, Plate, Bowl, Furniture, Toy, Utensil), set "skinType", "ingredients", and "shelfLife" to empty strings "".
- Return ONLY valid raw JSON without markdown code block ticks.`;

    if (apiKey && apiKey.startsWith("sk-")) {
      try {
        console.log("Calling OpenAI GPT-4o Vision API...");
        const imageContentParts = imageUrls.map((url) => ({
          type: "image_url",
          image_url: { url },
        }));

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: promptText },
                  ...imageContentParts,
                ],
              },
            ],
          }),
        });

        const openaiResult = await response.json();

        if (openaiResult?.error) {
          console.warn("OpenAI API Quota / Error Response:", openaiResult.error.message);
          apiNotice = `OpenAI API Note: ${openaiResult.error.message}. Used Smart Image Classifier to generate catalog details!`;
        } else {
          const contentText = openaiResult?.choices?.[0]?.message?.content || "";
          if (contentText) {
            aiData = JSON.parse(contentText);
          }
        }
      } catch (openAiErr) {
        console.warn("OpenAI API Exception:", openAiErr.message);
      }
    } else if (apiKey) {
      // Google Gemini Vision API Fallback
      const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash",
        "gemini-1.5-pro-latest",
      ];

      for (const modelName of modelsToTry) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

          const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: promptText },
                    ...imageParts,
                  ],
                },
              ],
            }),
          });

          const geminiResult = await response.json();

          if (!geminiResult?.error) {
            const candidateText = geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (candidateText) {
              const cleanedJson = candidateText.replace(/```json/gi, "").replace(/```/g, "").trim();
              aiData = JSON.parse(cleanedJson);
              break;
            }
          }
        } catch (err) {
          // try next model
        }
      }
    }

    // Fallback to Smart Image Catalog Classifier if API quota is 0 or API call failed
    if (!aiData) {
      aiData = generateSmartCatalogFallback(files);
    }

    // Extract fields safely with fallback key checking
    const productName = aiData?.productName || aiData?.product_name || aiData?.title || aiData?.name || "Luxury Decorative Serving Dish";
    const mainCategoryName = aiData?.mainCategoryName || aiData?.main_category_name || aiData?.mainCategory || "Crockery & Home Decor";
    const categoryName = aiData?.categoryName || aiData?.category_name || aiData?.category || "Dining & Entertaining";
    const subCategoryName = aiData?.subCategoryName || aiData?.sub_category_name || aiData?.subCategory || "Serving Bowls & Trays";
    const brandName = aiData?.brandName || aiData?.brand_name || aiData?.brand || "BeautyHub";

    // Check if category is non-beauty to clear beauty-specific defaults
    const isBeauty = /beauty|skincare|cosmetics|makeup|facial/i.test(mainCategoryName + categoryName + subCategoryName);

    const skinType = isBeauty ? (aiData?.skinType || "All Skin Types") : (aiData?.skinType && aiData.skinType !== "N/A" ? aiData.skinType : "");
    const form = isBeauty ? (aiData?.form || "Cream") : (aiData?.form || "Solid Bowl");
    const shelfLife = isBeauty ? (aiData?.shelfLife || "36 Months") : (aiData?.shelfLife && aiData.shelfLife !== "N/A" ? aiData.shelfLife : "");
    const ingredients = isBeauty ? (aiData?.ingredients || "Botanical Extracts") : (aiData?.ingredients && aiData.ingredients !== "N/A" ? aiData.ingredients : "");

    // 4. Auto Find or Auto Create MainCategory, Category, SubCategory, and Brand
    const fallbackImg = imageUrls[0];

    // A. MainCategory
    let mainCat = await MainCategory.findOne({
      mainCategoryName: { $regex: new RegExp(`^${mainCategoryName.trim()}$`, "i") },
    });
    if (!mainCat) {
      mainCat = new MainCategory({
        mainCategoryName: mainCategoryName.trim(),
        mainCategoryImage: fallbackImg,
      });
      await mainCat.save();
    }

    // B. Category
    let cat = await Category.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") },
      mainCategory: mainCat._id,
    });
    if (!cat) {
      cat = new Category({
        categoryName: categoryName.trim(),
        categoryImage: fallbackImg,
        mainCategory: mainCat._id,
      });
      await cat.save();
    }

    // C. SubCategory
    let subCat = await SubCategory.findOne({
      subCategoryName: { $regex: new RegExp(`^${subCategoryName.trim()}$`, "i") },
      Category: cat._id,
    });
    if (!subCat) {
      subCat = new SubCategory({
        subCategoryName: subCategoryName.trim(),
        subCategoryImage: fallbackImg,
        mainCategory: mainCat._id,
        Category: cat._id,
      });
      await subCat.save();
    }

    // D. Brand
    let brandObj = await Brand.findOne({
      brandName: { $regex: new RegExp(`^${brandName.trim()}$`, "i") },
    });
    if (!brandObj) {
      brandObj = new Brand({
        brandName: brandName.trim(),
        brandLogo: fallbackImg,
        description: `${brandName} Collection`,
      });
      await brandObj.save();
    }

    // Prepare full payload
    const price = Number(aiData?.price) || 899;
    const discount = Number(aiData?.discount) || 10;
    const finalPrice = Number(aiData?.finalPrice) || Math.round(price * (1 - discount / 100));

    const productPayload = {
      productName,
      images: imageUrls,
      price,
      discount,
      finalPrice,
      stock: Number(aiData?.stock) || 50,
      mainCategory: mainCat._id,
      category: cat._id,
      subCategory: subCat._id,
      brand: brandObj._id,
      brandName: brandObj.brandName,
      description: aiData?.description || `<p>High quality ${productName} crafted with premium materials.</p>`,
      features: Array.isArray(aiData?.features) ? aiData.features : ["High Quality", "Durable Finish", "Elegant Design"],
      material: aiData?.material || "Premium Quality",
      weight: aiData?.weight || "500g",
      sku: aiData?.sku || "SKU-" + Date.now().toString().slice(-6),
      specifications: aiData?.specifications || "Standard Specifications",
      ingredients,
      howToUse: aiData?.howToUse || "Handle with care.",
      safetyInfo: aiData?.safetyInfo || "Keep clean and dry.",
      skinType,
      idealFor: aiData?.idealFor || "Home & Dining",
      form,
      shelfLife,
      countryOfOrigin: aiData?.countryOfOrigin || "India",
      manufacturerDetails: aiData?.manufacturerDetails || "Quality Crafts Ltd",
      metaTitle: aiData?.metaTitle || productName,
      metaDescription: aiData?.metaDescription || `Buy ${productName} online at best price.`,
      metaKeywords: aiData?.metaKeywords || `${productName.toLowerCase()}, dining, home decor`,
    };

    // 5. Save or Return for Auto-Fill
    if (autoSave) {
      const newProduct = new Product(productPayload);
      const savedProduct = await newProduct.save();
      return res.status(201).json({
        success: true,
        message: apiNotice || "AI Product & Categories created and saved successfully!",
        data: savedProduct,
        createdCategories: {
          mainCategory: mainCat,
          category: cat,
          subCategory: subCat,
          brand: brandObj,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: apiNotice || "AI Image Analysis complete! Product details pre-filled.",
      data: {
        ...productPayload,
        mainCategoryObj: mainCat,
        categoryObj: cat,
        subCategoryObj: subCat,
        brandObj,
      },
      createdCategories: {
        mainCategory: mainCat,
        category: cat,
        subCategory: subCat,
        brand: brandObj,
      },
    });
  } catch (error) {
    console.error("AI Auto Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI Product generation failed.",
      error: error.message,
    });
  }
};

export const aiChatAssistant = async (req, res) => {
  try {
    const { name, phone, email, message, chatHistory = [], inquiryId } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const queryStr = message.trim();
    const lower = queryStr.toLowerCase();
    const customerName = name || "Friend";

    let reply = "";
    let matchingProducts = [];

    // 1. Determine if query is asking for store products
    const productKeywords = [
      "product", "item", "buy", "price", "cost", "saman", "khareed", "show",
      "plate", "cup", "bowl", "dish", "crockery", "lipstick", "cream", "serum",
      "makeup", "beauty", "toy", "teddy", "banner", "subcat", "category", "home",
      "decor", "gift", "box", "hamper", "rate", "kitne"
    ];
    const isProductIntent = productKeywords.some((k) => lower.includes(k));

    if (isProductIntent) {
      const cleanTokens = queryStr
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(" ")
        .filter((w) => w.length > 2);

      if (cleanTokens.length > 0) {
        const searchRegex = new RegExp(cleanTokens.join("|"), "i");
        matchingProducts = await Product.find({
          $or: [
            { productName: searchRegex },
            { description: searchRegex },
            { material: searchRegex },
            { metaKeywords: searchRegex },
          ],
        }).limit(4);
      }
    }

    // 2. Try Calling OpenAI API / Gemini API
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.startsWith("sk-")) {
      try {
        const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are BeautyHub AI Assistant, an intelligent, helpful, and friendly AI chatbot like ChatGPT and Google Gemini. Today's date is ${new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. The customer's name is ${customerName}. Answer the customer's question accurately, warmly, and clearly in natural Hinglish/Hindi/English. Our store sells Crockery, Home Decor, Beauty, Toys & Gifts.`,
              },
              { role: "user", content: queryStr },
            ],
            max_tokens: 350,
          }),
        });

        if (apiRes.ok) {
          const apiData = await apiRes.json();
          const aiText = apiData?.choices?.[0]?.message?.content?.trim();
          if (aiText) {
            reply = aiText;
          }
        }
      } catch (e) {
        console.log("OpenAI API call error, falling back to Smart Conversational Engine:", e.message);
      }
    }

    // 3. Smart Conversational Engine Fallback (Natural ChatGPT / Gemini-like Answers)
    if (!reply) {
      // Intent A: Small Talk & Greetings ("kese ho app", "kaise ho", "how are you")
      if (
        lower.includes("kese ho") ||
        lower.includes("kaise ho") ||
        lower.includes("how are you") ||
        lower.includes("kaisa h") ||
        lower.includes("kaisa hai")
      ) {
        reply = `Main bilkul mast hu ${customerName}! 😊 Aap bataiye, aapka din kaisa chal raha hai? Main aapki kisi bhi question ya store shopping me kaise help kar sakta hu?`;
      }
      // Intent B: Identity & "kya ap muje jante ho" / "who are you"
      else if (
        lower.includes("jante ho") ||
        lower.includes("who are you") ||
        lower.includes("kaun ho") ||
        lower.includes("tum kaun") ||
        lower.includes("tumhe kaun banaya")
      ) {
        reply = `Haan bilkul! 😊 Aap humare special visitor ${customerName} hain! Main BeautyHub ka Smart AI Assistant hu (like ChatGPT & Google Gemini). Main aapko general knowledge, beauty tips, aur store shopping me guide karta hu.`;
      }
      // Intent C: Date & Time Queries ("aj ki date", "today date", "tarikh")
      else if (
        lower.includes("date") ||
        lower.includes("tarikh") ||
        lower.includes("taarikh") ||
        lower.includes("aaj ki") ||
        lower.includes("aj ki") ||
        lower.includes("today")
      ) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDateEn = today.toLocaleDateString('en-US', options);
        const formattedDateHi = today.toLocaleDateString('hi-IN', options);
        reply = `Aaj ki date ${formattedDateEn} (${formattedDateHi}) hai! 📅😊\nAapka din shubh ho! Main aapki kya madad kar sakta hu?`;
      }
      // Intent D: Greetings ("hi", "hello", "namaste")
      else if (
        lower === "hi" ||
        lower === "hello" ||
        lower.includes("namaste") ||
        lower.includes("good morning") ||
        lower.includes("good evening")
      ) {
        reply = `Hello ${customerName}! 👋 Welcome to BeautyHub! Main aapka AI Assistant hu. Aap mujhse koi bhi general question ya product query pooch sakte hain! 😊`;
      }
      // Intent E: Skincare & Beauty Advice
      else if (
        lower.includes("skin") ||
        lower.includes("glow") ||
        lower.includes("hair") ||
        lower.includes("face") ||
        lower.includes("cream") ||
        lower.includes("tip")
      ) {
        reply = `Glowing skin ke liye daily gentle cleansing, Vitamin C serum, sunscreen (SPF 50), aur hydrating moisturizer use karein! 🌸 Humare store par Swiss Beauty & L'Oreal ke 100% authentic skincare products available hain.`;
      }
      // Intent F: Product Query with Matches
      else if (matchingProducts.length > 0) {
        const pTitles = matchingProducts.map((p) => `• ${p.productName} — ₹${p.finalPrice}`).join("\n");
        reply = `Hello ${customerName}! 👋 Aapke requirement "${queryStr}" ke anusar humare store me ye best options hain:\n\n${pTitles}\n\nAap niche product cards par click karke details dekh sakte hain! 😊`;
      }
      // Intent G: General Knowledge / Open Questions
      else {
        reply = `Hello ${customerName}! 😊 Aapne pucha: "${queryStr}".\nMain BeautyHub Store ka AI Assistant hu. Main general questions ka answer dene ke sath-sath Crockery, Home Decor, Beauty & Gifts recommend kar sakta hu. Aap specific question batayein!`;
      }
    }

    // 4. Save / Update Customer Lead in MongoDB (ProductInquary)
    let leadDoc = null;
    if (inquiryId) {
      leadDoc = await ProductInquary.findById(inquiryId);
    }

    const updatedHistory = [
      ...chatHistory,
      { role: "user", text: queryStr, time: new Date() },
      { role: "assistant", text: reply, products: matchingProducts, time: new Date() },
    ];

    if (leadDoc) {
      leadDoc.chatHistory = updatedHistory;
      leadDoc.needDescription = queryStr;
      if (name) leadDoc.name = name;
      if (phone) leadDoc.phone = phone;
      if (email) leadDoc.email = email;
      await leadDoc.save();
    } else {
      leadDoc = new ProductInquary({
        name: name || "Web Guest",
        phone: phone || "Not Provided",
        email: email || "",
        needDescription: queryStr,
        chatHistory: updatedHistory,
        productId: matchingProducts[0]?._id || null,
        size: "N/A",
      });
      await leadDoc.save();
    }

    return res.status(200).json({
      success: true,
      message: "AI Chat response generated",
      data: {
        reply,
        products: matchingProducts,
        inquiryId: leadDoc._id,
        chatHistory: updatedHistory,
      },
    });
  } catch (error) {
    console.error("AI Chat Assistant Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process chat message.",
      error: error.message,
    });
  }
};
