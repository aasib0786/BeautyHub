import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { hasPermission } from '../../services/permissionHelper';
import Pagination from '../../Components/Common/Pagination';
import ViewToggle from '../../Components/Common/ViewToggle';

function AllDieses() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // View mode & pagination
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("categories_view_mode") || "list";
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleViewChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem("categories_view_mode", mode);
    };

    const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

    const canWrite = hasPermission(storedUser, storedRoleDetails, "All Category", "write");
    const canUpdate = hasPermission(storedUser, storedRoleDetails, "All Category", "update");
    const canDelete = hasPermission(storedUser, storedRoleDetails, "All Category", "delete");

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/v1/category/get-all-categories');
            if (response?.data?.data) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to fetch categories!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (categoryId) => {
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
                const response = await axiosInstance.delete(`/api/v1/category/delete-category/${categoryId}`);
                if (response.status === 200) {
                    setCategories(categories.filter((cat) => cat._id !== categoryId));
                    toast.success("Category deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("Failed to delete category!");
            }
        }
    };

    const handleCheckboxChange = async (e, categoryId) => {
        const updatedStatus = e.target.checked;
        try {
            const response = await axiosInstance.put(`/api/v1/category/update-category/${categoryId}`, {
                isCollection: updatedStatus,
            });

            if (response.status === 200) {
                setCategories(categories.map((cat) => (cat._id === categoryId ? { ...cat, isCollection: updatedStatus } : cat)));
                toast.success(updatedStatus ? "Category shown in footer collection!" : "Category removed from footer collection!");
            }
        } catch (error) {
            toast.error("Error updating category status");
            console.error("Error updating category status:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredCategories = categories?.filter((category) =>
        category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category?.mainCategory?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredCategories?.length || 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = filteredCategories?.slice(startIndex, startIndex + itemsPerPage) || [];

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>📂 All Categories ({totalItems})</h4>
                </div>
                <div className="links d-flex align-items-center gap-3">
                    {canWrite && (
                        <Link to="/add-category" className="add-new">
                            <i className="fa-solid fa-plus"></i> Add New Category
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
                            placeholder="🔍 Search categories..."
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
                                <th scope="col">Image</th>
                                <th scope="col">Category Name</th>
                                <th scope="col">Main Category</th>
                                <th scope="col" className="text-center">Show in Footer</th>
                                {(canUpdate || canDelete) && <th scope="col">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading categories...
                                    </td>
                                </tr>
                            ) : paginatedCategories?.length > 0 ? (
                                paginatedCategories.map((category, index) => (
                                    <tr key={category._id}>
                                        <th scope="row">{startIndex + index + 1}</th>
                                        <td>
                                            <img
                                                src={`${category?.categoryImage}`}
                                                alt={category?.categoryName}
                                                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                                className="rounded border"
                                            />
                                        </td>
                                        <td><strong>{category?.categoryName}</strong></td>
                                        <td>
                                            <span className="badge bg-secondary">
                                                {category?.mainCategory?.mainCategoryName || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="form-check form-switch d-flex justify-content-center m-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    disabled={!canUpdate}
                                                    checked={category?.isCollection || false}
                                                    onChange={(e) => canUpdate && handleCheckboxChange(e, category._id)}
                                                    style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "38px", height: "20px" }}
                                                />
                                            </div>
                                        </td>

                                        {(canUpdate || canDelete) && (
                                            <td>
                                                {canUpdate && (
                                                    <Link to={`/edit-category/${category?._id}`} className="bt edit">
                                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                )}
                                                {canUpdate && canDelete && <>&nbsp;</>}
                                                {canDelete && (
                                                    <button className="bt delete" onClick={() => handleDelete(category._id)}>
                                                        Delete <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">No categories found</td>
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
                            <p className="mt-2 text-muted">Loading categories...</p>
                        </div>
                    ) : paginatedCategories.length === 0 ? (
                        <div className="col-12 text-center py-5 text-muted">
                            <h5>No categories found</h5>
                        </div>
                    ) : (
                        paginatedCategories.map((category) => (
                            <div key={category._id} className="admin-product-card">
                                <div className="product-card-thumb-wrap" style={{ height: "170px" }}>
                                    <img
                                        src={`${category?.categoryImage}`}
                                        alt={category?.categoryName}
                                        className="product-card-thumb"
                                    />
                                    {category?.mainCategory?.mainCategoryName && (
                                        <div className="product-card-badge-top">
                                            <span className="badge bg-secondary">
                                                {category.mainCategory.mainCategoryName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="product-card-body">
                                    <h5 className="product-card-title mb-2" style={{ height: "auto" }}>
                                        {category.categoryName}
                                    </h5>

                                    <div className="product-card-footer mt-auto pt-2">
                                        <label className="featured-toggle-label">
                                            <input
                                                type="checkbox"
                                                className="form-check-input m-0"
                                                checked={category?.isCollection || false}
                                                disabled={!canUpdate}
                                                onChange={(e) => canUpdate && handleCheckboxChange(e, category._id)}
                                            />
                                            <span>In Footer</span>
                                        </label>

                                        <div className="product-card-actions">
                                            {canUpdate && (
                                                <Link to={`/edit-category/${category._id}`} className="bt edit" title="Edit">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </Link>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => handleDelete(category._id)} className="bt delete" title="Delete">
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
                    itemLabel="categories"
                />
            )}
        </>
    );
}

export default AllDieses;
