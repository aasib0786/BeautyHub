import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { Autocomplete, TextField } from "@mui/material";
import { fileLimit } from "../../services/fileLimit";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter";

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    status: false,
    description: "",
  });

  const navigate = useNavigate();

  // Fetch Main Categories & auto-select the first one
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/main-category/get-all-main-categories"
        );
        const list = response?.data?.data || [];
        setMainCategories(list);
        if (list.length > 0) {
          setSelectedMainCategory(list[0]); // Select first main category by default
        }
      } catch (error) {
        console.error("Error fetching main categories:", error);
        toast.error("Failed to load main categories");
      }
    };
    fetchMainCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, image: files[0] }));
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
      toast.error("Category name is required");
      return;
    }
    if (!formData.image) {
      toast.error("Category image is required");
      return;
    }
    if (!fileLimit(formData?.image)) return;

    setIsLoading(true);
    const uploadData = new FormData();
    uploadData.append("categoryName", capitalizeFirstLetter(formData.name));
    uploadData.append("image", formData.image);
    uploadData.append("isCollection", formData.status);
    if (selectedMainCategory?._id) {
      uploadData.append("mainCategory", selectedMainCategory._id);
    }

    try {
      const response = await axiosInstance.post(
        "/api/v1/category/create-category",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success(response?.data?.message || "Category created successfully");
        navigate("/all-category");
      } else {
        toast.error(response?.data?.message || "Error adding category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding category");
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Category</h4>
        </div>
        <div className="links">
          <Link to="/all-category" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Searchable Main Category Dropdown */}
          <div className="col-md-4">
            <label className="form-label font-weight-bold">
              Select Main Category <span className="text-danger">*</span>
            </label>
            <Autocomplete
              options={mainCategories}
              getOptionLabel={(option) => option?.mainCategoryName || ""}
              value={selectedMainCategory}
              onChange={(e, newValue) => setSelectedMainCategory(newValue)}
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

          <div className="col-md-4">
            <label htmlFor="name" className="form-label">
              Category Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Category Name"
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="image" className="form-label">
              Category Image <span className="text-danger">*</span>
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

          <hr />

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
