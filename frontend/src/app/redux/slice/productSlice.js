import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async () => {
        const response = await axiosInstance.get("/api/v1/product/get-all-products");
        return response?.data?.data;
    })
export const fetchFeaturedProducts = createAsyncThunk(
    "product/featured-products",
    async () => {
        const response = await axiosInstance.get("/api/v1/product/featured-products");
        return response?.data?.data;
    })

export const fetchMaterials = createAsyncThunk(
    "product/fetchMaterials",
    async () => {
        const response = await axiosInstance.get("/api/v1/product/get-all-materials");
        return response?.data?.data;
    }
)
const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        featuredProducts: [],
        materials: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetProductState: (state) => {
            state.products = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(fetchFeaturedProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.featuredProducts = action.payload;
        });
        builder.addCase(fetchFeaturedProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(fetchMaterials.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchMaterials.fulfilled, (state, action) => {
            state.loading = false;
            state.materials = action.payload;
        });
        builder.addCase(fetchMaterials.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
})

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;