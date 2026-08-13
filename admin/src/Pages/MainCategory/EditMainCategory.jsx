import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter";

const EditMainCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    previewImage: "",
    status: false,
  });

  useEffect(() => {
    const fetchMainCategory = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/main-category/get-single-main-category/${id}`
        );
        if (response?.data?.data) {
          const cat = response.data.data;
          setFormData({
            name: cat.mainCategoryName || "",
            image: null,
            previewImage: cat.mainCategoryImage || "",
            status: cat.isCollection || false,
          });
        }
      } catch (error) {
        toast.error("Failed to load main category details");
        console.error("Error fetching main category:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchMainCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
        previewImage: URL.createObjectURL(files[0]),
      }));
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
    if (formData.image && !fileLimit(formData.image)) return;

    setIsLoading(true);
    const uploadData = new FormData();
    uploadData.append("mainCategoryName", capitalizeFirstLetter(formData.name));
    if (formData.image) {
      uploadData.append("image", formData.image);
    }
    uploadData.append("isCollection", formData.status);

    try {
      const response = await axiosInstance.put(
        `/api/v1/main-category/update-main-category/${id}`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response?.data?.message || "Main Category updated successfully");
        navigate("/all-main-category");
      } else {
        toast.error(response?.data?.message || "Error updating main category");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating main category");
      console.error("Error updating main category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return <p className="p-4">Loading main category details...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Main Category</h4>
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
            />
            {formData.previewImage && (
              <img
                src={formData.previewImage}
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
              {isLoading ? "Updating..." : "Update Main Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditMainCategory;
