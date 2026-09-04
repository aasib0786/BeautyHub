import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const AllSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "All SubCategory", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "All SubCategory", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "All SubCategory", "delete");


  // Fetch Sub Categories on mount
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/sub-category/get-all-sub-categories"
        );
        if (response?.data?.data) {
          setSubCategories(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching sub categories");
        console.error("Error fetching sub categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  // Handle Delete Action
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
          `/api/v1/sub-category/delete-sub-category/${id}`
        );

        if (response.status === 200) {
          setSubCategories(subCategories.filter((cat) => cat._id !== id));
          Swal.fire("Deleted!", "Your sub category has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error deleting the sub category.",
          "error"
        );
        console.error("Error deleting sub category:", error);
      }
    }
  };

  // Handle SubCategory Status Change
  const handleCheckboxChange = async (e, id) => {
    const updatedStatus = e.target.checked;

    try {
      const response = await axiosInstance.put(
        `/api/v1/sub-category/update-sub-category/${id}`,
        {
          isCollection: updatedStatus,
        }
      );

      if (response.status === 200) {
        const updatedList = subCategories.map((cat) => {
          if (cat._id === id) {
            return { ...cat, isCollection: updatedStatus };
          }
          return cat;
        });
        setSubCategories(updatedList);
        toast.success("Subcategory collection status updated");
      }
    } catch (error) {
      toast.error("Error updating subcategory status");
      console.error("Error updating subcategory status:", error);
    }
  };


  const filteredSubCategories = subCategories?.filter((sub) =>
    sub?.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub?.Category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub?.mainCategory?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <p className="p-4">Loading subcategories...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Sub Category</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          <div className="search-box" style={{ width: "240px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search sub categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "20px", padding: "6px 14px" }}
            />
          </div>
          {canWrite && (
            <Link to="/add-subCategory" className="add-new">
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
              <th scope="col">Main Category</th>
              <th scope="col">Category</th>
              <th scope="col">Sub Category</th>
              <th scope="col">Image</th>
              <th scope="col">Show in Collection</th>
              {canUpdate && <th scope="col">Edit</th>}
              {canDelete && <th scope="col">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {filteredSubCategories?.length > 0 ? (
              filteredSubCategories.map((sub, index) => (

                <tr key={sub._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <span className="badge bg-secondary">
                      {sub?.mainCategory?.mainCategoryName || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {sub?.Category?.categoryName || "N/A"}
                    </span>
                  </td>
                  <td>{sub?.subCategoryName}</td>
                  <td>
                    <img
                      src={`${sub?.subCategoryImage}`}
                      alt={sub?.subCategoryName}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      className="rounded"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      disabled={!canUpdate}
                      checked={sub?.isCollection || false}
                      onChange={(e) => canUpdate && handleCheckboxChange(e, sub._id)}
                      style={{ cursor: canUpdate ? "pointer" : "not-allowed" }}
                    />
                  </td>
                  {canUpdate && (
                    <td>
                      <Link
                        to={`/edit-subCategory/${sub?._id}`}
                        className="bt edit"
                      >
                        Edit <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </td>
                  )}
                  {canDelete && (
                    <td>
                      <button
                        className="bt delete"
                        onClick={() => handleDelete(sub._id)}
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No sub categories found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </section>
    </>
  );
};

export default AllSubCategory;
