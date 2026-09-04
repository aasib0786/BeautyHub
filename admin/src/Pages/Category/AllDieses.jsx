import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { hasPermission } from '../../services/permissionHelper';

const AllDieses = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

    const canWrite = hasPermission(storedUser, storedRoleDetails, "All Category", "write");
    const canUpdate = hasPermission(storedUser, storedRoleDetails, "All Category", "update");
    const canDelete = hasPermission(storedUser, storedRoleDetails, "All Category", "delete");



    // Fetch Categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/api/v1/category/get-all-categories');
                if (response?.data?.data) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                toast.error("Error fetching categories");
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Handle Delete Action
    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const data = await axiosInstance.delete(`/api/v1/category/delete-category/${id}`);

                if (data.status === 200) {
                    setCategories(categories.filter(category => category._id !== id));
                    Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
                }
            } catch (error) {
                Swal.fire('Error!', 'There was an error deleting the category.', 'error');
                console.error("Error deleting category:", error);
            }
        }
    };

    // Handle Category Status Change
    const handleCheckboxChange = async (e, categoryId) => {
        const updatedStatus = e.target.checked;

        try {
            const response = await axiosInstance.put(`/api/v1/category/update-category/${categoryId}`, {
                isCollection: updatedStatus
            });

            if (response.status === 200) {
                const updatedCategories = categories.map(category => {
                    if (category._id === categoryId) {
                        return { ...category, isCollection: updatedStatus };
                    }
                    return category;
                });
                setCategories(updatedCategories);
                toast.success("Category collection status updated");
            }
        } catch (error) {
            toast.error("Error updating category status");
            console.error("Error updating category status:", error);
        }
    };

    const filteredCategories = categories?.filter((category) =>
        category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category?.mainCategory?.mainCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Loading state
    if (isLoading) {
        return <p className="p-4">Loading categories...</p>;
    }

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Category</h4>
                </div>
                <div className="links d-flex align-items-center gap-3">
                    <div className="search-box" style={{ width: "240px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="🔍 Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ borderRadius: "20px", padding: "6px 14px" }}
                        />
                    </div>
                    {canWrite && (
                        <Link to="/add-category" className="add-new">
                            Add New <i className="fa-solid fa-plus"></i>
                        </Link>
                    )}
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Main Category</th>
                            <th scope="col">Name</th>
                            <th scope="col">Image</th>
                            <th scope="col">Show in Footer (Category)</th>
                            {canUpdate && <th scope="col">Edit</th>}
                            {canDelete && <th scope="col">Delete</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories?.length > 0 ? (
                            filteredCategories?.map((category, index) => (

                                <tr key={category._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        <span className="badge bg-secondary">
                                            {category?.mainCategory?.mainCategoryName || 'N/A'}
                                        </span>
                                    </td>
                                    <td>{category?.categoryName}</td>
                                    <td>
                                        <img
                                            src={`${category?.categoryImage}`}
                                            alt={category?.categoryName}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            className="rounded"
                                        />
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

                                    {canUpdate && (
                                        <td>
                                            <Link to={`/edit-category/${category?._id}`} className="bt edit">
                                                Edit <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                        </td>
                                    )}
                                    {canDelete && (
                                        <td>
                                            <button className="bt delete" onClick={() => handleDelete(category._id)}>
                                                Delete <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No categories found</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </section>
        </>
    );
}

export default AllDieses;
