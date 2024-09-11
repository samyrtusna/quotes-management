import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Products: [],
};

const ProductsSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.Products = action.payload;
    },
  },
});
export const { setProducts } = ProductsSlice.actions;
export default ProductsSlice.reducer;
