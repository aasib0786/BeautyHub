import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";
import capitalizeFirstLetter from "../../services/capitalizeFirstLetter";

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    oldImage: null,
    description: "",
    isFeatured: false,
  });

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/brand/get-single-brand/${id}`);
        if (response?.data?.data) {
          const b = response.data.data;
          setFormData({
            name: b.brandName || "",
            image: null,
            oldImage: b.brandLogo || null,
            description: b.description || "",
            isFeatured: b.isFeatured || false,
          });
        }
      } catch (error) {
        toast.error("Error fetching brand details");
        console.error("Fetch brand error:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchBrand();
  }, [id]);

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
      const response = await axiosInstance.put(
        `/api/v1/brand/update-brand/${id}`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response?.data?.message || "Brand updated successfully");
        navigate("/all-brands");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating brand");
      console.error("Update brand error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return <p className="p-4">Loading brand details...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Brand</h4>
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
            <label className="form-label">Brand Name</label>
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
            <label className="form-label">Brand Logo</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={handleChange}
            />
            {formData.oldImage && (
              <img
                src={formData.oldImage}
                alt="Old Logo"
                width="100"
                className="mt-2 rounded border"
              />
            )}
          </div>

          <div className="col-md-12">
            <label className="form-label">Brand Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
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

          <div className="col-12 text-center">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Please Wait..." : "Update Brand"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBrand;
