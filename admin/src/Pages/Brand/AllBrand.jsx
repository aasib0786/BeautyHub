import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const AllBrand = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "Manage Brands", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Brands", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Brands", "delete");



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


  const filteredBrands = brands?.filter((brand) =>
    brand?.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="links d-flex align-items-center gap-3">
          <div className="search-box" style={{ width: "240px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "20px", padding: "6px 14px" }}
            />
          </div>
          {canWrite && (
            <Link to="/add-brand" className="add-new">
              Add New <i className="fa-solid fa-plus"></i>
            </Link>
          )}
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
              {canUpdate && <th scope="col">Edit</th>}
              {canDelete && <th scope="col">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {filteredBrands?.length > 0 ? (
              filteredBrands.map((item, index) => (

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
                      disabled={!canUpdate}
                      checked={item?.isFeatured || false}
                      onChange={(e) => canUpdate && handleCheckboxChange(e, item._id)}
                      style={{ cursor: canUpdate ? "pointer" : "not-allowed" }}
                    />
                  </td>
                  {canUpdate && (
                    <td>
                      <Link to={`/edit-brand/${item?._id}`} className="bt edit">
                        Edit <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </td>
                  )}
                  {canDelete && (
                    <td>
                      <button
                        className="bt delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  )}
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
