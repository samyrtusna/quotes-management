import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FamillyService from "../service/FamillyService";

const initialState = {
  loading: false,
  ProductsFamilly: [],
  error: "",
};

export const fetchProductFamilly = createAsyncThunk(
  "ProductsFamilly/fetchProductsFamilly",
  async () => {
    const response = await FamillyService.getAll();
    return response.data;
  }
);

const ProductsFamillySlice = createSlice({
  name: "ProductsFamilly",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductFamilly.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductFamilly.fulfilled, (state, action) => {
        state.loading = false;
        state.ProductsFamilly = action.payload;
        state.error = "";
        console.log(action.payload);
      })
      .addCase(fetchProductFamilly.rejected, (state, action) => {
        state.loading = false;
        state.ProductsFamilly = [];
        state.error = action.error.message;
      });
  },
});

export default ProductsFamillySlice.reducer;
