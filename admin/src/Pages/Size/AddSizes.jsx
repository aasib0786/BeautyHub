import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import StraightenIcon from "@mui/icons-material/Straighten";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices.js";
import "./size.css";

const AddSizes = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        size: [
            {
                hight: "",
                mattressDimension: [{ dimension: "" }],
            },
        ],
        isFeatured: false,
    });

    /* ---------------- BASIC ---------------- */

    const handleNameChange = (e) => {
        setFormData({ ...formData, name: e.target.value });
    };

    /* ---------------- SIZE HANDLERS ---------------- */

    const handleHeightChange = (index, value) => {
        const updatedSizes = [...formData.size];
        updatedSizes[index].hight = value;
        setFormData({ ...formData, size: updatedSizes });
    };

    const addSize = () => {
        setFormData({
            ...formData,
            size: [
                ...formData.size,
                { hight: "", mattressDimension: [{ dimension: "" }] },
            ],
        });
    };

    const removeSize = (index) => {
        if (formData.size.length === 1) return;
        const updatedSizes = formData.size.filter((_, i) => i !== index);
        setFormData({ ...formData, size: updatedSizes });
    };

    /* ---------------- DIMENSION HANDLERS ---------------- */

    const handleDimensionChange = (sizeIndex, dimIndex, value) => {
        const updatedSizes = [...formData.size];
        updatedSizes[sizeIndex].mattressDimension[dimIndex].dimension = value;
        setFormData({ ...formData, size: updatedSizes });
    };

    const addDimension = (sizeIndex) => {
        const updatedSizes = [...formData.size];
        updatedSizes[sizeIndex].mattressDimension.push({ dimension: "" });
        setFormData({ ...formData, size: updatedSizes });
    };

    const removeDimension = (sizeIndex, dimIndex) => {
        const updatedSizes = [...formData.size];
        if (updatedSizes[sizeIndex].mattressDimension.length === 1) return;
        updatedSizes[sizeIndex].mattressDimension.splice(dimIndex, 1);
        setFormData({ ...formData, size: updatedSizes });
    };

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axiosInstance.post(
                "/api/v1/size/create-size",
                formData
            );

            if (res.status === 201) {
                toast.success("Size added successfully");
                navigate("/all-sizes");
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to add size"
            );
        } finally {
            setIsLoading(false);
        }
    };
console.log("XXXXXX::=>" , formData);
    /* ---------------- UI ---------------- */

    return (
        <>
            <ToastContainer />

            <div className="bread">
                <div className="head">
                    <h4>Add Size</h4>
                </div>
                <div className="links">
                    <Link to="/all-sizes" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3 mt-2" onSubmit={handleSubmit}>
                    {/* NAME */}
                    <h3 className="section-title">
                        <StraightenIcon /> Basic Info
                    </h3>

                    <div className="col-md-4">
                        <label className="form-label">Size Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                        />
                    </div>

                    {/* SIZES */}
                    {formData.size.map((sizeItem, sizeIndex) => (
                        <div key={sizeIndex} className="border p-3 mt-4">
                            <h3 className="section-title">
                                <StraightenIcon /> Size {sizeIndex + 1}
                            </h3>

                            <div className="col-md-3">
                                <label className="form-label">Height *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={sizeItem.hight}
                                    onChange={(e) =>
                                        handleHeightChange(sizeIndex, e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* DIMENSIONS */}
                            <h3 className="section-title mt-3">
                                <AttachMoneyIcon /> Mattress Dimensions
                            </h3>
                            <div className="row">
                                {sizeItem?.mattressDimension?.map((dim, dimIndex) => (

                                    <div className="col-md-3 mb-2 d-flex"style={{gap:4}} key={dimIndex}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder='71" X 30"'
                                            value={dim.dimension}
                                            onChange={(e) =>
                                                handleDimensionChange(
                                                    sizeIndex,
                                                    dimIndex,
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-danger "
                                            style={{margin:'12'}}
                                            onClick={() =>
                                                removeDimension(sizeIndex, dimIndex)
                                            }
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="btn btn-secondary mt-2"
                                onClick={() => addDimension(sizeIndex)}
                            >
                                <AddIcon /> Add Dimension
                            </button>

                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeSize(sizeIndex)}
                                >
                                    <DeleteIcon /> Remove Size
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-primary mt-4"
                        style={{width:'25%'}}
                        onClick={addSize}
                    >
                        <AddIcon /> Add Size
                    </button>

                    {/* SETTINGS */}
                    <h3 className="section-title mt-4">
                        <SettingsIcon /> Settings
                    </h3>

                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isFeatured: e.target.checked,
                                    })
                                }
                            />
                            <label className="form-check-label">
                                Featured Size
                            </label>
                        </div>
                    </div>

                    <div className="col-12 mt-4 text-center">
                        <button
                            type="submit"
                            className="btn"
                            disabled={isLoading}
                        >
                            {isLoading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddSizes;
