import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/FetchNodeServices";
import Swal from "sweetalert2";
import Pagination from "../../Components/Common/Pagination";
import ViewToggle from "../../Components/Common/ViewToggle";

const AllEmailInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // View mode & pagination
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("email_inquiry_view_mode") || "list";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("email_inquiry_view_mode", mode);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This newsletter subscription will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `api/email-inquery/email-inqueries/${id}`
        );
        if (response.status === 200) {
          setInquiries(inquiries?.filter((inquiry) => inquiry?._id !== id));
          Swal.fire("Deleted!", "Subscription has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Error deleting the subscription.", "error");
        console.error("Error deleting subscription:", error);
      }
    }
  };

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/email-inquery/email-inqueries"
      );
      if (response.status === 200) {
        setInquiries(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredInquiries = inquiries.filter((inquiry) =>
    inquiry?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredInquiries.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>📬 Newsletter &amp; Email Subscriptions ({totalItems})</h4>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="list-toolbar">
        <div className="list-toolbar-left">
          <div className="search-box" style={{ width: "280px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search email address..."
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
                <th>Sr.No.</th>
                <th>Subscriber Email</th>
                <th>Subscribed Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading subscriptions...
                  </td>
                </tr>
              ) : paginatedInquiries.length > 0 ? (
                paginatedInquiries.map((inquiry, index) => (
                  <tr key={inquiry._id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <i className="fa-regular fa-envelope text-primary"></i>
                        <strong>{inquiry.email}</strong>
                      </div>
                    </td>
                    <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="bt delete"
                        onClick={() => handleDelete(inquiry?._id)}
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No subscriptions found.
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
              <p className="mt-2 text-muted">Loading subscriptions...</p>
            </div>
          ) : paginatedInquiries.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <h5>No subscriptions found</h5>
            </div>
          ) : (
            paginatedInquiries.map((inquiry) => (
              <div key={inquiry._id} className="admin-product-card p-3">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "rgba(37, 99, 235, 0.1)",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <div className="overflow-hidden">
                    <h6 className="fw-bold text-dark m-0 text-truncate">{inquiry.email}</h6>
                    <span className="text-muted small">
                      Subscribed: {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end pt-2 border-top mt-auto">
                  <button
                    className="bt delete"
                    onClick={() => handleDelete(inquiry._id)}
                  >
                    Delete <i className="fa-solid fa-trash"></i>
                  </button>
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
          itemLabel="subscriptions"
        />
      )}
    </>
  );
};

export default AllEmailInquiry;
