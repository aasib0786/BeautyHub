import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";
import Pagination from "../../Components/Common/Pagination";
import ViewToggle from "../../Components/Common/ViewToggle";

const AllBrand = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // View mode & pagination
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("brands_view_mode") || "list";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("brands_view_mode", mode);
  };

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "Manage Brands", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Brands", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Brands", "delete");

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/brand/get-all-brands");
      if (response?.data?.data) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (brandId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/api/v1/brand/delete-brand/${brandId}`);
        if (response.status === 200) {
          setBrands(brands.filter((brand) => brand._id !== brandId));
          toast.success("Brand deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting brand:", error);
        toast.error("Failed to delete brand!");
      }
    }
  };

  const handleCheckboxChange = async (e, brandId) => {
    const updatedStatus = e.target.checked;
    try {
      const response = await axiosInstance.put(`/api/v1/brand/update-brand/${brandId}`, {
        isFeatured: updatedStatus,
      });

      if (response.status === 200) {
        setBrands(
          brands.map((brand) =>
            brand._id === brandId ? { ...brand, isFeatured: updatedStatus } : brand
          )
        );
        toast.success(
          updatedStatus ? "Brand marked as featured!" : "Brand removed from featured!"
        );
      }
    } catch (error) {
      toast.error("Error updating brand status");
      console.error("Error updating brand status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredBrands = brands?.filter((brand) =>
    brand?.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredBrands?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBrands = filteredBrands?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>🏷️ All Brands ({totalItems})</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          {canWrite && (
            <Link to="/add-brand" className="add-new">
              <i className="fa-solid fa-plus"></i> Add New Brand
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
              placeholder="🔍 Search brands..."
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
                <th scope="col">Logo</th>
                <th scope="col">Brand Name</th>
                <th scope="col" className="text-center">Featured</th>
                {(canUpdate || canDelete) && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading brands...
                  </td>
                </tr>
              ) : paginatedBrands?.length > 0 ? (
                paginatedBrands.map((item, index) => (
                  <tr key={item._id}>
                    <th scope="row">{startIndex + index + 1}</th>
                    <td>
                      {item?.brandLogo ? (
                        <img
                          src={item.brandLogo}
                          alt={item.brandName}
                          style={{ width: "48px", height: "48px", objectFit: "contain" }}
                          className="rounded border p-1 bg-white"
                        />
                      ) : (
                        <span className="badge bg-light text-muted border">No Logo</span>
                      )}
                    </td>
                    <td><strong>{item?.brandName}</strong></td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center m-0">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          role="switch"
                          disabled={!canUpdate}
                          checked={item?.isFeatured || false}
                          onChange={(e) => canUpdate && handleCheckboxChange(e, item._id)}
                          style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "38px", height: "20px" }}
                        />
                      </div>
                    </td>
                    {(canUpdate || canDelete) && (
                      <td>
                        {canUpdate && (
                          <Link to={`/edit-brand/${item?._id}`} className="bt edit">
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
                    No brands found
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
              <p className="mt-2 text-muted">Loading brands...</p>
            </div>
          ) : paginatedBrands.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <h5>No brands found</h5>
            </div>
          ) : (
            paginatedBrands.map((item) => (
              <div key={item._id} className="admin-product-card p-3 text-center">
                <div
                  style={{
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    marginBottom: "1rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {item?.brandLogo ? (
                    <img
                      src={item.brandLogo}
                      alt={item.brandName}
                      style={{ maxHeight: "80px", maxWidth: "80%", objectFit: "contain" }}
                    />
                  ) : (
                    <span className="text-muted fw-semibold">No Logo Available</span>
                  )}
                </div>

                <h5 className="fw-bold text-dark mb-3">{item.brandName}</h5>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <label className="featured-toggle-label">
                    <input
                      type="checkbox"
                      className="form-check-input m-0"
                      checked={item?.isFeatured || false}
                      disabled={!canUpdate}
                      onChange={(e) => canUpdate && handleCheckboxChange(e, item._id)}
                    />
                    <span>Featured</span>
                  </label>

                  <div className="d-flex align-items-center gap-1">
                    {canUpdate && (
                      <Link to={`/edit-brand/${item._id}`} className="bt edit" title="Edit">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bt delete"
                        title="Delete"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
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
          itemLabel="brands"
        />
      )}
    </>
  );
};

export default AllBrand;
