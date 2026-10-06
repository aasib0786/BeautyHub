import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";
import Pagination from "../../Components/Common/Pagination";
import ViewToggle from "../../Components/Common/ViewToggle";

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // View mode & pagination
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("videos_view_mode") || "list";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("videos_view_mode", mode);
  };

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "All Videos", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "All Videos", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "All Videos", "delete");

  const fetchVideos = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/video/get-all-videos");
      if (response?.data?.videos) {
        setVideos(response.data.videos);
      }
    } catch (error) {
      toast.error("Error fetching videos");
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
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
          `/api/v1/video/delete-video/${id}`
        );

        if (response.status === 200) {
          setVideos(videos.filter((v) => v._id !== id));
          toast.success("Video deleted successfully!");
        }
      } catch (error) {
        toast.error("Error deleting video.");
        console.error("Error deleting video:", error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredVideos = videos.filter((v) =>
    v?.videoUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v?.productId?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredVideos.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>🎥 All Showcase Videos ({totalItems})</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          {canWrite && (
            <Link to="/add-videos" className="add-new">
              <i className="fa-solid fa-plus"></i> Add New Video
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
              placeholder="🔍 Search videos or products..."
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
                <th scope="col">Video</th>
                <th scope="col">Associated Product</th>
                <th scope="col">Video URL</th>
                {(canUpdate || canDelete) && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading videos...
                  </td>
                </tr>
              ) : paginatedVideos.length > 0 ? (
                paginatedVideos.map((video, index) => (
                  <tr key={video._id}>
                    <th scope="row">{startIndex + index + 1}</th>
                    <td>
                      <video
                        width="110px"
                        height="65px"
                        controls
                        style={{ borderRadius: "8px", background: "#000" }}
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                      </video>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {video?.productId?.images?.[0] && (
                          <img
                            src={video.productId.images[0]}
                            alt=""
                            style={{ width: "36px", height: "36px", objectFit: "cover" }}
                            className="rounded border"
                          />
                        )}
                        <span>{video?.productId?.productName || "General Video"}</span>
                      </div>
                    </td>
                    <td>
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary small text-break"
                      >
                        {video.videoUrl?.slice(0, 40)}...
                      </a>
                    </td>
                    {(canUpdate || canDelete) && (
                      <td>
                        {canUpdate && (
                          <Link to={`/edit-videos/${video?._id}`} className="bt edit">
                            Edit <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                        )}
                        {canUpdate && canDelete && <>&nbsp;</>}
                        {canDelete && (
                          <button
                            className="bt delete"
                            onClick={() => handleDelete(video?._id)}
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
                    No Videos found
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
              <p className="mt-2 text-muted">Loading videos...</p>
            </div>
          ) : paginatedVideos.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <h5>No videos found</h5>
            </div>
          ) : (
            paginatedVideos.map((video) => (
              <div key={video._id} className="admin-product-card p-3">
                <div style={{ height: "160px", background: "#000", borderRadius: "10px", overflow: "hidden", marginBottom: "0.75rem" }}>
                  <video
                    width="100%"
                    height="100%"
                    controls
                    style={{ objectFit: "contain" }}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                </div>

                <h6 className="fw-bold text-dark mb-1 text-truncate">
                  {video?.productId?.productName || "Showcase Reel"}
                </h6>

                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary small text-truncate d-block mb-3"
                >
                  <i className="fa-solid fa-link me-1"></i> {video.videoUrl}
                </a>

                <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top mt-auto">
                  {canUpdate && (
                    <Link to={`/edit-videos/${video._id}`} className="bt edit" title="Edit">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(video._id)}
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
          itemLabel="videos"
        />
      )}
    </>
  );
};

export default AllVideos;
