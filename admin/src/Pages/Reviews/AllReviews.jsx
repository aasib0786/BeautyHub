import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { hasPermission } from '../../services/permissionHelper';
import Pagination from '../../Components/Common/Pagination';
import ViewToggle from '../../Components/Common/ViewToggle';

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // View mode & pagination
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("reviews_view_mode") || "list";
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleViewChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem("reviews_view_mode", mode);
    };

    const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

    const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Reviews", "update");
    const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Reviews", "delete");

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('api/v1/review/get-all-reviews');
                if (response?.data?.data) {
                    setReviews(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                toast.error("Failed to fetch reviews!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleDelete = async (reviewId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this review!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                const data = await axiosInstance.delete(`/api/v1/review/delete-review/${reviewId}`);
                if (data.status === 200) {
                    setReviews(reviews.filter(item => item._id !== reviewId));
                    toast.success("Review deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error("Failed to delete review!");
            }
        }
    };

    const handleCheckboxChange = async (e, reviewId) => {
        const updatedStatus = e.target.checked;
        try {
            const response = await axiosInstance.put(`/api/v1/review/update-review/${reviewId}`, {
                status: updatedStatus
            });

            if (response.status === 200) {
                const updated = reviews.map(item => {
                    if (item._id === reviewId) {
                        return { ...item, status: updatedStatus };
                    }
                    return item;
                });
                setReviews(updated);
                toast.success(updatedStatus ? "Review approved & visible!" : "Review hidden from storefront!");
            }
        } catch (error) {
            toast.error("Error updating review visibility");
            console.error("Error updating review visibility:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredReviews = reviews.filter((review) =>
        review?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review?.reviewText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review?.product?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredReviews.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>⭐ Customer Reviews &amp; Ratings ({totalItems})</h4>
                </div>
            </div>

            {/* Toolbar Controls */}
            <div className="list-toolbar">
                <div className="list-toolbar-left">
                    <div className="search-box" style={{ width: "280px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="🔍 Search customer, product, review..."
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
                                <th>Product</th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Rating</th>
                                <th>Review Comment</th>
                                <th className="text-center">Visible (Approved)</th>
                                <th>Date</th>
                                {canDelete && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading reviews...
                                    </td>
                                </tr>
                            ) : paginatedReviews.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4 text-muted">
                                        No Reviews found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedReviews.map((review, index) => (
                                    <tr key={review._id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>
                                            <strong>{review?.product?.productName || 'BeautyHub Item'}</strong>
                                        </td>
                                        <td>{review?.name}</td>
                                        <td>{review?.email || 'N/A'}</td>
                                        <td>
                                            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                                                {'★'.repeat(Math.min(5, Math.round(review?.rating || 5)))}
                                            </span> ({review?.rating} Stars)
                                        </td>
                                        <td style={{ maxWidth: "300px", whiteSpace: "normal" }}>{review?.reviewText}</td>
                                        <td className="text-center">
                                            <div className="form-check form-switch d-flex justify-content-center m-0">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    role="switch"
                                                    disabled={!canUpdate}
                                                    checked={review?.status || false}
                                                    onChange={(e) => canUpdate && handleCheckboxChange(e, review?._id)}
                                                    style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "38px", height: "20px" }}
                                                />
                                            </div>
                                        </td>
                                        <td>{formatDate(review?.createdAt)}</td>
                                        {canDelete && (
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    className="bt delete"
                                                    title="Delete"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
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
                            <p className="mt-2 text-muted">Loading reviews...</p>
                        </div>
                    ) : paginatedReviews.length === 0 ? (
                        <div className="col-12 text-center py-5 text-muted">
                            <h5>No reviews found</h5>
                        </div>
                    ) : (
                        paginatedReviews.map((review) => (
                            <div key={review._id} className="admin-product-card p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
                                        {'★'.repeat(Math.min(5, Math.round(review?.rating || 5)))}
                                    </span>
                                    <span className="text-muted small">{formatDate(review?.createdAt)}</span>
                                </div>

                                <h6 className="fw-bold text-dark mb-1">
                                    {review?.product?.productName || "Product Review"}
                                </h6>
                                <div className="text-muted small mb-2">
                                    By: <strong>{review?.name}</strong> {review?.email && `(${review.email})`}
                                </div>

                                <p className="text-secondary small fst-italic bg-light p-2.5 rounded-3 mb-3">
                                    "{review?.reviewText || 'No comment provided.'}"
                                </p>

                                <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                                    <label className="featured-toggle-label">
                                        <input
                                            type="checkbox"
                                            className="form-check-input m-0"
                                            checked={review?.status || false}
                                            disabled={!canUpdate}
                                            onChange={(e) => canUpdate && handleCheckboxChange(e, review?._id)}
                                        />
                                        <span>Approved</span>
                                    </label>

                                    {canDelete && (
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="bt delete"
                                            title="Delete Review"
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
                    itemLabel="reviews"
                />
            )}
        </>
    );
};

export default AllReviews;
