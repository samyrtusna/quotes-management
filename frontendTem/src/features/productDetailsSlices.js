import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ProductDetailsService from "../service/ProductDetailsService";

const initialState = {
  loading: false,
  productDetails: [],
  error: null,
};

export const fetchProductDetails = createAsyncThunk(
  "ProductDetails/fetchProductDetails",
  async () => {
    const response = await ProductDetailsService.getAll();
    return response.data;
  }
);

const ProductDetailsSlice = createSlice({
  name: "ProductDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.productDetails = [];
        state.error = action.error.message;
      });
  },
});
export default ProductDetailsSlice.reducer;
