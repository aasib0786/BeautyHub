import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { Autocomplete, TextField } from "@mui/material";
import { fileLimit } from "../../services/fileLimit";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter";

const AddSubCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    status: false,
    collection: null,
  });

  const navigate = useNavigate();

  // Fetch Main Categories & Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mainRes, catRes] = await Promise.all([
          axiosInstance.get("/api/v1/main-category/get-all-main-categories"),
          axiosInstance.get("/api/v1/category/get-all-categories"),
        ]);

        const mainList = mainRes?.data?.data || [];
        const catList = catRes?.data?.data || [];

        setMainCategories(mainList);
        setCategories(catList);

        // 1. Select 1st Main Category by default
        if (mainList.length > 0) {
          const firstMain = mainList[0];
          setSelectedMainCategory(firstMain);

          // Filter categories belonging to 1st Main Category
          const matchingCats = catList.filter(
            (c) =>
              c?.mainCategory?._id === firstMain._id ||
              c?.mainCategory === firstMain._id
          );
          const availableCats = matchingCats.length > 0 ? matchingCats : catList;
          setFilteredCategories(availableCats);

          // 2. Select 1st Category by default
          if (availableCats.length > 0) {
            setSelectedCategory(availableCats[0]);
          }
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Failed to load category data");
      }
    };

    fetchData();
  }, []);

  // When Main Category changes, filter Category dropdown & select 1st Category
  const handleMainCategoryChange = (e, newValue) => {
    setSelectedMainCategory(newValue);
    if (newValue) {
      const matchingCats = categories.filter(
        (c) =>
          c?.mainCategory?._id === newValue._id ||
          c?.mainCategory === newValue._id
      );
      const availableCats = matchingCats.length > 0 ? matchingCats : categories;
      setFilteredCategories(availableCats);
      setSelectedCategory(availableCats[0] || null);
    } else {
      setFilteredCategories(categories);
      setSelectedCategory(categories[0] || null);
    }
  };

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({ ...prevData, status: !prevData.status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Sub Category name is required");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a Category");
      return;
    }
    if (!formData.image) {
      toast.error("Sub Category image is required");
      return;
    }
    if (!fileLimit(formData?.image)) return;

    setIsLoading(true);
    const payload = new FormData();
    payload.append("subCategoryName", capitalizeFirstLetter(formData.name));
    payload.append("image", formData.image);
    if (formData.collection) {
      payload.append("collection", formData.collection);
    }
    payload.append("isCollection", formData.status);
    if (selectedMainCategory?._id) {
      payload.append("mainCategory", selectedMainCategory._id);
    }
    payload.append("category", selectedCategory._id);

    try {
      const response = await axiosInstance.post(
        "/api/v1/sub-category/create-sub-category",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success(response?.data?.message || "Sub Category created successfully");
        navigate("/all-subCategory");
      } else {
        toast.error(response?.data?.message || "Error adding sub category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding sub category");
      console.error("Error adding sub category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add SubCategory</h4>
        </div>
        <div className="links">
          <Link to="/all-subCategory" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Searchable Main Category Dropdown */}
          <div className="col-md-4">
            <label className="form-label font-weight-bold">
              1. Select Main Category <span className="text-danger">*</span>
            </label>
            <Autocomplete
              options={mainCategories}
              getOptionLabel={(option) => option?.mainCategoryName || ""}
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search & Select Main Category..."
                  size="small"
                  required
                />
              )}
            />
          </div>

          {/* Searchable Category Dropdown */}
          <div className="col-md-4">
            <label className="form-label font-weight-bold">
              2. Select Category <span className="text-danger">*</span>
            </label>
            <Autocomplete
              options={filteredCategories}
              getOptionLabel={(option) => option?.categoryName || ""}
              value={selectedCategory}
              onChange={(e, newValue) => setSelectedCategory(newValue)}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search & Select Category..."
                  size="small"
                  required
                />
              )}
            />
          </div>

          {/* Sub Category Name */}
          <div className="col-md-4">
            <label htmlFor="name" className="form-label">
              Sub Category Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Sub Category Name"
              required
            />
          </div>

          {/* Sub Category Image */}
          <div className="col-md-4">
            <label htmlFor="image" className="form-label">
              Sub Category Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              name="image"
              className="form-control"
              id="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                width="100"
                className="mt-2 rounded"
              />
            )}
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="status"
                checked={formData.status}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="status">
                Active on Collection
              </label>
            </div>
          </div>

          {formData.status && (
            <div className="col-md-4">
              <label htmlFor="collection" className="form-label">
                Sub Category Collection Image
              </label>
              <input
                type="file"
                name="collection"
                className="form-control"
                id="collection"
                accept="image/*"
                onChange={handleChange}
                required
              />
              {formData.collection && (
                <img
                  src={URL.createObjectURL(formData.collection)}
                  alt="Preview"
                  width="100"
                  className="mt-2 rounded"
                />
              )}
            </div>
          )}

          <hr />

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubCategory;
