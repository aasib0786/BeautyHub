import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/FetchNodeServices';
import { hasPermission } from '../../services/permissionHelper';

const AllSBanner = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
    const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

    const canWrite = hasPermission(storedUser, storedRoleDetails, "Banners", "write");
    const canUpdate = hasPermission(storedUser, storedRoleDetails, "Banners", "update");
    const canDelete = hasPermission(storedUser, storedRoleDetails, "Banners", "delete");


    const fetchBanners = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/api/v1/banner/get-all-banners');
            if (response.status === 200) {
                setBanners(response?.data?.banners);
            } else {
                toast.error("Failed to load banners");
            }
        } catch (error) {
            console.log('error', error)
            toast.error("An error occurred while fetching banners:-", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        fetchBanners();
    }, []);

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const data = await axiosInstance.delete(`/api/v1/banner/delete-banner/${id}`);
                if (data?.status === 200) {
                    setBanners(banners.filter(banner => banner?._id !== id));
                    toast.success("Banner deleted successfully");
                } else {
                    toast.error("Banner deleted Failed");
                }

            }
        } catch (error) {
            toast.error("Failed to delete the banner");
        }
    };


    const handleCheckboxChange = async (e, bannerId) => {
        const updatedStatus = e.target.checked;

        try {
            const response = await axiosInstance.put(`/api/v1/banner/update-banner/${bannerId}`, {
                isActive: updatedStatus
            });

            if (response.status === 200) {
                const updatedProducts = banners.map(banner => {
                    if (banner._id === bannerId) {
                        return { ...banner, isActive: updatedStatus };
                    }
                    return banner;
                });
                setBanners(updatedProducts);

            }
        } catch (error) {
            toast.error("Error updating Banner status");
            console.error("Error updating Banner status:", error);
        }
    };



    const filteredBanners = banners?.filter((banner) =>
        banner?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner?.subCategory?.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Banners</h4>
                </div>
                <div className="links d-flex align-items-center gap-3">
                    <div className="search-box" style={{ width: "240px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="🔍 Search banners..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ borderRadius: "20px", padding: "6px 14px" }}
                        />
                    </div>
                    {canWrite && (
                        <Link to="/add-banner" className="add-new">
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
                            <th scope="col">Image</th>
                            <th>Title</th>
                            <th>Collection</th>
                            <th scope="col">Show in home page</th>
                            {canUpdate && <th scope="col">Edit</th>}
                            {canDelete && <th scope="col">Delete</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center">Loading...</td>
                            </tr>
                        ) : filteredBanners?.length > 0 ? (
                            filteredBanners?.map((banner, index) => (

                                <tr key={banner?._id}>
                                    <th scope="row">{index + 1}</th>
                                    {/* <td>{banner?.name}</td> */}
                                    <td>
                                        <img
                                            src={`${banner?.bannerImage}`}
                                            alt={banner?.bannerName}
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>{banner?.title}</td>
                                    <td>{banner?.subCategory?.subCategoryName}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            disabled={!canUpdate}
                                            checked={banner?.isActive}
                                            onChange={(e) => canUpdate && handleCheckboxChange(e, banner?._id)}
                                            style={{ cursor: canUpdate ? "pointer" : "not-allowed" }}
                                        />
                                    </td>
                                    {canUpdate && (
                                        <td>
                                            <Link to={`/edit-banner/${banner?._id}`} className="bt edit">
                                                Edit <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                        </td>
                                    )}
                                    {canDelete && (
                                        <td>
                                            <button
                                                onClick={() => handleDelete(banner?._id)}
                                                className="bt delete"
                                            >
                                                Delete <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No banners found</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </section>
        </>
    );
};

export default AllSBanner;
