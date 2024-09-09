import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ProductService from "../service/ProductService";

const initialState = {
  loading: false,
  Products: [],
  error: "",
};

export const fetchProduct = createAsyncThunk(
  "Products/fetchProducts",
  async () => {
    const response = await ProductService.getAll();
    return response.data;
  }
);

const ProductsSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.Products = action.payload;
        state.error = "";
        console.log(action.payload);
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.Products = [];
        state.error = action.error.message;
      });
  },
});

export default ProductsSlice.reducer;
