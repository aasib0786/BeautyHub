import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";
import Pagination from "../../Components/Common/Pagination";
import ViewToggle from "../../Components/Common/ViewToggle";

const AllSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // View mode & pagination
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("subcategories_view_mode") || "list";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("subcategories_view_mode", mode);
  };

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "All SubCategory", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "All SubCategory", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "All SubCategory", "delete");

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
        toast.error("Error fetching subcategories");
        console.error("Error fetching subcategories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubCategories();
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
          `/api/v1/sub-category/delete-sub-category/${id}`
        );

        if (response.status === 200) {
          setSubCategories(subCategories.filter((cat) => cat._id !== id));
          toast.success("Subcategory deleted successfully!");
        }
      } catch (error) {
        toast.error("Error deleting subcategory.");
        console.error("Error deleting subcategory:", error);
      }
    }
  };

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredSubCategories = subCategories?.filter((sub) =>
    sub?.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub?.Category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub?.mainCategory?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredSubCategories?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubCategories = filteredSubCategories?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>🗂️ All Sub Categories ({totalItems})</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          {canWrite && (
            <Link to="/add-subCategory" className="add-new">
              <i className="fa-solid fa-plus"></i> Add New Sub Category
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
              placeholder="🔍 Search sub categories..."
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
                <th scope="col">Sub Category</th>
                <th scope="col">Category</th>
                <th scope="col">Main Category</th>
                <th scope="col" className="text-center">Collection</th>
                {(canUpdate || canDelete) && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading subcategories...
                  </td>
                </tr>
              ) : paginatedSubCategories?.length > 0 ? (
                paginatedSubCategories.map((sub, index) => (
                  <tr key={sub._id}>
                    <th scope="row">{startIndex + index + 1}</th>
                    <td>
                      <img
                        src={`${sub?.subCategoryImage}`}
                        alt={sub?.subCategoryName}
                        style={{ width: "48px", height: "48px", objectFit: "cover" }}
                        className="rounded border"
                      />
                    </td>
                    <td><strong>{sub?.subCategoryName}</strong></td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {sub?.Category?.categoryName || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {sub?.mainCategory?.mainCategoryName || "N/A"}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center m-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          role="switch"
                          disabled={!canUpdate}
                          checked={sub?.isCollection || false}
                          onChange={(e) => canUpdate && handleCheckboxChange(e, sub._id)}
                          style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "38px", height: "20px" }}
                        />
                      </div>
                    </td>
                    {(canUpdate || canDelete) && (
                      <td>
                        {canUpdate && (
                          <Link
                            to={`/edit-subCategory/${sub?._id}`}
                            className="bt edit"
                          >
                            Edit <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                        )}
                        {canUpdate && canDelete && <>&nbsp;</>}
                        {canDelete && (
                          <button
                            className="bt delete"
                            onClick={() => handleDelete(sub._id)}
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
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No sub categories found
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
              <p className="mt-2 text-muted">Loading subcategories...</p>
            </div>
          ) : paginatedSubCategories.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <h5>No sub categories found</h5>
            </div>
          ) : (
            paginatedSubCategories.map((sub) => (
              <div key={sub._id} className="admin-product-card">
                <div className="product-card-thumb-wrap" style={{ height: "170px" }}>
                  <img
                    src={`${sub?.subCategoryImage}`}
                    alt={sub?.subCategoryName}
                    className="product-card-thumb"
                  />
                  <div className="product-card-badge-top">
                    {sub?.Category?.categoryName && (
                      <span className="badge bg-info text-dark">
                        {sub.Category.categoryName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="product-card-body">
                  <div className="product-card-tags mb-1">
                    {sub?.mainCategory?.mainCategoryName && (
                      <span className="badge bg-secondary">
                        {sub.mainCategory.mainCategoryName}
                      </span>
                    )}
                  </div>

                  <h5 className="product-card-title mb-2" style={{ height: "auto" }}>
                    {sub.subCategoryName}
                  </h5>

                  <div className="product-card-footer mt-auto pt-2">
                    <label className="featured-toggle-label">
                      <input
                        type="checkbox"
                        className="form-check-input m-0"
                        checked={sub?.isCollection || false}
                        disabled={!canUpdate}
                        onChange={(e) => canUpdate && handleCheckboxChange(e, sub._id)}
                      />
                      <span>In Collection</span>
                    </label>

                    <div className="product-card-actions">
                      {canUpdate && (
                        <Link to={`/edit-subCategory/${sub._id}`} className="bt edit" title="Edit">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDelete(sub._id)} className="bt delete" title="Delete">
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
          itemLabel="subcategories"
        />
      )}
    </>
  );
};

export default AllSubCategory;
