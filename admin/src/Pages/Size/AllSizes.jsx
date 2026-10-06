import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";
import Pagination from "../../Components/Common/Pagination";
import ViewToggle from "../../Components/Common/ViewToggle";

const AllSizes = () => {
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // View mode & pagination
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("sizes_view_mode") || "list";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("sizes_view_mode", mode);
  };

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "Manage Sizes", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Sizes", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Sizes", "delete");

  const fetchSizes = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/size/get-all-sizes");
      if (res?.data?.data) {
        setSizes(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Failed to fetch sizes!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleDelete = async (id) => {
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
        const res = await axiosInstance.delete(`/api/v1/size/delete-size/${id}`);
        if (res.status === 200) {
          setSizes(sizes.filter((item) => item._id !== id));
          toast.success("Size deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting size:", error);
        toast.error("Failed to delete size!");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredSizes = sizes.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredSizes.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSizes = filteredSizes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>📐 All Sizes ({totalItems})</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          {canWrite && (
            <Link to="/add-sizes" className="add-new">
              <i className="fa-solid fa-plus"></i> Add New Size
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
              placeholder="🔍 Search sizes..."
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
                <th>S No.</th>
                <th>Name</th>
                <th>Heights</th>
                <th>Mattress Dimensions</th>
                <th>Featured</th>
                {(canUpdate || canDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading sizes...
                  </td>
                </tr>
              ) : paginatedSizes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No sizes found
                  </td>
                </tr>
              ) : (
                paginatedSizes.map((item, index) => (
                  <tr key={item._id}>
                    <td>{startIndex + index + 1}</td>
                    <td><strong>{item.name}</strong></td>
                    <td>
                      {item?.size?.map((s, i) => (
                        <div key={i} className="small">• {s.hight}</div>
                      ))}
                    </td>
                    <td>
                      {item?.size?.map((s, i) => (
                        <div key={i}>
                          {s?.mattressDimension?.map((d, j) => (
                            <div key={j} className="small">• {d.dimension}</div>
                          ))}
                        </div>
                      ))}
                    </td>
                    <td>
                      {item.isFeatured ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    {(canUpdate || canDelete) && (
                      <td>
                        {canUpdate && (
                          <Link
                            to={`/edit-sizes/${item._id}`}
                            className="bt edit"
                          >
                            Edit <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                        )}
                        {canUpdate && canDelete && <>&nbsp;</>}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bt delete"
                          >
                            Delete <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
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
              <p className="mt-2 text-muted">Loading sizes...</p>
            </div>
          ) : paginatedSizes.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <h5>No sizes found</h5>
            </div>
          ) : (
            paginatedSizes.map((item) => (
              <div key={item._id} className="admin-product-card p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold text-dark m-0">{item.name}</h5>
                  {item.isFeatured ? (
                    <span className="badge bg-success">Featured</span>
                  ) : (
                    <span className="badge bg-secondary">Standard</span>
                  )}
                </div>

                <div className="bg-light p-2.5 rounded-3 my-2 small">
                  <strong className="text-muted d-block mb-1">Heights:</strong>
                  {item?.size?.map((s, i) => (
                    <div key={i}>• {s.hight}</div>
                  ))}
                  {item?.size?.[0]?.mattressDimension?.length > 0 && (
                    <div className="mt-2">
                      <strong className="text-muted d-block mb-1">Dimensions:</strong>
                      {item.size[0].mattressDimension.slice(0, 3).map((d, j) => (
                        <div key={j}>• {d.dimension}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top mt-auto">
                  {canUpdate && (
                    <Link to={`/edit-sizes/${item._id}`} className="bt edit" title="Edit">
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
          itemLabel="sizes"
        />
      )}
    </>
  );
};

export default AllSizes;
