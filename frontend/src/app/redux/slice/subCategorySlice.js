import { axiosInstance } from "@/app/utils/axiosInstance";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const fetchSubCategories = createAsyncThunk(
    "subCategory/fetchSubCategories",
    async () => {
        const response = await axiosInstance.get("/api/v1/sub-category/get-all-sub-categories");
        return response?.data?.data;    
    })

const subCategorySlice=createSlice({
    name:"subCategory",
    initialState:{
        subCategories:[],
        loading:false,
        error:null,
    },
    reducers:{
        resetSubCategoryState:(state)=>{
            state.subCategories=[];
            state.loading=false;
            state.error=null;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchSubCategories.pending,(state)=>{
            state.loading=true;
        });
        builder.addCase(fetchSubCategories.fulfilled,(state,action)=>{
            state.loading=false;
            state.subCategories=action.payload;
        });
        builder.addCase(fetchSubCategories.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        });
    },
});

export const {resetSubCategoryState}=subCategorySlice.actions;
export default subCategorySlice.reducer;