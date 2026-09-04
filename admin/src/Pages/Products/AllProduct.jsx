import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { hasPermission } from '../../services/permissionHelper';

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredProducts = products?.filter(product =>
        product?.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.brand?.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.mainCategory?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.subCategory?.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <ToastContainer />

            <div className="bread">
                <div className="head">
                    <h4>All Product List</h4>
                </div>
                <div className="links d-flex align-items-center gap-3">
                    <div className="search-box" style={{ width: "260px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="🔍 Search products, brand, category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ borderRadius: "20px", padding: "6px 14px" }}
                        />
                    </div>
                    {canWrite && (
                        <Link to="/add-product" className="add-new">
                            Add New <i className="fa-solid fa-plus"></i>
                        </Link>
                    )}
                </div>
            </div>

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
                            <th>Best Seller (Show in Footer)</th>
                            {(canUpdate || canDelete) && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={storedUser?.role?.toLowerCase() !== "vendor" ? "12" : "11"} className="text-center">Loading...</td>
                            </tr>
                        ) : filteredProducts?.length === 0 ? (
                            <tr>
                                <td colSpan={storedUser?.role?.toLowerCase() !== "vendor" ? "12" : "11"} className="text-center">No products found.</td>
                            </tr>
                        ) : (
                            filteredProducts?.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={product?.images?.[0]}
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
        </>
    );
};

export default AllProduct;