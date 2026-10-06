import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { hasPermission } from '../../services/permissionHelper';
import Pagination from '../../Components/Common/Pagination';
import ViewToggle from '../../Components/Common/ViewToggle';

const AllCoupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // View mode & pagination
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("coupons_view_mode") || "list";
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleViewChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem("coupons_view_mode", mode);
    };

    const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

    const canWrite = hasPermission(storedUser, storedRoleDetails, "Manage Coupons", "write");
    const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Coupons", "update");
    const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Coupons", "delete");

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('api/v1/coupon/get-all-coupons');
            if (response.status === 200) {
                setCoupons(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Failed to fetch coupons!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (couponId) => {
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
                const response = await axiosInstance.delete(`/api/v1/coupon/delete-coupon/${couponId}`);
                if (response.status === 200) {
                    setCoupons(coupons.filter(coupon => coupon._id !== couponId));
                    toast.success("Coupon deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting coupon:", error);
                toast.error("Failed to delete coupon!");
            }
        }
    };

    const handleCheckboxChange = async (e, couponId) => {
        const updatedStatus = e.target.checked;
        try {
            const response = await axiosInstance.put(`/api/v1/coupon/update-coupon/${couponId}`, {
                isActive: updatedStatus
            });

            if (response.status === 200) {
                setCoupons(coupons.map(coupon => coupon._id === couponId ? { ...coupon, isActive: updatedStatus } : coupon));
                toast.success(updatedStatus ? "Coupon marked active on homepage!" : "Coupon deactivated!");
            }
        } catch (error) {
            toast.error("Error updating coupon status");
            console.error("Error updating coupon status:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredCoupons = coupons?.filter(coupon =>
        coupon?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon?.couponCode?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredCoupons?.length || 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCoupons = filteredCoupons?.slice(startIndex, startIndex + itemsPerPage) || [];

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>🏷️ All Coupons ({totalItems})</h4>
                </div>
                <div className="links d-flex align-items-center gap-3">
                    {canWrite && (
                        <Link to="/add-coupon" className="add-new">
                            <i className="fa-solid fa-plus"></i> Add New Coupon
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
                            placeholder="🔍 Search coupon title, code..."
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
                                <th scope="col">Coupon Title</th>
                                <th scope="col">Coupon Code</th>
                                <th scope="col">Discount</th>
                                <th scope="col" className="text-center">Homepage Banner Active</th>
                                {(canUpdate || canDelete) && <th scope="col">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading coupons...
                                    </td>
                                </tr>
                            ) : paginatedCoupons?.length > 0 ? (
                                paginatedCoupons.map((coupon, index) => (
                                    <tr key={coupon._id}>
                                        <th scope="row">{startIndex + index + 1}</th>
                                        <td><strong>{coupon?.title || "-"}</strong></td>
                                        <td>
                                            <span className="badge bg-primary fs-6 font-monospace">
                                                {coupon?.couponCode}
                                            </span>
                                        </td>
                                        <td>
                                            <strong className="text-success fs-6">
                                                {coupon.discount}{coupon?.discount > 100 ? "₹" : "%"} OFF
                                            </strong>
                                        </td>
                                        <td className="text-center">
                                            <div className="form-check form-switch d-flex justify-content-center m-0">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    role="switch"
                                                    disabled={!canUpdate}
                                                    checked={coupon?.isActive || false}
                                                    onChange={(e) => canUpdate && handleCheckboxChange(e, coupon._id)}
                                                    style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "38px", height: "20px" }}
                                                />
                                            </div>
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td>
                                                {canUpdate && (
                                                    <Link to={`/edit-coupon/${coupon?._id}`} className="bt edit">
                                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                )}
                                                {canUpdate && canDelete && <>&nbsp;</>}
                                                {canDelete && (
                                                    <button className="bt delete" onClick={() => handleDelete(coupon?._id)}>
                                                        Delete <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No Coupons found
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
                            <p className="mt-2 text-muted">Loading coupons...</p>
                        </div>
                    ) : paginatedCoupons.length === 0 ? (
                        <div className="col-12 text-center py-5 text-muted">
                            <h5>No coupons found</h5>
                        </div>
                    ) : (
                        paginatedCoupons.map((coupon) => (
                            <div key={coupon._id} className="admin-product-card p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="badge bg-primary font-monospace fs-6 px-3 py-1.5">
                                        {coupon.couponCode}
                                    </span>
                                    <span className="badge bg-success fs-6">
                                        {coupon.discount}{coupon?.discount > 100 ? "₹" : "%"} OFF
                                    </span>
                                </div>

                                <h5 className="fw-bold text-dark mt-2 mb-3">{coupon.title || "Promotional Voucher"}</h5>

                                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                                    <label className="featured-toggle-label">
                                        <input
                                            type="checkbox"
                                            className="form-check-input m-0"
                                            checked={coupon?.isActive || false}
                                            disabled={!canUpdate}
                                            onChange={(e) => canUpdate && handleCheckboxChange(e, coupon._id)}
                                        />
                                        <span>Homepage Banner</span>
                                    </label>

                                    <div className="d-flex align-items-center gap-1">
                                        {canUpdate && (
                                            <Link to={`/edit-coupon/${coupon._id}`} className="bt edit" title="Edit">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                        )}
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
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
                    itemLabel="coupons"
                />
            )}
        </>
    );
};

export default AllCoupon;
