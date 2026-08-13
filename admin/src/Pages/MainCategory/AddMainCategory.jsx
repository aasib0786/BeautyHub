import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter";

const AddMainCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    status: false,
  });
  const navigate = useNavigate();

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
      toast.error("Main Category name is required");
      return;
    }
    if (!formData.image) {
      toast.error("Main Category image is required");
      return;
    }
    if (!fileLimit(formData.image)) return;

    setIsLoading(true);
    const uploadData = new FormData();
    uploadData.append("mainCategoryName", capitalizeFirstLetter(formData.name));
    uploadData.append("image", formData.image);
    uploadData.append("isCollection", formData.status);

    try {
      const response = await axiosInstance.post(
        "/api/v1/main-category/create-main-category",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success(response?.data?.message || "Main Category created successfully");
        navigate("/all-main-category");
      } else {
        toast.error(response?.data?.message || "Error adding main category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding main category");
      console.error("Error adding main category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Main Category</h4>
        </div>
        <div className="links">
          <Link to="/all-main-category" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="image" className="form-label">
              Main Category Image
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

          <div className="col-md-4">
            <label htmlFor="name" className="form-label">
              Main Category Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Main Category Name"
              required
            />
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
              {isLoading ? "Saving..." : "Add Main Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddMainCategory;
