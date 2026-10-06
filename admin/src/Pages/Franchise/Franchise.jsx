import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/FetchNodeServices";
import Swal from "sweetalert2";
import Pagination from "../../Components/Common/Pagination";
import ViewToggle from "../../Components/Common/ViewToggle";

const AllFranchise = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // View mode & pagination
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("franchise_view_mode") || "list";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("franchise_view_mode", mode);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This franchise inquiry will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/api/v1/become-franchise/delete-franchise/${id}`
        );
        if (response.status === 200) {
          setInquiries(inquiries?.filter((inquiry) => inquiry?._id !== id));
          Swal.fire("Deleted!", "Inquiry has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Error deleting the inquiry.", "error");
        console.error("Error deleting inquiry:", error);
      }
    }
  };

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/v1/become-franchise/get-all-franchises"
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
    inquiry?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry?.phone?.includes(searchQuery) ||
    inquiry?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredInquiries.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>🤝 Franchise Partnership Requests ({totalItems})</h4>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="list-toolbar">
        <div className="list-toolbar-left">
          <div className="search-box" style={{ width: "280px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search name, email, phone, city..."
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
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Investment Budget</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading franchise inquiries...
                  </td>
                </tr>
              ) : paginatedInquiries.length > 0 ? (
                paginatedInquiries.map((inquiry, index) => (
                  <tr key={inquiry._id}>
                    <td>{startIndex + index + 1}</td>
                    <td className="fw-bold">{inquiry.fullName}</td>
                    <td>{inquiry.email}</td>
                    <td>
                      <a href={`tel:${inquiry.phone}`} className="text-decoration-none fw-bold">
                        {inquiry.phone}
                      </a>
                    </td>
                    <td>{inquiry.address || "N/A"}</td>
                    <td>
                      <span className="badge bg-success">{inquiry.investmentBudget || "Not Specified"}</span>
                    </td>
                    <td style={{ maxWidth: "250px", whiteSpace: "normal" }}>{inquiry.message}</td>
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
                  <td colSpan="9" className="text-center py-4 text-muted">No franchise inquiries found.</td>
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
              <p className="mt-2 text-muted">Loading franchise inquiries...</p>
            </div>
          ) : paginatedInquiries.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <h5>No inquiries found</h5>
            </div>
          ) : (
            paginatedInquiries.map((inquiry) => (
              <div key={inquiry._id} className="admin-product-card p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold text-dark m-0">{inquiry.fullName}</h6>
                  <span className="badge bg-success">{inquiry.investmentBudget || "Budget N/A"}</span>
                </div>

                <div className="text-muted small mb-2">
                  <div><i className="fa-solid fa-phone me-1 text-primary"></i> {inquiry.phone}</div>
                  <div><i className="fa-regular fa-envelope me-1"></i> {inquiry.email}</div>
                  {inquiry.address && <div><i className="fa-solid fa-location-dot me-1"></i> {inquiry.address}</div>}
                </div>

                {inquiry.message && (
                  <p className="bg-light p-2.5 rounded-3 text-secondary small mb-3">
                    "{inquiry.message}"
                  </p>
                )}

                <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                  <span className="text-muted small">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
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
          itemLabel="requests"
        />
      )}
    </>
  );
};

export default AllFranchise;
