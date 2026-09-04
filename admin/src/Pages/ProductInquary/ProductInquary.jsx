import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/FetchNodeServices";
import Swal from "sweetalert2";

const AllProductInquary = () => {
  const [inquiries, setInquiries] = useState([]);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This product inquiry will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/api/v1/product-inquery/delete-inquery/${id}`
        );
        if (response.status === 200) {
          setInquiries(inquiries?.filter((inquiry) => inquiry?._id !== id));
          Swal.fire("Deleted!", "Inquiry has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Error deleting the video.", "error");
        console.error("Error deleting video:", error);
      }
    }
  };
  const fetchInquiries = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/product-inquery/get-all-inquery");
      if (response.status === 200) {
        setInquiries(response.data.data);
      } else {
        console.error("Failed to fetch inquiries:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredInquiries = inquiries.filter((inquiry) =>
    inquiry?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry?.phone?.includes(searchQuery) ||
    inquiry?.productId?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All product Inquiry</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          <div className="search-box" style={{ width: "260px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search inquiries, name, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "20px", padding: "6px 14px" }}
            />
          </div>
        </div>
      </div>

      <section className="main-table">
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Customer Requirement / Need</th>
                <th>Product / Details</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry, index) => (
                  <tr key={inquiry._id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{inquiry.name}</td>
                    <td>{inquiry.email || <span className="text-muted">N/A</span>}</td>
                    <td><a href={`tel:${inquiry.phone}`} className="text-decoration-none fw-bold">{inquiry.phone}</a></td>
                    <td>
                      <div className="badge bg-primary text-wrap text-start" style={{ maxWidth: "220px" }}>
                        {inquiry.needDescription || inquiry.size || "AI Chat Shopping Inquiry"}
                      </div>
                    </td>
                    <td>
                      {inquiry?.productId ? (
                        <div className="d-flex align-items-center gap-2">
                          {inquiry?.productId?.images?.[0] && (
                            <img
                              src={inquiry.productId.images[0]}
                              alt=""
                              style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                            />
                          )}
                          <span style={{ fontSize: "0.85rem" }}>{inquiry?.productId?.productName}</span>
                        </div>
                      ) : (
                        <span className="badge bg-info text-dark">AI Chat Consultation</span>
                      )}
                    </td>
                    <td style={{ fontSize: "0.8rem" }}>{new Date(inquiry.createdAt).toLocaleString()}</td>
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
                  <td colSpan="8" className="text-center">No inquiries found.</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </section>
    </>
  );
};

export default AllProductInquary;
