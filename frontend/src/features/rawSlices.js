import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rawProducts: [],
};

const RawProductsSlice = createSlice({
  name: "RawProducts",
  initialState,
  reducers: {
    setRawProducts: (state, action) => {
      state.rawProducts = action.payload;
      state.error = "";
    },
  },
});

export const { setRawProducts } = RawProductsSlice.actions;
export default RawProductsSlice.reducer;
