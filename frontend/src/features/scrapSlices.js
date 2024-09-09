import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScrapsService from "../service/ScrapsService";

const initialState = {
  loading: false,
  Scraps: [],
  error: "",
};

export const fetchScraps = createAsyncThunk("Scraps/fetchScraps", async () => {
  const response = await ScrapsService.getAll();
  return response.data;
});

const ScrapsSlice = createSlice({
  name: "Scraps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScraps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchScraps.fulfilled, (state, action) => {
        state.loading = false;
        state.Scraps = action.payload;
        state.error = "";
        console.log(action.payload);
      })
      .addCase(fetchScraps.rejected, (state, action) => {
        state.loading = false;
        state.Scraps = [];
        state.error = action.error.message;
      });
  },
});

export default ScrapsSlice.reducer;
