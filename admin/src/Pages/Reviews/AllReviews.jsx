import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getData, postData } from '../../services/FetchNodeServices';
import { formatDate } from '../../constant';
import { hasPermission } from '../../services/permissionHelper';

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

    const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Reviews", "update");
    const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Reviews", "delete");


    // Fetch all reviews
    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const response = await getData("api/v1/review/all");
            if (response.success === true) {
                setReviews(response?.reviews || []);
            } else {
                const fallbackRes = await getData("api/products/get-all-reviews");
                if (fallbackRes.success === true) {
                    setReviews(fallbackRes?.reviews || []);
                }
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to fetch reviews!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Handle review deletion
    const handleDelete = async (reviewId) => {
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
                const data = await getData(`api/products/delete-reviews/${reviewId}`);
                if (data.success === true) {
                    setReviews(reviews.filter(review => review._id !== reviewId));
                    toast.success("Review deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error("Failed to delete review!");
            }
        }
    };

    // Handle checkbox change to update review status
    const handleCheckboxChange = async (e, reviewId) => {
        const updatedStatus = e.target.checked;

        try {
            const response = await postData('api/products/change-review-status', { reviewId: reviewId, status: updatedStatus });

            if (response.success === true) {
                const updatedReviews = reviews.map(review => {
                    if (review._id === reviewId) {
                        return { ...review, status: updatedStatus };
                    }
                    return review;
                });

                setReviews(updatedReviews);
                toast.success('Review status updated successfully');
            }
        } catch (error) {
            toast.error("Error updating review status");
            console.error("Error updating review status:", error);
        }
    };

    // Filter reviews based on search query
    const filteredReviews = reviews?.filter((review) =>
        review?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        review?.product?.productName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        review?.reviewText?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Customer Reviews & Ratings</h4>
                </div>
                <div className="links d-flex align-items-center gap-3">
                    <div className="search-box" style={{ width: "260px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="🔍 Search customer, product, review..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ borderRadius: "20px", padding: "6px 14px" }}
                        />
                    </div>
                </div>
            </div>


            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Product</th>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Rating</th>
                            <th>Review Comment</th>
                            <th>Visible (Approved)</th>
                            <th>Date</th>
                            {canDelete && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    Loading reviews...
                                </td>
                            </tr>
                        ) : filteredReviews.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    No Reviews found.
                                </td>
                            </tr>
                        ) : (
                            filteredReviews?.map((review, index) => (
                                <tr key={review._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{review?.product?.productName || 'BeautyHub Item'}</strong>
                                    </td>
                                    <td>{review?.name}</td>
                                    <td>{review?.email || 'N/A'}</td>
                                    <td>
                                        <span style={{ color: '#E5C07B', fontWeight: 'bold' }}>
                                            {'★'.repeat(Math.round(review?.rating || 5))}
                                        </span> ({review?.rating} Stars)
                                    </td>
                                    <td style={{ maxWidth: "300px" }}>{review?.reviewText}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <input
                                            type="checkbox"
                                            disabled={!canUpdate}
                                            checked={review?.status}
                                            onChange={(e) => canUpdate && handleCheckboxChange(e, review?._id)}
                                            style={{ cursor: canUpdate ? "pointer" : "not-allowed" }}
                                        />
                                    </td>
                                    <td>{formatDate(review?.createdAt)}</td>
                                    {canDelete && (
                                        <td>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="bt delete"
                                            >
                                                Delete <i className="fa-solid fa-trash"></i>
                                            </button>
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

export default AllReviews;
