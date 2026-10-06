import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { hasPermission } from '../../services/permissionHelper';
import Pagination from '../../Components/Common/Pagination';
import ViewToggle from '../../Components/Common/ViewToggle';

const AllSBanner = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // View mode & pagination
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("banners_view_mode") || "list";
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleViewChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem("banners_view_mode", mode);
    };

    const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

    const canWrite = hasPermission(storedUser, storedRoleDetails, "Manage Banners", "write");
    const canUpdate = hasPermission(storedUser, storedRoleDetails, "Manage Banners", "update");
    const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Banners", "delete");

    useEffect(() => {
        const fetchBanners = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('api/v1/banner/get-all-banners');
                if (response.status === 200) {
                    setBanners(response.data.banners);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
                toast.error("Failed to fetch banners!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    const handleDelete = async (bannerId) => {
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
                const response = await axiosInstance.delete(`/api/v1/banner/delete-banner/${bannerId}`);
                if (response.status === 200) {
                    setBanners(banners.filter(banner => banner._id !== bannerId));
                    toast.success("Banner deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting banner:", error);
                toast.error("Failed to delete banner!");
            }
        }
    };

    const handleCheckboxChange = async (e, bannerId) => {
        const updatedStatus = e.target.checked;
        try {
            const response = await axiosInstance.put(`/api/v1/banner/update-banner/${bannerId}`, {
                isActive: updatedStatus
            });

            if (response.status === 200) {
                const updatedBanners = banners.map(banner => {
                    if (banner._id === bannerId) {
                        return { ...banner, isActive: updatedStatus };
                    }
                    return banner;
                });
                setBanners(updatedBanners);
                toast.success(updatedStatus ? "Banner activated on homepage!" : "Banner deactivated!");
            }
        } catch (error) {
            toast.error("Error updating banner status");
            console.error("Error updating banner status:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredBanners = banners?.filter((banner) =>
        banner?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner?.subCategory?.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredBanners?.length || 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBanners = filteredBanners?.slice(startIndex, startIndex + itemsPerPage) || [];

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>🖼️ All Banners ({totalItems})</h4>
                </div>
                <div className="links d-flex align-items-center gap-3">
                    {canWrite && (
                        <Link to="/add-banner" className="add-new">
                            <i className="fa-solid fa-plus"></i> Add New Banner
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
                            placeholder="🔍 Search banners..."
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
                                <th scope="col">Banner Image</th>
                                <th>Title</th>
                                <th>Collection / Subcategory</th>
                                <th scope="col" className="text-center">Show on Home Page</th>
                                {(canUpdate || canDelete) && <th scope="col">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading banners...
                                    </td>
                                </tr>
                            ) : paginatedBanners?.length > 0 ? (
                                paginatedBanners.map((banner, index) => (
                                    <tr key={banner?._id}>
                                        <th scope="row">{startIndex + index + 1}</th>
                                        <td>
                                            <img
                                                src={`${banner?.bannerImage}`}
                                                alt={banner?.title || "Banner"}
                                                style={{ width: '120px', height: '60px', objectFit: 'cover' }}
                                                className="rounded border"
                                            />
                                        </td>
                                        <td><strong>{banner?.title || "-"}</strong></td>
                                        <td>
                                            <span className="badge bg-secondary">
                                                {banner?.subCategory?.subCategoryName || "General"}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="form-check form-switch d-flex justify-content-center m-0">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    role="switch"
                                                    disabled={!canUpdate}
                                                    checked={banner?.isActive || false}
                                                    onChange={(e) => canUpdate && handleCheckboxChange(e, banner?._id)}
                                                    style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "38px", height: "20px" }}
                                                />
                                            </div>
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td>
                                                {canUpdate && (
                                                    <Link to={`/edit-banner/${banner?._id}`} className="bt edit">
                                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                )}
                                                {canUpdate && canDelete && <>&nbsp;</>}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => handleDelete(banner?._id)}
                                                        className="bt delete"
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
                                    <td colSpan="6" className="text-center py-4 text-muted">No banners found</td>
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
                            <p className="mt-2 text-muted">Loading banners...</p>
                        </div>
                    ) : paginatedBanners.length === 0 ? (
                        <div className="col-12 text-center py-5 text-muted">
                            <h5>No banners found</h5>
                        </div>
                    ) : (
                        paginatedBanners.map((banner) => (
                            <div key={banner._id} className="admin-product-card">
                                <div className="product-card-thumb-wrap" style={{ height: "160px" }}>
                                    <img
                                        src={`${banner?.bannerImage}`}
                                        alt={banner?.title || "Banner"}
                                        className="product-card-thumb"
                                    />
                                    {banner?.subCategory?.subCategoryName && (
                                        <div className="product-card-badge-top">
                                            <span className="badge bg-secondary">
                                                {banner.subCategory.subCategoryName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="product-card-body">
                                    <h5 className="product-card-title mb-2" style={{ height: "auto" }}>
                                        {banner.title || "Homepage Banner"}
                                    </h5>

                                    <div className="product-card-footer mt-auto pt-2">
                                        <label className="featured-toggle-label">
                                            <input
                                                type="checkbox"
                                                className="form-check-input m-0"
                                                checked={banner?.isActive || false}
                                                disabled={!canUpdate}
                                                onChange={(e) => canUpdate && handleCheckboxChange(e, banner._id)}
                                            />
                                            <span>Active</span>
                                        </label>

                                        <div className="product-card-actions">
                                            {canUpdate && (
                                                <Link to={`/edit-banner/${banner._id}`} className="bt edit" title="Edit">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </Link>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => handleDelete(banner._id)} className="bt delete" title="Delete">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
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
                    itemLabel="banners"
                />
            )}
        </>
    );
};

export default AllSBanner;
