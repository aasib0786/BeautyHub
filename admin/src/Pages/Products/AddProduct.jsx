import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices.js";
import { Autocomplete, TextField } from "@mui/material";
import JoditEditor from "jodit-react";
import "./product.css";
import { fileLimit } from "../../services/fileLimit.js";
import InfoIcon from "@mui/icons-material/Info";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter.js";

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [filteredSubcategoryList, setFilteredSubcategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [sizeList, setSizeList] = useState([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // AI Product Auto-Generation State
  const [aiImages, setAiImages] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiProgressStep, setAiProgressStep] = useState("");

  // Features list state
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);


  // SEO Attributes (Multiple Key-Value Pairs) state
  const [seoAttributes, setSeoAttributes] = useState([
    { key: "Skin Type", value: "All Skin Types" },
    { key: "Finish", value: "Radiant Velvet" },
  ]);

  const [formData, setFormData] = useState({
    productName: "",
    images: [],
    price: 0,
    discount: 0,
    finalPrice: 0,
    description: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    isFeatured: false,
    material: "",
    weight: "",
    sku: "",
    dimensionsInch: "",
    dimensionsCm: "",
    Specifications: "",
    BrandCollectionOverview: "",
    CareMaintenance: "",
    seller: "",
    Warranty: "",
    size: [],
    ingredients: "",
    howToUse: "",
    safetyInfo: "",
    skinType: "",
    idealFor: "",
    form: "",
    shelfLife: "",
    countryOfOrigin: "",
    manufacturerDetails: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [mainRes, catRes, subRes, brandRes, sizeRes] = await Promise.all([
          axiosInstance.get("/api/v1/main-category/get-all-main-categories"),
          axiosInstance.get("/api/v1/category/get-all-categories"),
          axiosInstance.get("/api/v1/sub-category/get-all-sub-categories"),
          axiosInstance.get("/api/v1/brand/get-all-brands"),
          axiosInstance.get("/api/v1/size/get-all-sizes"),
        ]);

        const mains = mainRes?.data?.data || [];
        const cats = catRes?.data?.data || [];
        const subs = subRes?.data?.data || [];
        const brands = brandRes?.data?.data || [];
        const sizes = sizeRes?.data?.data || [];

        setMainCategoryList(mains);
        setCategoryList(cats);
        setSubcategoryList(subs);
        setBrandList(brands);
        setSizeList(sizes);

        // 1. Auto select 1st Main Category
        if (mains.length > 0) {
          const firstMain = mains[0];
          setSelectedMainCategory(firstMain);

          const matchingCats = cats.filter(
            (c) =>
              c?.mainCategory?._id === firstMain._id ||
              c?.mainCategory === firstMain._id
          );
          const availCats = matchingCats.length > 0 ? matchingCats : cats;
          setFilteredCategoryList(availCats);

          if (availCats.length > 0) {
            const firstCat = availCats[0];
            setSelectedCategory(firstCat);

            const matchingSubs = subs.filter(
              (s) =>
                s?.Category?._id === firstCat._id ||
                s?.Category === firstCat._id
            );
            const availSubs = matchingSubs.length > 0 ? matchingSubs : subs;
            setFilteredSubcategoryList(availSubs);

            if (availSubs.length > 0) {
              setSelectedSubCategory(availSubs[0]);
            }
          }
        }

        if (brands.length > 0) {
          setSelectedBrand(brands[0]);
        }
      } catch (error) {
        console.error("Error fetching product dropdown data:", error);
        toast.error("Failed to load category and brand dropdowns");
      }
    };

    fetchAllData();
  }, []);

  const handleMainCategoryChange = (e, newValue) => {
    setSelectedMainCategory(newValue);
    if (newValue) {
      const matchingCats = categoryList.filter(
        (c) =>
          c?.mainCategory?._id === newValue._id ||
          c?.mainCategory === newValue._id
      );
      const availCats = matchingCats.length > 0 ? matchingCats : categoryList;
      setFilteredCategoryList(availCats);

      const firstCat = availCats[0] || null;
      setSelectedCategory(firstCat);

      if (firstCat) {
        const matchingSubs = subcategoryList.filter(
          (s) =>
            s?.Category?._id === firstCat._id || s?.Category === firstCat._id
        );
        const availSubs = matchingSubs.length > 0 ? matchingSubs : subcategoryList;
        setFilteredSubcategoryList(availSubs);
        setSelectedSubCategory(availSubs[0] || null);
      } else {
        setFilteredSubcategoryList(subcategoryList);
        setSelectedSubCategory(subcategoryList[0] || null);
      }
    } else {
      setFilteredCategoryList(categoryList);
      setSelectedCategory(categoryList[0] || null);
      setFilteredSubcategoryList(subcategoryList);
      setSelectedSubCategory(subcategoryList[0] || null);
    }
  };

  const handleCategoryChange = (e, newValue) => {
    setSelectedCategory(newValue);
    if (newValue) {
      const matchingSubs = subcategoryList.filter(
        (s) =>
          s?.Category?._id === newValue._id || s?.Category === newValue._id
      );
      const availSubs = matchingSubs.length > 0 ? matchingSubs : subcategoryList;
      setFilteredSubcategoryList(availSubs);
      setSelectedSubCategory(availSubs[0] || null);
    } else {
      setFilteredSubcategoryList(subcategoryList);
      setSelectedSubCategory(subcategoryList[0] || null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleJoditChange = (newValue) => {
    setFormData((prev) => ({ ...prev, description: newValue }));
  };

  // Feature Handlers
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput("");
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // SEO Key-Value Pair Handlers
  const handleAddSeoPair = () => {
    setSeoAttributes([...seoAttributes, { key: "", value: "" }]);
  };

  const handleRemoveSeoPair = (index) => {
    setSeoAttributes(seoAttributes.filter((_, i) => i !== index));
  };

  const handleSeoPairChange = (index, field, val) => {
    const updated = [...seoAttributes];
    updated[index][field] = val;
    setSeoAttributes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productName) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      toast.error("At least 1 product image is required");
      return;
    }

    if (formData.images && Array.isArray(formData.images)) {
      for (const image of formData.images) {
        if (!fileLimit(image)) return;
      }
    }

    setIsLoading(true);
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => payload.append("images", file));
      } else if (key === "productName") {
        payload.append("productName", capitalizeFirstLetter(value));
      } else if (key === "size") {
        payload.append("size", JSON.stringify(value));
      } else {
        payload.append(key, value);
      }
    });

    if (selectedMainCategory?._id) {
      payload.append("mainCategory", selectedMainCategory._id);
    }
    if (selectedCategory?._id) {
      payload.append("category", selectedCategory._id);
    }
    if (selectedSubCategory?._id) {
      payload.append("subCategory", selectedSubCategory._id);
    }
    if (selectedBrand?._id) {
      payload.append("brand", selectedBrand._id);
    }

    // Append Features & SEO Attributes
    payload.append("features", JSON.stringify(features));
    const validSeo = seoAttributes.filter((item) => item.key.trim() && item.value.trim());
    payload.append("seoAttributes", JSON.stringify(validSeo));

    try {
      const response = await axiosInstance.post(
        "/api/v1/product/create-product",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Product created successfully");
        navigate("/all-products");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to add product. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...Array.from(files)],
      }));
    }
  };

  const handleAiGenerate = async (autoSaveMode = false) => {
    if (!aiImages || aiImages.length === 0) {
      toast.error("Please select at least 1 image for AI Auto-Generation!");
      return;
    }
    setIsAiLoading(true);
    setAiProgressStep("Uploading images to Cloudinary & Analyzing Vision...");

    const payload = new FormData();
    aiImages.forEach((img) => payload.append("images", img));
    payload.append("autoSave", autoSaveMode ? "true" : "false");

    try {
      const res = await axiosInstance.post("/api/v1/product/ai-auto-create", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success(res.data.message || "AI Auto-Generation completed!");

        // Re-fetch category & brand lists so newly created ones show up!
        const [mainRes, catRes, subRes, brandRes] = await Promise.all([
          axiosInstance.get("/api/v1/main-category/get-all-main-categories"),
          axiosInstance.get("/api/v1/category/get-all-categories"),
          axiosInstance.get("/api/v1/sub-category/get-all-sub-categories"),
          axiosInstance.get("/api/v1/brand/get-all-brands"),
        ]);

        const mains = mainRes?.data?.data || [];
        const cats = catRes?.data?.data || [];
        const subs = subRes?.data?.data || [];
        const brands = brandRes?.data?.data || [];

        setMainCategoryList(mains);
        setCategoryList(cats);
        setSubcategoryList(subs);
        setBrandList(brands);

        if (autoSaveMode) {
          navigate("/all-products");
          return;
        }

        // Pre-fill form data if in Auto-Fill mode
        const data = res.data.data;
        if (data) {
          setFormData((prev) => ({
            ...prev,
            productName: data.productName || "",
            price: data.price || 0,
            discount: data.discount || 0,
            finalPrice: data.finalPrice || 0,
            description: data.description || "",
            material: data.material || "",
            weight: data.weight || "",
            sku: data.sku || "",
            specifications: data.specifications || "",
            ingredients: data.ingredients || "",
            howToUse: data.howToUse || "",
            safetyInfo: data.safetyInfo || "",
            skinType: data.skinType || "",
            idealFor: data.idealFor || "",
            form: data.form || "",
            shelfLife: data.shelfLife || "",
            countryOfOrigin: data.countryOfOrigin || "India",
            manufacturerDetails: data.manufacturerDetails || "",
            metaTitle: data.metaTitle || "",
            metaDescription: data.metaDescription || "",
            metaKeywords: data.metaKeywords || "",
          }));

          if (data.features && Array.isArray(data.features)) {
            setFeatures(data.features);
          }

          if (data.mainCategoryObj) {
            setSelectedMainCategory(data.mainCategoryObj);
            const matchingCats = cats.filter((c) => (c?.mainCategory?._id || c?.mainCategory) === data.mainCategoryObj._id);
            setFilteredCategoryList(matchingCats.length > 0 ? matchingCats : cats);
          }

          if (data.categoryObj) {
            setSelectedCategory(data.categoryObj);
            const matchingSubs = subs.filter((s) => (s?.Category?._id || s?.Category) === data.categoryObj._id);
            setFilteredSubcategoryList(matchingSubs.length > 0 ? matchingSubs : subs);
          }

          if (data.subCategoryObj) {
            setSelectedSubCategory(data.subCategoryObj);
          }

          if (data.brandObj) {
            setSelectedBrand(data.brandObj);
          }

          // Use the uploaded AI images as product images if user wants
          setFormData((prev) => ({
            ...prev,
            images: [...aiImages],
          }));
        }
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      toast.error(err?.response?.data?.message || "AI Auto-Generation failed. Please try again.");
    } finally {
      setIsAiLoading(false);
      setAiProgressStep("");
    }
  };

  useEffect(() => {
    let total = parseFloat(
      formData.price * (1 - formData.discount / 100)
    ).toFixed(2);
    setFormData((prev) => ({ ...prev, finalPrice: total }));
  }, [formData.price, formData.discount]);

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Product</h4>
        </div>
        <div className="links">
          <Link to="/all-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      {/* ✨ AI Magic Product & Category Auto-Creator Card */}
      <div
        className="card mb-4 border-0"
        style={{
          background: "linear-gradient(135deg, #153964 0%, #255285 50%, #795548 100%)",
          color: "#fff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(21, 57, 100, 0.25)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h3 style={{ margin: 0, fontWeight: "700", fontSize: "1.35rem", color: "#f3c623" }}>
              ✨ AI Magic Product & Category Creator
            </h3>
            <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: "0.88rem" }}>
              Select multiple product images — AI will analyze images, auto-create Main Category, Category, Sub Category, Brand, and fill all product fields!
            </p>
          </div>
          <span
            className="badge"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
              fontSize: "0.78rem",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            Multimodal Vision AI
          </span>
        </div>

        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <label className="form-label text-white fw-bold" style={{ fontSize: "0.85rem" }}>
              Select Product Images for AI:
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="form-control"
              style={{ background: "#ffffff", color: "#333", borderRadius: "8px", fontWeight: "500" }}
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files);
                setAiImages(selectedFiles);
                setFormData((prev) => ({
                  ...prev,
                  images: selectedFiles,
                }));
              }}
            />
            {aiImages.length > 0 && (
              <div className="mt-2">
                <small className="text-warning d-block fw-semibold mb-2" style={{ fontSize: "0.82rem" }}>
                  ✓ {aiImages.length} image(s) selected:
                </small>
                <div className="d-flex flex-wrap gap-2">
                  {aiImages.map((file, idx) => {
                    const previewUrl = typeof file === "string" ? file : URL.createObjectURL(file);
                    return (
                      <div
                        key={idx}
                        style={{
                          position: "relative",
                          width: "70px",
                          height: "70px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "2px solid #f3c623",
                          background: "#ffffff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        <img
                          src={previewUrl}
                          alt={`preview-${idx}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          title="Remove image"
                          onClick={() => {
                            const updated = aiImages.filter((_, i) => i !== idx);
                            setAiImages(updated);
                            setFormData((prev) => ({ ...prev, images: updated }));
                          }}
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: "rgba(220, 53, 69, 0.9)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>


          <div className="col-md-6 d-flex gap-2 align-items-end justify-content-md-end flex-wrap">
            <button
              type="button"
              className="btn btn-warning fw-bold d-flex align-items-center gap-2"
              disabled={isAiLoading || aiImages.length === 0}
              onClick={() => handleAiGenerate(false)}
              style={{ borderRadius: "10px", padding: "10px 20px", color: "#153964" }}
            >
              {isAiLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Analyzing...
                </>
              ) : (
                <>✨ AI Auto-Fill Form</>
              )}
            </button>

            <button
              type="button"
              className="btn btn-success fw-bold d-flex align-items-center gap-2"
              disabled={isAiLoading || aiImages.length === 0}
              onClick={() => handleAiGenerate(true)}
              style={{ borderRadius: "10px", padding: "10px 20px" }}
            >
              {isAiLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>⚡ AI One-Click Auto-Save</>
              )}
            </button>
          </div>
        </div>

        {isAiLoading && (
          <div className="mt-3 p-2 bg-white bg-opacity-10 rounded text-warning text-center fw-semibold" style={{ fontSize: "0.88rem" }}>
            {aiProgressStep || "AI is processing images and generating category hierarchy..."}
          </div>
        )}
      </div>

      <div className="d-form">
        <form className="row g-3 mt-2" onSubmit={handleSubmit}>

          {/* Section 1: Category & Brand */}
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              margin: "20px 0 10px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <InfoIcon style={{ color: "#795548" }} />
            Category & Brand Selection
          </h3>

          <div className="col-md-3">
            <label className="form-label font-weight-bold">
              1. Main Category <span className="text-danger">*</span>
            </label>
            <Autocomplete
              options={mainCategoryList}
              getOptionLabel={(option) => option?.mainCategoryName || ""}
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Main Category..."
                  size="small"
                  required
                />
              )}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label font-weight-bold">
              2. Category <span className="text-danger">*</span>
            </label>
            <Autocomplete
              options={filteredCategoryList}
              getOptionLabel={(option) => option?.categoryName || ""}
              value={selectedCategory}
              onChange={handleCategoryChange}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Category..."
                  size="small"
                  required
                />
              )}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label font-weight-bold">
              3. Sub Category <span className="text-danger">*</span>
            </label>
            <Autocomplete
              options={filteredSubcategoryList}
              getOptionLabel={(option) => option?.subCategoryName || ""}
              value={selectedSubCategory}
              onChange={(e, newValue) => setSelectedSubCategory(newValue)}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Sub Category..."
                  size="small"
                  required
                />
              )}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label font-weight-bold">
              4. Brand <span className="text-danger">*</span>
            </label>
            <Autocomplete
              options={brandList}
              getOptionLabel={(option) => option?.brandName || ""}
              value={selectedBrand}
              onChange={(e, newValue) => setSelectedBrand(newValue)}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Product Brand..."
                  size="small"
                  required
                />
              )}
            />
          </div>

          {/* Section 2: Product Details & Features */}
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              margin: "25px 0 10px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <StarIcon style={{ color: "#e8607a" }} />
            Product Details & Key Features
          </h3>

          <div className="col-md-4">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="productName"
              className="form-control"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Skin Type (e.g. All Skin Types, Dry, Oily)</label>
            <input
              type="text"
              name="skinType"
              className="form-control"
              placeholder="E.g., All Skin Types / Sensitive"
              value={formData.skinType}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Form / Texture (e.g. Cream, Gel, Serum)</label>
            <input
              type="text"
              name="form"
              className="form-control"
              placeholder="E.g., Cream, Gel, Lotion"
              value={formData.form}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Ideal For (Target Audience)</label>
            <input
              type="text"
              name="idealFor"
              className="form-control"
              placeholder="E.g., Men & Women / Unisex"
              value={formData.idealFor}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Net Weight / Volume</label>
            <input
              type="text"
              name="weight"
              className="form-control"
              placeholder="E.g., 100 g / 50 ml"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">SKU</label>
            <input
              type="text"
              name="sku"
              className="form-control"
              placeholder="E.g., DEW-CRM-100"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Shelf Life / Expiry</label>
            <input
              type="text"
              name="shelfLife"
              className="form-control"
              placeholder="E.g., 24 Months"
              value={formData.shelfLife}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Country of Origin</label>
            <input
              type="text"
              name="countryOfOrigin"
              className="form-control"
              placeholder="E.g., India"
              value={formData.countryOfOrigin}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Seller / Marketer</label>
            <input
              type="text"
              name="seller"
              className="form-control"
              placeholder="E.g., BeautyHub Retail"
              value={formData.seller}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Warranty / Guarantee</label>
            <input
              type="text"
              name="Warranty"
              className="form-control"
              placeholder="E.g., 100% Money Back Guarantee"
              value={formData.Warranty}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Material / Composition</label>
            <input
              type="text"
              name="material"
              className="form-control"
              placeholder="E.g., Herbal / Hypoallergenic"
              value={formData.material}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Manufacturer / Packer Details</label>
            <input
              type="text"
              name="manufacturerDetails"
              className="form-control"
              placeholder="E.g., Torrent Pharma / BeautyHub Care Ltd."
              value={formData.manufacturerDetails}
              onChange={handleChange}
            />
          </div>

          {/* Additional Skincare Details: Ingredients, How to Use, Safety Info */}
          <div className="col-md-12">
            <label className="form-label font-weight-bold">Key Ingredients & Composition</label>
            <textarea
              name="ingredients"
              rows={2}
              className="form-control"
              placeholder="E.g., Aloe Vera Extract, Wheat Germ Oil, Honey, Purified Water..."
              value={formData.ingredients}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label font-weight-bold">How to Use / Directions</label>
            <textarea
              name="howToUse"
              rows={2}
              className="form-control"
              placeholder="E.g., Apply evenly on clean face and body. Gentle circular motion until absorbed..."
              value={formData.howToUse}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label font-weight-bold">Safety Information & Precautions</label>
            <textarea
              name="safetyInfo"
              rows={2}
              className="form-control"
              placeholder="E.g., For external use only. Store in a cool dry place away from direct sunlight..."
              value={formData.safetyInfo}
              onChange={handleChange}
            />
          </div>

          {/* Dynamic Features List Input */}
          <div className="col-md-12">
            <label className="form-label font-weight-bold">Product Key Features (Bullets)</label>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="E.g., 100% Organic & Cruelty Free, 24H Hydration"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-dark text-nowrap"
                onClick={handleAddFeature}
              >
                + Add Feature
              </button>
            </div>
            {features.length > 0 && (
              <div className="mt-2 d-flex flex-wrap gap-2">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="badge bg-secondary p-2 d-inline-flex align-items-center gap-2"
                  >
                    ✨ {feat}
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      style={{ fontSize: "10px" }}
                      onClick={() => handleRemoveFeature(idx)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Pricing & Images */}
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              margin: "25px 0 10px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AttachMoneyIcon style={{ color: "#4CAF50" }} />
            Pricing & Images
          </h3>

          <div className="col-md-3">
            <label className="form-label">Price (₹) *</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Discount (%)</label>
            <input
              type="number"
              name="discount"
              className="form-control"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Final Price (₹)</label>
            <input
              type="number"
              name="finalPrice"
              className="form-control"
              value={formData.finalPrice}
              readOnly
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Product Images (Max 5) *</label>
            <input
              type="file"
              name="images"
              className="form-control"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>

          {/* Product Description with Jodit Editor */}
          <div className="col-md-12">
            <label className="form-label font-weight-bold">Product Description (Rich Text Editor) *</label>
            <JoditEditor
              value={formData.description}
              onChange={handleJoditChange}
            />
          </div>

          {/* Section 4: SEO & Dynamic Attributes */}
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              margin: "25px 0 10px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <SearchIcon style={{ color: "#2196F3" }} />
            SEO & Dynamic Key-Value Specifications
          </h3>

          <div className="col-md-4">
            <label className="form-label">Meta Title (SEO)</label>
            <input
              type="text"
              name="metaTitle"
              className="form-control"
              placeholder="E.g., Radiant Glow Rose Serum - BeautyHub"
              value={formData.metaTitle}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Meta Keywords (Comma Separated)</label>
            <input
              type="text"
              name="metaKeywords"
              className="form-control"
              placeholder="skincare, serum, glow, organic"
              value={formData.metaKeywords}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Meta Description (SEO)</label>
            <input
              type="text"
              name="metaDescription"
              className="form-control"
              placeholder="Shop 100% organic radiant glow serum with 24H hydration..."
              value={formData.metaDescription}
              onChange={handleChange}
            />
          </div>

          {/* Dynamic Key-Value Pairs Builder */}
          <div className="col-12 mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label font-weight-bold mb-0">
                Custom Key-Value Attributes (Product Specs & Filters)
              </label>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleAddSeoPair}
              >
                + Add Key-Value Pair
              </button>
            </div>

            {seoAttributes.map((pair, idx) => (
              <div key={idx} className="row g-2 mb-2 align-items-center">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Attribute Key (e.g. Skin Type, Finish)"
                    value={pair.key}
                    onChange={(e) =>
                      handleSeoPairChange(idx, "key", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Attribute Value (e.g. All Skin Types, Matte)"
                    value={pair.value}
                    onChange={(e) =>
                      handleSeoPairChange(idx, "value", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm w-100"
                    onClick={() => handleRemoveSeoPair(idx)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-12 mt-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isFeatured">
                Featured Product
              </label>
            </div>
          </div>

          <div className="col-12 mt-4 text-center">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading}
            >
              {isLoading ? "Saving Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
