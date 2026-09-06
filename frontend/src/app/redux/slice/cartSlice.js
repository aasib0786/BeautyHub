import { axiosInstance } from "@/app/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const safeJSONParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const fetchCartItems = createAsyncThunk(
  "cart/getCartItem",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/api/v1/cart/get-cart");
      return res?.data?.cart?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantityToServer",
  async (payload, thunkAPI) => {
    try {
      const { productId, action } = payload;
      const res = await axiosInstance.put("/api/v1/cart/update-cart-quantity", {
        productId,
        action,
      });
      return res?.data?.cart?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const AddToCartToServer = createAsyncThunk(
  "cart/addToCartToServer",
  async (items, thunkAPI) => {
    try {
      const payload = Array.isArray(items) ? items : [items];
      const res = await axiosInstance.post("/api/v1/cart/add-to-cart", {
        items: payload,
      });
      return res?.data?.cart?.items || res?.data?.updatedCart?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addToCartToServer = AddToCartToServer;

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    resetCartState(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    addToCart(state, action) {
      const {
        productId,
        quantity = 1,
        image,
        price,
        name,
        finalPrice,
        discount,
      } = action.payload;

      const pIdStr = typeof productId === "object" ? productId._id : productId;

      const existingItem = state.items?.find((item) => {
        const itemPId = typeof item.productId === "object" ? item.productId._id : item.productId;
        return itemPId === pIdStr;
      });

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        if (!state.items) state.items = [];
        state.items.push({
          productId,
          quantity,
          image,
          price,
          name,
          finalPrice,
          discount,
        });
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    removeFromCart(state, action) {
      const targetId = action.payload.productId;
      state.items = (state.items || []).filter((item) => {
        const id = item?.productId?._id || item?.productId;
        return String(id) !== String(targetId);
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clearCart(state) {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    },
    increaseQuantity(state, action) {
      const targetId = action.payload.productId;
      const item = state.items?.find((item) => {
        const id = item?.productId?._id || item?.productId;
        return String(id) !== String(targetId);
      });
      if (item) {
        item.quantity++;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    decreaseQuantity(state, action) {
      const targetId = action.payload.productId;
      const item = state.items?.find((item) => {
        const id = item?.productId?._id || item?.productId;
        return String(id) !== String(targetId);
      });
      if (item && item.quantity > 1) {
        item.quantity--;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    setCartFromLocalStorage(state, action) {
      state.items = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(AddToCartToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AddToCartToServer.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })
      .addCase(AddToCartToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const {
  resetCartState,
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setCartFromLocalStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
