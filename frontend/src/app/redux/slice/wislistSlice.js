import { axiosInstance } from "@/app/utils/axiosInstance";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const addToWishlistToServer = createAsyncThunk(
  "wishlist/add-to-wishlist",
  async (productId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/wishlist/add-to-wishlist",
        {productId}
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getWishlistFromServer = createAsyncThunk(
  "wishlist/get-wishlist",
  async (thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/wishlist/get-all-wishlists"
      );
      return response.data.wishlists;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeFromWishlistToServer = createAsyncThunk(
  "wishlist/remove-from-wishlist",
  async (_id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/v1/wishlist/delete-wishlist/${_id}`);

      return _id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetWishlistState: (state) => {
      state.wishlist = [];
      state.loading = false;
      state.error = null;
    },
    addToWishlist: (state, action) => {
      state.wishlist.products.push(action.payload);
    },
    addToWishlistToLocal: (state, action) => {
      const product = action.payload;
         if (!state.wishlist || !Array.isArray(state.wishlist.products)) {
        state.wishlist = { products: [] };
      }
      state.wishlist.products.push(product);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "wishlist",
          JSON.stringify(state.wishlist.products)
        );
      }
    },
    removeFromWishlistToLocal: (state, action) => {
      const productId = action.payload;

      if (!state.wishlist || !Array.isArray(state.wishlist.products)) {
        state.wishlist = { products: [] };
      }

      state.wishlist.products = state.wishlist.products.filter(
        (item) => item._id !== productId
      );

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "wishlist",
          JSON.stringify(state.wishlist.products)
        );
      }
    },
    loadWishlistFromLocalStorage: (state) => {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("wishlist");
        state.wishlist = {
          products: data ? JSON.parse(data) : [],
        };
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearWishlist: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlistToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistToServer.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist.push(action.payload);
      })
      .addCase(addToWishlistToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWishlistFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlistFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getWishlistFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlistToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistToServer.fulfilled, (state, action) => {
        state.loading = false;
        const data = state.wishlist?.products.filter(
          (item) => item._id !== action.payload
        );
        state.wishlist.products = data;
      })
      .addCase(removeFromWishlistToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetWishlistState,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  loadWishlistFromLocalStorage,
  addToWishlistToLocal,
  removeFromWishlistToLocal,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
