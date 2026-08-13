import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter";

const AddBrand = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    isFeatured: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, isFeatured: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Brand name is required");
      return;
    }
    if (formData.image && !fileLimit(formData.image)) return;

    setIsLoading(true);
    const uploadData = new FormData();
    uploadData.append("brandName", capitalizeFirstLetter(formData.name));
    if (formData.image) {
      uploadData.append("image", formData.image);
    }
    uploadData.append("description", formData.description);
    uploadData.append("isFeatured", formData.isFeatured);

    try {
      const response = await axiosInstance.post(
        "/api/v1/brand/create-brand",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success(response?.data?.message || "Brand created successfully");
        navigate("/all-brands");
      } else {
        toast.error(response?.data?.message || "Error adding brand");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding brand");
      console.error("Error adding brand:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Brand</h4>
        </div>
        <div className="links">
          <Link to="/all-brands" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="name" className="form-label">
              Brand Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Brand Name"
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="image" className="form-label">
              Brand Logo
            </label>
            <input
              type="file"
              name="image"
              className="form-control"
              id="image"
              accept="image/*"
              onChange={handleChange}
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

          <div className="col-md-12">
            <label htmlFor="description" className="form-label">
              Brand Description
            </label>
            <textarea
              name="description"
              className="form-control"
              id="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Brand Details / Overview"
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isFeatured">
                Featured Brand
              </label>
            </div>
          </div>

          <hr />

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Brand"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBrand;
