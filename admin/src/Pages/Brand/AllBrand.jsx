import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const AllBrand = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/brand/get-all-brands");
        if (response?.data?.data) {
          setBrands(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching brands");
        console.error("Error fetching brands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/api/v1/brand/delete-brand/${id}`
        );

        if (response.status === 200) {
          setBrands(brands.filter((b) => b._id !== id));
          Swal.fire("Deleted!", "Brand has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the brand.", "error");
        console.error("Error deleting brand:", error);
      }
    }
  };

  const handleCheckboxChange = async (e, id) => {
    const updatedStatus = e.target.checked;

    try {
      const response = await axiosInstance.put(
        `/api/v1/brand/update-brand/${id}`,
        {
          isFeatured: updatedStatus,
        }
      );

      if (response.status === 200) {
        setBrands(
          brands.map((b) => (b._id === id ? { ...b, isFeatured: updatedStatus } : b))
        );
        toast.success("Brand featured status updated");
      }
    } catch (error) {
      toast.error("Error updating brand status");
      console.error("Error updating brand status:", error);
    }
  };

  if (isLoading) {
    return <p className="p-4">Loading brands...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Brands</h4>
        </div>
        <div className="links">
          <Link to="/add-brand" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Brand Name</th>
              <th scope="col">Logo</th>
              <th scope="col">Featured</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {brands?.length > 0 ? (
              brands.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item?.brandName}</td>
                  <td>
                    {item?.brandLogo ? (
                      <img
                        src={item.brandLogo}
                        alt={item.brandName}
                        style={{ width: "50px", height: "50px", objectFit: "contain" }}
                        className="rounded border"
                      />
                    ) : (
                      <span className="text-muted">No Logo</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={item?.isFeatured || false}
                      onChange={(e) => handleCheckboxChange(e, item._id)}
                    />
                  </td>
                  <td>
                    <Link to={`/edit-brand/${item?._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllBrand;
