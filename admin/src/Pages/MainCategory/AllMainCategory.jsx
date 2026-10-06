import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";
import Pagination from "../../Components/Common/Pagination";
import ViewToggle from "../../Components/Common/ViewToggle";

const AllMainCategory = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // View mode & pagination
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("main_categories_view_mode") || "list";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("main_categories_view_mode", mode);
  };

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "All Main Category", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "All Main Category", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "All Main Category", "delete");

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
          toast.success("Main category deleted successfully!");
        }
      } catch (error) {
        toast.error("Error deleting main category.");
        console.error("Error deleting main category:", error);
      }
    }
  };

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
        toast.success(updatedStatus ? "Main Category shown in Navbar!" : "Main Category removed from Navbar!");
      }
    } catch (error) {
      toast.error("Error updating main category status");
      console.error("Error updating main category status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredCategories = mainCategories.filter((cat) =>
    cat?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredCategories.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>🗂️ All Main Categories ({totalItems})</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          {canWrite && (
            <Link to="/add-main-category" className="add-new">
              <i className="fa-solid fa-plus"></i> Add New Main Category
            </Link>
          )}
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="list-toolbar">
        <div className="list-toolbar-left">
          <div className="search-box" style={{ width: "260px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search main categories..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {searchQuery && (
            <button
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
            >
              <i className="fa-solid fa-xmark"></i> Clear
            </button>
          )}
        </div>

        <div className="list-toolbar-right">
          <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />

          <div className="items-limit-wrapper">
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="items-limit-select"
            >
              <option value={10}>10 items</option>
              <option value={25}>25 items</option>
              <option value={50}>50 items</option>
              <option value={100}>100 items</option>
            </select>
          </div>
        </div>
      </div>

      {/* List (Table) View */}
      {viewMode === "list" && (
        <section className="main-table">
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Sr.No.</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col" className="text-center">Show in Navbar</th>
                {(canUpdate || canDelete) && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading main categories...
                  </td>
                </tr>
              ) : paginatedCategories?.length > 0 ? (
                paginatedCategories.map((item, index) => (
                  <tr key={item._id}>
                    <th scope="row">{startIndex + index + 1}</th>
                    <td>
                      <img
                        src={item?.mainCategoryImage}
                        alt={item?.mainCategoryName}
                        style={{ width: "48px", height: "48px", objectFit: "cover" }}
                        className="rounded border"
                      />
                    </td>
                    <td><strong>{item?.mainCategoryName}</strong></td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center m-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          role="switch"
                          disabled={!canUpdate}
                          checked={item?.isCollection || false}
                          onChange={(e) => canUpdate && handleCheckboxChange(e, item._id)}
                          style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "38px", height: "20px" }}
                        />
                      </div>
                    </td>
                    {(canUpdate || canDelete) && (
                      <td>
                        {canUpdate && (
                          <Link
                            to={`/edit-main-category/${item?._id}`}
                            className="bt edit"
                          >
                            Edit <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                        )}
                        {canUpdate && canDelete && <>&nbsp;</>}
                        {canDelete && (
                          <button
                            className="bt delete"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No main categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Card (Grid) View */}
      {viewMode === "card" && (
        <div className="admin-card-grid">
          {isLoading ? (
            <div className="col-12 text-center py-5">
              <i className="fa-solid fa-circle-notch fa-spin fa-2x text-primary"></i>
              <p className="mt-2 text-muted">Loading main categories...</p>
            </div>
          ) : paginatedCategories.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <h5>No main categories found</h5>
            </div>
          ) : (
            paginatedCategories.map((item) => (
              <div key={item._id} className="admin-product-card">
                <div className="product-card-thumb-wrap" style={{ height: "180px" }}>
                  <img
                    src={item?.mainCategoryImage}
                    alt={item?.mainCategoryName}
                    className="product-card-thumb"
                  />
                </div>
                <div className="product-card-body">
                  <h5 className="product-card-title mb-2" style={{ height: "auto" }}>
                    {item.mainCategoryName}
                  </h5>

                  <div className="product-card-footer mt-auto pt-2">
                    <label className="featured-toggle-label">
                      <input
                        type="checkbox"
                        className="form-check-input m-0"
                        checked={item?.isCollection || false}
                        disabled={!canUpdate}
                        onChange={(e) => canUpdate && handleCheckboxChange(e, item._id)}
                      />
                      <span>In Navbar</span>
                    </label>

                    <div className="product-card-actions">
                      {canUpdate && (
                        <Link to={`/edit-main-category/${item._id}`} className="bt edit" title="Edit">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDelete(item._id)} className="bt delete" title="Delete">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom Pagination Bar */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onLimitChange={setItemsPerPage}
          limitOptions={[10, 25, 50, 100]}
          itemLabel="categories"
        />
      )}
    </>
  );
};

export default AllMainCategory;
