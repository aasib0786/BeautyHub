import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import categoryReducer from "./slice/categorySllice";
import subCategorySlice from "./slice/subCategorySlice";
import productSlice from "./slice/productSlice";
import cartSlice from "./slice/cartSlice";
import wishlistSlice from "./slice/wislistSlice";

export const store= configureStore({
    reducer: {
       auth:authReducer,
       category:categoryReducer,
       subCategory:subCategorySlice,
       product:productSlice,
       cart:cartSlice,
       wishlist: wishlistSlice,
    },
});