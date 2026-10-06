import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { hasPermission } from '../../services/permissionHelper';
import Pagination from '../../Components/Common/Pagination';
import ViewToggle from '../../Components/Common/ViewToggle';

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // View mode: 'list' (table) vs 'card' (grid)
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('product_view_mode') || 'list';
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleViewChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('product_view_mode', mode);
    };

    const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

    const canWrite = hasPermission(storedUser, storedRoleDetails, "All Products", "write");
    const canUpdate = hasPermission(storedUser, storedRoleDetails, "All Products", "update");
    const canDelete = hasPermission(storedUser, storedRoleDetails, "All Products", "delete");

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`api/v1/product/get-all-products`);
                if (response?.data?.data) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to fetch products!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
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
                const data = await axiosInstance.delete(`/api/v1/product/delete-product/${productId}`);
                if (data.status === 200) {
                    setProducts(products?.filter(product => product._id !== productId));
                    toast.success("Product deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product!");
            }
        }
    };

    const handleFeaturedChange = async (e, productId) => {
        const updatedStatus = e.target.checked;

        try {
            const response = await axiosInstance.put(`/api/v1/product/update-product/${productId}`, {
                isFeatured: updatedStatus
            });

            if (response.status === 200) {
                const updatedProducts = products.map(product => {
                    if (product._id === productId) {
                        return { ...product, isFeatured: updatedStatus };
                    }
                    return product;
                });
                setProducts(updatedProducts);
                toast.success(updatedStatus ? "Product added to Best Sellers (Footer)!" : "Product removed from Best Sellers (Footer)!");
            }
        } catch (error) {
            toast.error("Error updating product status");
            console.error("Error updating product status:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // reset to first page on search
    };

    const filteredProducts = products?.filter(product =>
        product?.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.brand?.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.mainCategory?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.subCategory?.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate Paginated items
    const totalItems = filteredProducts?.length || 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts?.slice(startIndex, startIndex + itemsPerPage) || [];

    return (
        <>
            <ToastContainer />

            {/* Breadcrumb Header */}
            <div className="bread">
                <div className="head">
                    <h4>📦 All Products ({totalItems})</h4>
                </div>
                <div className="links d-flex align-items-center gap-3 flex-wrap">
                    {canWrite && (
                        <Link to="/add-product" className="add-new">
                            <i className="fa-solid fa-plus"></i> Add New Product
                        </Link>
                    )}
                </div>
            </div>

            {/* Controls Toolbar: Search, View Switcher, Limit */}
            <div className="list-toolbar">
                <div className="list-toolbar-left">
                    <div className="search-box" style={{ width: "290px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="🔍 Search name, brand, category..."
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
                    {/* View Switcher Toggle */}
                    <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />

                    {/* Items Per Page Selector */}
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

            {/* Content: List (Table) View */}
            {viewMode === 'list' && (
                <section className="main-table">
                    <table className="table table-bordered table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th>S No.</th>
                                <th>Image</th>
                                <th>Product Name</th>
                                {storedUser?.role?.toLowerCase() !== "vendor" && <th>Vendor / Seller</th>}
                                <th>Brand</th>
                                <th>Main Category</th>
                                <th>Category</th>
                                <th>Sub Category</th>
                                <th>Price</th>
                                <th>Final Price</th>
                                <th className="text-center">Best Seller</th>
                                {(canUpdate || canDelete) && <th>Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={storedUser?.role?.toLowerCase() !== "vendor" ? "12" : "11"} className="text-center py-4">
                                        <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading products...
                                    </td>
                                </tr>
                            ) : paginatedProducts?.length === 0 ? (
                                <tr>
                                    <td colSpan={storedUser?.role?.toLowerCase() !== "vendor" ? "12" : "11"} className="text-center py-4 text-muted">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product, index) => (
                                    <tr key={product._id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>
                                            <img
                                                src={product?.images?.[0] || "/placeholder-product.png"}
                                                alt={product?.productName}
                                                style={{ width: "48px", height: "48px", objectFit: "cover" }}
                                                className="rounded border"
                                            />
                                        </td>
                                        <td>
                                            <strong>{product.productName}</strong>
                                        </td>
                                        {storedUser?.role?.toLowerCase() !== "vendor" && (
                                            <td>
                                                <span className="badge bg-primary text-white">
                                                    👤 {product?.createdBy?.name || product?.seller || "Admin"}
                                                </span>
                                            </td>
                                        )}
                                        <td>
                                            <span className="badge bg-dark">
                                                {product?.brand?.brandName || product?.brandName || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary">
                                                {product?.mainCategory?.mainCategoryName || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-info text-dark">
                                                {product?.category?.categoryName || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {product?.subCategory?.subCategoryName || "N/A"}
                                            </span>
                                        </td>
                                        <td>₹{product?.price}</td>
                                        <td><strong>₹{product?.finalPrice}</strong></td>
                                        <td className="text-center">
                                            <div className="form-check form-switch d-flex justify-content-center m-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    disabled={!canUpdate}
                                                    checked={product?.isFeatured || false}
                                                    onChange={(e) => canUpdate && handleFeaturedChange(e, product._id)}
                                                    style={{ cursor: canUpdate ? "pointer" : "not-allowed", width: "40px", height: "20px" }}
                                                    title="Best Seller"
                                                />
                                            </div>
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td>
                                                {canUpdate && (
                                                    <Link to={`/edit-product/${product._id}`} className="bt edit">
                                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                )}
                                                {canUpdate && canDelete && <>&nbsp;</>}
                                                {canDelete && (
                                                    <button onClick={() => handleDelete(product._id)} className="bt delete">
                                                        Delete <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
            )}

            {/* Content: Card (Grid) View */}
            {viewMode === 'card' && (
                <div className="admin-card-grid">
                    {isLoading ? (
                        <div className="col-12 text-center py-5">
                            <i className="fa-solid fa-circle-notch fa-spin fa-2x text-primary"></i>
                            <p className="mt-2 text-muted">Loading products...</p>
                        </div>
                    ) : paginatedProducts?.length === 0 ? (
                        <div className="col-12 text-center py-5 text-muted">
                            <i className="fa-solid fa-box-open fa-3x mb-3 text-secondary"></i>
                            <h5>No products found</h5>
                        </div>
                    ) : (
                        paginatedProducts.map((product) => (
                            <div key={product._id} className="admin-product-card">
                                <div className="product-card-thumb-wrap">
                                    <img
                                        src={product?.images?.[0] || "/placeholder-product.png"}
                                        alt={product?.productName}
                                        className="product-card-thumb"
                                    />
                                    <div className="product-card-badge-top">
                                        {product?.brand?.brandName && (
                                            <span className="badge bg-dark">
                                                {product?.brand?.brandName}
                                            </span>
                                        )}
                                        {product?.category?.categoryName && (
                                            <span className="badge bg-info text-dark">
                                                {product?.category?.categoryName}
                                            </span>
                                        )}
                                    </div>
                                    {storedUser?.role?.toLowerCase() !== "vendor" && (
                                        <div className="product-card-seller-pill">
                                            👤 {product?.createdBy?.name || product?.seller || "Admin"}
                                        </div>
                                    )}
                                </div>

                                <div className="product-card-body">
                                    <div className="product-card-tags">
                                        {product?.mainCategory?.mainCategoryName && (
                                            <span className="badge bg-secondary">
                                                {product.mainCategory.mainCategoryName}
                                            </span>
                                        )}
                                        {product?.subCategory?.subCategoryName && (
                                            <span className="badge bg-light text-dark border">
                                                {product.subCategory.subCategoryName}
                                            </span>
                                        )}
                                    </div>

                                    <h5 className="product-card-title" title={product.productName}>
                                        {product.productName}
                                    </h5>

                                    <div className="product-card-price-row">
                                        <span className="product-final-price">₹{product?.finalPrice}</span>
                                        {product?.price > product?.finalPrice && (
                                            <span className="product-regular-price">₹{product?.price}</span>
                                        )}
                                    </div>

                                    <div className="product-card-footer">
                                        <label className="featured-toggle-label">
                                            <input
                                                type="checkbox"
                                                className="form-check-input m-0"
                                                checked={product?.isFeatured || false}
                                                disabled={!canUpdate}
                                                onChange={(e) => canUpdate && handleFeaturedChange(e, product._id)}
                                            />
                                            <span>Best Seller</span>
                                        </label>

                                        <div className="product-card-actions">
                                            {canUpdate && (
                                                <Link to={`/edit-product/${product._id}`} className="bt edit" title="Edit Product">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </Link>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => handleDelete(product._id)} className="bt delete" title="Delete Product">
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
                    itemLabel="products"
                />
            )}
        </>
    );
};

export default AllProduct;