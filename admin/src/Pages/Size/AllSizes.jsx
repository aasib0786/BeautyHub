import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";
import "./size.css";

const AllSizes = () => {
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "Manage Sizes", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Sizes", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Sizes", "delete");



  /* ---------------- FETCH SIZES ---------------- */

  const fetchSizes = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        "/api/v1/size/get-all-sizes"
      );
      if (res.status === 200) {
        setSizes(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch sizes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (sizeId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This size will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `/api/v1/size/delete-size/${sizeId}`
        );

        if (res.status === 200) {
          setSizes((prev) =>
            prev.filter((item) => item._id !== sizeId)
          );
          toast.success("Size deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete size");
      }
    }
  };



  const filteredSizes = sizes?.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- UI ---------------- */

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>All Sizes</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          <div className="search-box" style={{ width: "240px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search sizes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "20px", padding: "6px 14px" }}
            />
          </div>
          {canWrite && (
            <Link to="/add-sizes" className="add-new">
              Add New <i className="fa-solid fa-plus"></i>
            </Link>
          )}
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
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
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredSizes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No sizes found
                </td>
              </tr>
            ) : (
              filteredSizes.map((item, index) => (

                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>{item.name}</td>

                  <td>
                    {item.size.map((s, i) => (
                      <div key={i}>• {s.hight}</div>
                    ))}
                  </td>

                  <td>
                    {item.size.map((s, i) => (
                      <div key={i}>
                        {s.mattressDimension.map((d, j) => (
                          <div key={j}>• {d.dimension}</div>
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
    </>
  );
};

export default AllSizes;
