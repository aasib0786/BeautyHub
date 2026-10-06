import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../Header/Header";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import AllProduct from "../../Pages/Products/AllProduct";
import AddProduct from "../../Pages/Products/AddProduct";
import AllOrder from "../../Pages/Orders/AllOrder";
import EditOrder from "../../Pages/Orders/EditOrder";
import AllUsers from "../../Pages/Users/AllUsers";
import AllBanner from "../../Pages/Banner/AllBanner";
import AddBanner from "../../Pages/Banner/AddBanner";
import EditBanner from "../../Pages/Banner/EditBanner";
import EditProduct from "../../Pages/Products/EditProduct";
import Login from "../auth/Login";
import AllDieses from "../../Pages/Category/AllDieses";
import AddCategory from "../../Pages/Category/AddCategory";
import EditCategory from "../../Pages/Category/EditCategory";
import AllMainCategory from "../../Pages/MainCategory/AllMainCategory";
import AddMainCategory from "../../Pages/MainCategory/AddMainCategory";
import EditMainCategory from "../../Pages/MainCategory/EditMainCategory";
import AllBrand from "../../Pages/Brand/AllBrand";
import AddBrand from "../../Pages/Brand/AddBrand";
import EditBrand from "../../Pages/Brand/EditBrand";
import AddCoupen from "../../Pages/Coupon/AddCoupon";
import AllCoupen from "../../Pages/Coupon/AllCoupon";
import EditCoupen from "../../Pages/Coupon/EditCoupon";
import AllReviews from "../../Pages/Reviews/AllReviews";
import AllCart from "../../Pages/Cart/AllCart";
import ResetPassword from "../auth/ResetPassword";
import AllVideios from "../../Pages/VideoUrl/AllVideios";
import AddVideos from "../../Pages/VideoUrl/AddVideios";
import EditVideios from "../../Pages/VideoUrl/EditVideios";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import AllInquiries from "../../Pages/Inquiry/Inquiry";
import EditSubCategory from "../../Pages/SubCategory/EditSubCategory";
import AddSubCategory from "../../Pages/SubCategory/AddSubCategory";
import AllSubCategory from "../../Pages/SubCategory/AllSubCategory";
import AllFranchise from "../../Pages/Franchise/Franchise";
import AllEmailInquiry from "../../Pages/EmailInquiry/AllEmailInquiry";
import AllSizes from "../../Pages/Size/AllSizes";
import AddSizes from "../../Pages/Size/AddSizes";
import EditSizes from "../../Pages/Size/EditSizes";
import AllProductInquary from "../../Pages/ProductInquary/ProductInquary";
import SystemSettings from "../../Pages/SystemSettings/SystemSettings";
import AdminManagement from "../../Pages/AdminManagement/AdminManagement";
import UserRoleManagement from "../../Pages/UserRoleManagement/UserRoleManagement";
import AllVendors from "../../Pages/Vendors/AllVendors";
import VendorRegister from "../../Pages/Vendors/VendorRegister";

const Home = () => {


  const [login, setLogin] = useState(false);

  const verifyAdmin = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/auth/admin/verify-admin"
      );
      if (response.status === 200) {
        setLogin(true);
        if (response?.data?.user) {
          sessionStorage.setItem("adminUser", JSON.stringify(response.data.user));
        }
        if (response?.data?.roleDetails) {
          sessionStorage.setItem("adminRoleDetails", JSON.stringify(response.data.roleDetails));
        }
      }
    } catch (error) {

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setLogin(false);
        localStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminToken");
      } else {
        setLogin(false);
        console.log("error", error);
        toast.error(error?.response?.data?.message || "Login failed");
      }
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);
  return (
    <>
      {login ? (
        <>
          <Header />
          <div className="rightside">
            <Routes>
              <Route path={"/"} element={<Dashboard />} />
              {/* Color */}
              {/* <Route path={"/all-color"} element={<AllColor />} />
              <Route path={"/add-color"} element={<AddColor />} />
              <Route path={"/edit-color/:id"} element={<EditColor />} /> */}
              {/* certificate */}
              {/* <Route path={"/all-certificate"} element={<AllCertificate />} />
              <Route path={"/add-certificate"} element={<AddCertificate />} />
              <Route
                path={"/edit-certificate/:id"}
                element={<EditCertificate />}
              /> */}
              {/* Flover */}
              {/* <Route path={"/all-flower"} element={<AllFlavour />} />
              <Route path={"/add-flover"} element={<AddFlavour />} />
              <Route path={"/edit-flover/:id"} element={<EditFlavour />} /> */}
              {/* Product --  */}
              <Route path={"/all-products"} element={<AllProduct />} />
              <Route path={"/add-product"} element={<AddProduct />} />
              <Route path={"/edit-product/:id"} element={<EditProduct />} />
              {/* Category --  */}
              <Route path={"/all-main-category"} element={<AllMainCategory />} />
              <Route path={"/add-main-category"} element={<AddMainCategory />} />
              <Route path={"/edit-main-category/:id"} element={<EditMainCategory />} />
              <Route path={"/all-category"} element={<AllDieses />} />
              <Route path={"/add-category"} element={<AddCategory />} />
              <Route path={"/edit-category/:id"} element={<EditCategory />} />
              <Route path={"/all-subCategory"} element={<AllSubCategory />} />
              <Route path={"/add-subCategory"} element={<AddSubCategory />} />
              <Route path={"/edit-subCategory/:id"} element={<EditSubCategory />} />
              {/* Brand -- */}
              <Route path={"/all-brands"} element={<AllBrand />} />
              <Route path={"/add-brand"} element={<AddBrand />} />
              <Route path={"/edit-brand/:id"} element={<EditBrand />} />
              {/* --- Orders --- */}
              <Route path={"/all-users"} element={<AllUsers />} />
              {/* --- Vouchers --- */}
              {/* <Route path={"/all-voucher"} element={<AllVoucher />} />{" "} */}
              {/* // All Vouchers */}
              {/* <Route path={"/add-voucher"} element={<CreateVoucher />} /> */}
              {/* --- Banners --- */}
              <Route path={"/all-banners"} element={<AllBanner />} />
              <Route path={"/add-banner"} element={<AddBanner />} />
              <Route path={"/edit-banner/:id"} element={<EditBanner />} />
              {/* --- Orders --- */}
              <Route path={"/all-orders"} element={<AllOrder />} />
              <Route path={"/order-details/:id"} element={<EditOrder />} />
              <Route path={"/all-coupon"} element={<AllCoupen />} />
              <Route path={"/edit-coupon/:id"} element={<EditCoupen />} />
              <Route path={"/add-coupon"} element={<AddCoupen />} />
              {/* all-Reviews */}
              <Route path={"/all-reviews"} element={<AllReviews />} />
              <Route path={"all-reviews"} element={<AllReviews />} />
              <Route path={"All-carts"} element={<AllCart />} />
              {/* <Route path={"all-wishlist"} element={<AllWishList />} /> */}
              {/* <Route path={"all-rewardPoint"} element={<AllRewardPoint />} /> */}
              {/* <Route path={"View-Details"} element={<ViewDetails />} /> */}
              {/* all-HomePage-Videos-Url */}
              <Route path={"/add-videos"} element={<AddVideos />} />
              <Route path={"/all-videos"} element={<AllVideios />} />
              <Route path={"edit-videos/:id"} element={<EditVideios />} />
              <Route path={"/all-inquiries"} element={<AllInquiries />} />
              <Route path={"/all-product-inquary"} element={<AllProductInquary />} />

              <Route path={"/all-become-franchise"} element={<AllFranchise />} />
              <Route path={"/all-email-inquiries"} element={<AllEmailInquiry />} />

              <Route path={"/all-sizes"} element={<AllSizes />} />
              <Route path={"/add-sizes"} element={<AddSizes />} />
              <Route path={"/edit-sizes/:id"} element={<EditSizes />} />
              <Route path={"/system-settings"} element={<SystemSettings />} />
              <Route path={"/super-admin-management"} element={<AdminManagement />} />
              <Route path={"/admin-staff-roles"} element={<UserRoleManagement />} />
              <Route path={"/all-vendors"} element={<AllVendors />} />
              <Route path={"/vendor-register"} element={<VendorRegister />} />
            </Routes>



          </div>
        </>
      ) : (
        <Routes>
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/*" element={<Login />} />
          <Route
            path="/admin/reset-password/:token"
            element={<ResetPassword />}
          />
        </Routes>
      )}
    </>
  );
};

export default Home;
