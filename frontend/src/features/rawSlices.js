import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RawService from "../service/RawService";

const initialState = {
  loading: false,
  rawProducts: [],
  error: "",
};

export const fetchRawProduct = createAsyncThunk(
  "RawProducts/fetchRawProducts",
  async () => {
    const response = await RawService.getAll();
    return response.data;
  }
);

const RawProductsSlice = createSlice({
  name: "RawProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRawProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.rawProducts = action.payload;
        state.error = "";
      })
      .addCase(fetchRawProduct.rejected, (state, action) => {
        state.loading = false;
        state.rawProducts = [];
        state.error = action.error.message;
      });
  },
});

export default RawProductsSlice.reducer;
