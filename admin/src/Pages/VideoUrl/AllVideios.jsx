import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, {
  getData,
  postData,
} from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canWrite = hasPermission(storedUser, storedRoleDetails, "All Videos", "write");
  const canUpdate = hasPermission(storedUser, storedRoleDetails, "All Videos", "update");
  const canDelete = hasPermission(storedUser, storedRoleDetails, "All Videos", "delete");



  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/v1/video/get-all-videos"
        );
        if (response.status === 200) {
          setVideos(response?.data?.videos);
          console.log(response?.data?.videos);
        }
      } catch (error) {
        toast.error("Error fetching videos");
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This video URL will be deleted!",
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
          setVideos(videos?.filter((video) => video?._id !== id));
          Swal.fire("Deleted!", "Video has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Error deleting the video.", "error");
        console.error("Error deleting video:", error);
      }
    }
  };

  const handleCheckboxChange = async (e, videoId) => {
    const updatedStatus = e.target.checked;

    try {
      const response = await postData("api/video/change-status", {
        videoId: videoId,
        status: updatedStatus,
      });

      if (response.success) {
        const updatedVideos = videos.map((video) => {
          if (video._id === videoId) {
            video.status = updatedStatus;
          }
          return video;
        });
        setVideos(updatedVideos);
        toast.success("Video status updated");
      }
    } catch (error) {
      toast.error("Error updating video status");
      console.error("Error updating video status:", error);
    }
  };



  const filteredVideos = videos.filter((v) =>
    v?.videoUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v?.product?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <p>Loading videos...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Videos</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          <div className="search-box" style={{ width: "240px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search videos or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "20px", padding: "6px 14px" }}
            />
          </div>
          {canWrite && (
            <Link to="/add-videos" className="add-new">
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
              <th scope="col">Video URL</th>
              <th scope="col">Video</th>
              <th scope="col">Product</th>
              {canUpdate && <th scope="col">Edit</th>}
              {canDelete && <th scope="col">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (

                <tr key={video._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {video.videoUrl?.slice(0, 30)}...
                    </a>
                  </td>
                  <td>
                    <video width="70px" height="auto" controls>
                      <source src={video.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </td>
                  <td>
                    <img src={video?.productId?.images?.[0]} alt="" />
                  </td>
                  {canUpdate && (
                    <td>
                      <Link to={`/edit-videos/${video?._id}`} className="bt edit">
                        Edit <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </td>
                  )}
                  {canDelete && (
                    <td>
                      <button
                        className="bt delete"
                        onClick={() => handleDelete(video?._id)}
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
                  No Videos found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </section>
    </>
  );
};

export default AllVideos;
