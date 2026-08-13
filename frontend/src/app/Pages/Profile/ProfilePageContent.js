"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import "./profile.css";
import pic1 from "@/app/Components/assets/icon1.jpg";
import pic2 from "@/app/Components/assets/icon2.webp";
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaCog } from "react-icons/fa";
import toast from "react-hot-toast";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthState, verifyUser } from "@/app/redux/slice/authSlice";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { NoItem } from "@/app/utils/NoItem";
import { resetCartState } from "@/app/redux/slice/cartSlice";
import { resetWishlistState } from "@/app/redux/slice/wislistSlice";
import MyOrder from "@/app/Components/ProfileComponent/MyOrder";

export default function ProfilePageContent() {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState("/User.jpg");
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const dispatch=useDispatch()
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setAvatar(imageURL);
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axiosInstance.put(
        "/api/v1/auth/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("profile Updated successfully");
    } catch (error) {
      console.log("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
  };
  const searchParams = useSearchParams();
  const order = searchParams.get("order");

  useEffect(() => {
    if (order == "true") {
      setActiveTab("orders");
    }
  }, [order]);

  const handleLogout = async () => {
    try {
   const response =   await axiosInstance.get("/api/v1/auth/logout");
   if(response.status===200){
      dispatch(resetAuthState());
      dispatch(resetCartState());
      dispatch(resetWishlistState());
      toast.success("Logged out successfully");
   }
      router.push("/");
    } catch (error) {
      console.log("Error logging out:", error);
      toast.error( error?.response?.data?.message || "Failed to log out. Please try again.");
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/order/get-order");
      if (response.status === 200) {
        setOrders(response?.data?.order);
      }
    } catch (error) {
      console.log("Error fetching order details:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch order details."
      );
    }
  };

  const fetchProfileDetails = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/auth/get-single-user");
      const data = response?.data?.user;
      setAddress(data?.address);
      setPincode(data?.pincode);
      setCity(data?.city);
      setPhone(data?.phone);
      setName(data?.name);
      setEmail(data?.email);
      setAvatar(data?.profileImage)
    } catch (error) {
      console.log("Error fetching profile details:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch profile details."
      );
      
    }
  };

  useEffect(() => {
    fetchProfileDetails();
    fetchOrderDetails();
  }, []);

  const dataSubmit = (e) => {
    e.preventDefault();
  };
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo email={email} phone={phone} />;
      case "orders":
        return <Orders />;
      case "address":
        return (
          <Address
            address={address}
            phone={phone}
            pincode={pincode}
            city={city}
            name={name}
          />
        );
      // case "settings":
      //   return <Settings />;
      default:
        return null;
    }
  };
  return (
    <>
      <Head>
        <title>Admin Profile UI</title>
      </Head>
      <div className="container-fluid profile-layout">
        {/* Mobile Top Navigation */}
        <div className="row">
          <div className="mobile-top-nav top-0 z-3">
            <div
              className={`inner-top-bar ${
                activeTab === "profile"
                  ? "btn-light text-dark"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser />
              Profile
            </div>
            <div
              className={`inner-top-bar ${
                activeTab === "orders"
                  ? "btn-light text-dark"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <FaShoppingBag />
              Orders
            </div>
            <div
              className={`inner-top-bar ${
                activeTab === "address"
                  ? "btn-light text-dark"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveTab("address")}
            >
              <FaMapMarkerAlt />
              Address
            </div>
            {/* <div className={`inner-top-bar ${activeTab === "settings" ? "btn-light text-dark" : "btn-outline-light"}`} onClick={() => setActiveTab("settings")}>
              <FaCog />
              Settings
            </div> */}
          </div>
          {/* Sidebar */}
          <div className="col-md-3 sidebar">
            <div>
              <div className="text-center mb-4">
                <div className="profile-avatar-container">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    width={90}
                    height={90}
                    className="rounded-circle profile-avatar mb-2"
                  />
                  <div className="change-icon" onClick={triggerFileInput}>
                    +
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
                <h6 className="mb-0">{name ?? "Name not found"}</h6>
                <small>{email ?? "Email not found"}</small>
                <br />
                <small>{phone ?? "Phone not found"}</small>
              </div>
              <ul className="nav flex-column mt-4">
                <li
                  className="nav-item"
                  onClick={() => setActiveTab("profile")}
                >
                  <a
                    className={`nav-link ${
                      activeTab === "profile" ? "active" : ""
                    }`}
                  >
                    <FaUser /> Profile Info
                  </a>
                </li>
                <li className="nav-item" onClick={() => setActiveTab("orders")}>
                  <a
                    className={`nav-link ${
                      activeTab === "orders" ? "active" : ""
                    }`}
                  >
                    <FaShoppingBag /> Orders
                  </a>
                </li>
                <li
                  className="nav-item"
                  onClick={() => setActiveTab("address")}
                >
                  <a
                    className={`nav-link ${
                      activeTab === "address" ? "active" : ""
                    }`}
                  >
                    <FaCog /> Settings
                  </a>
                </li>
                {/* <li className="nav-item" onClick={() => setActiveTab("settings")}>
                  <a className={`nav-link ${activeTab === "settings" ? "active" : ""}`}>
                    <FaCog /> Settings
                  </a>
                </li> */}
              </ul>
            </div>
            <div className="text-center">
              <button
                className=" btn-theme-bg  w-100 mt-4"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 p-4">
            <div className="content-area">{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
// Profile Info Component
const ProfileInfo = ({ email, phone }) => (
  <div className="container">
    <div className="profile-profile-info">
      <h4 className="text-center text-secondary">Profile Info</h4>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>Email: </strong>
          <span className="text-success">{email ?? "Email not found"}</span>
        </li>
        <li className="list-group-item">
          <strong>Phone: </strong>
          <span className="text-warning">{phone ?? "Phone not found"}</span>
        </li>
      </ul>
    </div>
  </div>
);
// Orders Component
const Orders = () => <MyOrder />;
const Address = ({ name, phone, address, pincode, city }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
  });
  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        "/api/v1/auth/update-profile",
        formData
      );
      toast.success("Address saved successfully");
      setEditMode(false);
    } catch (error) {
      console.log("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
  };

  useEffect(() => {
    setFormData({
      name: name,
      phone: phone,
      address: address,
      pincode: pincode,
      city: city,
    });
  }, []);
  return (
    <div className="container">
      <div className="card shadow p-4 mb-5">
        <h4 className="mb-4 text-secondary">Address Details</h4>

        {!editMode ? (
          <>
            <div className="table-responsive mb-4">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Pin Code</th>
                    <th>City</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{formData.name || "-"}</th>
                    <th>{formData.phone || "-"}</th>
                    <th>{formData.address || "-"}</th>
                    <th>{formData.pincode || "-"}</th>
                    <th>{formData.city || "-"}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-end">
              <button className="btn btn-danger" onClick={handleEdit}>
                Edit Address
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="City Name"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-3 text-end">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
