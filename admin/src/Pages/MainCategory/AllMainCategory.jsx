import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const AllMainCategory = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "All Main Category", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "All Main Category", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "All Main Category", "delete");

  // Fetch Main Categories on mount

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/main-category/get-all-main-categories"
        );
        if (response?.data?.data) {
          setMainCategories(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching main categories");
        console.error("Error fetching main categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMainCategories();
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
          `/api/v1/main-category/delete-main-category/${id}`
        );

        if (response.status === 200) {
          setMainCategories(
            mainCategories.filter((cat) => cat._id !== id)
          );
          Swal.fire(
            "Deleted!",
            "Your main category has been deleted.",
            "success"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error deleting the main category.",
          "error"
        );
        console.error("Error deleting main category:", error);
      }
    }
  };

  // Handle Main Category Status Change
  const handleCheckboxChange = async (e, id) => {
    const updatedStatus = e.target.checked;

    try {
      const response = await axiosInstance.put(
        `/api/v1/main-category/update-main-category/${id}`,
        {
          isCollection: updatedStatus,
        }
      );

      if (response.status === 200) {
        const updatedList = mainCategories.map((cat) => {
          if (cat._id === id) {
            return { ...cat, isCollection: updatedStatus };
          }
          return cat;
        });
        setMainCategories(updatedList);
        toast.success("Main Category status updated");
      }
    } catch (error) {
      toast.error("Error updating main category status");
      console.error("Error updating main category status:", error);
    }
  };



  const filteredCategories = mainCategories.filter((cat) =>
    cat?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <p className="p-4">Loading main categories...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Main Category</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          <div className="search-box" style={{ width: "240px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search main categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "20px", padding: "6px 14px" }}
            />
          </div>
          {canWrite && (
            <Link to="/add-main-category" className="add-new">
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
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Show in Header (Navbar)</th>
              {canUpdate && <th scope="col">Edit</th>}
              {canDelete && <th scope="col">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCategories?.length > 0 ? (
              filteredCategories.map((item, index) => (

                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item?.mainCategoryName}</td>
                  <td>
                    <img
                      src={item?.mainCategoryImage}
                      alt={item?.mainCategoryName}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      className="rounded"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      disabled={!canUpdate}
                      checked={item?.isCollection || false}
                      onChange={(e) => canUpdate && handleCheckboxChange(e, item._id)}
                      style={{ cursor: canUpdate ? "pointer" : "not-allowed" }}
                    />
                  </td>
                  {canUpdate && (
                    <td>
                      <Link
                        to={`/edit-main-category/${item?._id}`}
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
                  No main categories found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </section>
    </>
  );
};

export default AllMainCategory;
