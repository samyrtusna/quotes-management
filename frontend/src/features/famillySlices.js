import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ProductsFamilly: [],
};

const ProductsFamillySlice = createSlice({
  name: "ProductsFamilly",
  initialState,
  reducers: {
    setProductsFamilly: (state, action) => {
      state.ProductsFamilly = action.payload;
    },
  },
});
export const { setProductsFamilly } = ProductsFamillySlice.actions;
export default ProductsFamillySlice.reducer;
