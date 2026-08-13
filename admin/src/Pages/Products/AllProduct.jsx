import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { Parser } from 'html-to-react';

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredProducts = products?.filter(product =>
        product?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <ToastContainer />

            <div className="bread">
                <div className="head">
                    <h4>All Product List</h4>
                </div>
                <div className="links">
                    <Link to="/add-product" className="add-new">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Brand</th>
                            <th>Main Category</th>
                            <th>Category</th>
                            <th>Sub Category</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Final Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="11" className="text-center">Loading...</td>
                            </tr>
                        ) : filteredProducts?.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="text-center">No products found.</td>
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
                                    <td>{product?.discount}%</td>
                                    <td><strong>₹{product?.finalPrice}</strong></td>
                                    <td>
                                        <Link to={`/edit-product/${product._id}`} className="bt edit">
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                        &nbsp;
                                        <button onClick={() => handleDelete(product._id)} className="bt delete">
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
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