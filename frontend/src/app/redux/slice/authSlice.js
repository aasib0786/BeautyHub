import { axiosInstance } from "@/app/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const registerUser=createAsyncThunk("auth/sign-up",async(userData,thunkAPI)=>{
    try {
    const response= await axiosInstance.post("/api/v1/auth/sign-up",userData)
        return response.data.message
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const loginUser=createAsyncThunk("auth/sign-in",async(userData,thunkAPI)=>{
    try {
        const response= await axiosInstance.post("/api/v1/auth/sign-in",userData)
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

export const verifyUser=createAsyncThunk("auth/verify-user",async(thunkAPI)=>{
    try {
        const response= await axiosInstance.get("/api/v1/auth/verify-user")
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
})

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        loggedIn:false,
        loading:false,
        error:null,
    },
    reducers:{
        resetAuthState:(state)=>{
            state.user=null;
            state.loading=false;
            state.error=null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(registerUser.fulfilled,(state,action)=>{
            state.loading=false
            state.user=action.payload
        })
        builder.addCase(registerUser.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
        builder.addCase(loginUser.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(loginUser.fulfilled,(state,action)=>{
            state.loading=false
            state.user=action.payload?.user
        })
        builder.addCase(loginUser.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
        builder.addCase(verifyUser.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(verifyUser.fulfilled,(state,action)=>{
            state.loading=false
            state.user=action.payload?.user
        })
        builder.addCase(verifyUser.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
     
    }
})

export const {resetAuthState}=authSlice.actions
export default authSlice.reducer