import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { Autocomplete, TextField } from "@mui/material";
import { fileLimit } from "../../services/fileLimit";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    status: false,
    oldImage: null,
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Main Categories
        const mainCatRes = await axiosInstance.get(
          "/api/v1/main-category/get-all-main-categories"
        );
        const mainCatList = mainCatRes?.data?.data || [];
        setMainCategories(mainCatList);

        // Fetch Category details
        const response = await axiosInstance.get(
          `/api/v1/category/get-single-category/${id}`
        );

        if (response?.status === 200) {
          const catData = response?.data?.data;
          setFormData({
            name: catData?.categoryName || "",
            status: catData?.isCollection || false,
            oldImage: catData?.categoryImage || null,
            image: null,
          });

          // Match main category reference or fallback to first
          if (catData?.mainCategory) {
            const currentMainCat =
              typeof catData.mainCategory === "object"
                ? catData.mainCategory
                : mainCatList.find((mc) => mc._id === catData.mainCategory);
            setSelectedMainCategory(currentMainCat || mainCatList[0] || null);
          } else if (mainCatList.length > 0) {
            setSelectedMainCategory(mainCatList[0]);
          }
        }
      } catch (error) {
        toast.error("Error fetching category data");
        console.error("Fetch category error:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
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
    payload.append("categoryName", capitalizeFirstLetter(formData.name));
    if (formData.image) {
      payload.append("image", formData.image);
    }
    payload.append("isCollection", formData.status);
    if (selectedMainCategory?._id) {
      payload.append("mainCategory", selectedMainCategory._id);
    }

    try {
      const response = await axiosInstance.put(
        `/api/v1/category/update-category/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response?.data?.message || "Category updated successfully");
        navigate("/all-category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating category");
      console.error("Update category error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (fetching) {
    return <p className="p-4">Loading category details...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Category</h4>
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
            <label className="form-label">Category Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Category Image</label>
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
                Active on Homepage
              </label>
            </div>
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn" disabled={btnLoading}>
              {btnLoading ? "Please Wait..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
