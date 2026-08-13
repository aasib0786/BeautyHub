import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { Autocomplete, TextField } from "@mui/material";
import { fileLimit } from "../../services/fileLimit";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter";

const EditSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    status: false,
    oldImage: null,
    oldCollectionImage: null,
    collection: null,
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mainRes, catRes, subRes] = await Promise.all([
          axiosInstance.get("/api/v1/main-category/get-all-main-categories"),
          axiosInstance.get("/api/v1/category/get-all-categories"),
          axiosInstance.get(`/api/v1/sub-category/get-single-sub-category/${id}`),
        ]);

        const mainList = mainRes?.data?.data || [];
        const catList = catRes?.data?.data || [];
        const subData = subRes?.data?.data;

        setMainCategories(mainList);
        setCategories(catList);

        if (subData) {
          setFormData({
            name: subData?.subCategoryName || "",
            status: subData?.isCollection || false,
            oldImage: subData?.subCategoryImage || null,
            oldCollectionImage: subData?.collectionImage || null,
            image: null,
            collection: null,
          });

          // Match Main Category
          let currentMain = null;
          if (subData?.mainCategory) {
            currentMain = typeof subData.mainCategory === "object"
              ? subData.mainCategory
              : mainList.find((m) => m._id === subData.mainCategory);
          }
          if (!currentMain && mainList.length > 0) {
            currentMain = mainList[0];
          }
          setSelectedMainCategory(currentMain);

          // Filter Categories by Main Category
          const matchingCats = currentMain
            ? catList.filter(
                (c) =>
                  c?.mainCategory?._id === currentMain._id ||
                  c?.mainCategory === currentMain._id
              )
            : catList;
          const availableCats = matchingCats.length > 0 ? matchingCats : catList;
          setFilteredCategories(availableCats);

          // Match Category
          let currentCat = null;
          if (subData?.Category) {
            currentCat = typeof subData.Category === "object"
              ? subData.Category
              : catList.find((c) => c._id === subData.Category);
          }
          if (!currentCat && availableCats.length > 0) {
            currentCat = availableCats[0];
          }
          setSelectedCategory(currentCat);
        }
      } catch (error) {
        toast.error("Error loading subcategory data");
        console.error("Fetch subcategory error:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

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
    const { name, type, checked, value, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, status: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.image && !fileLimit(formData.image)) return;

    setBtnLoading(true);
    const payload = new FormData();
    payload.append("subCategoryName", capitalizeFirstLetter(formData.name));
    if (formData.image) {
      payload.append("image", formData.image);
    }
    if (formData.collection) {
      payload.append("collection", formData.collection);
    }
    payload.append("isCollection", formData.status);
    if (selectedMainCategory?._id) {
      payload.append("mainCategory", selectedMainCategory._id);
    }
    if (selectedCategory?._id) {
      payload.append("category", selectedCategory._id);
    }

    try {
      const response = await axiosInstance.put(
        `/api/v1/sub-category/update-sub-category/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response?.data?.message || "Sub Category updated successfully");
        navigate("/all-subCategory");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating sub category");
      console.error("Update subcategory error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (fetching) {
    return <p className="p-4">Loading subcategory details...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit SubCategory</h4>
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
            <label className="form-label">Sub Category Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sub Category Image */}
          <div className="col-md-4">
            <label className="form-label">Sub Category Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={handleChange}
            />
            {formData.oldImage && (
              <img
                src={`${formData.oldImage}`}
                alt="Old"
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
                name="status"
                id="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="status">
                Active on Collection
              </label>
            </div>
          </div>

          {formData.status && (
            <div className="col-md-4">
              <label className="form-label">Collection Image</label>
              <input
                type="file"
                name="collection"
                className="form-control"
                onChange={handleChange}
              />
              {formData.oldCollectionImage && (
                <img
                  src={`${formData.oldCollectionImage}`}
                  alt="Old Collection"
                  width="100"
                  className="mt-2 rounded"
                />
              )}
            </div>
          )}

          <div className="col-12 text-center">
            <button type="submit" className="btn" disabled={btnLoading}>
              {btnLoading ? "Please Wait..." : "Update Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSubCategory;
