import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productDetails: [],
};

const ProductDetailsSlice = createSlice({
  name: "ProductDetails",
  initialState,
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
  },
});
export const { setProductDetails } = ProductDetailsSlice.actions;
export default ProductDetailsSlice.reducer;
