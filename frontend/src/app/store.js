import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../features/authSlices";
import ProductFamillyReducer from "../features/famillySlices";
import ProductReducer from "../features/productSlices";
import ProductDetailsReducer from "../features/productDetailsSlices";
import RawProductsReducer from "../features/rawSlices";
import QuotesReducer from "../features/quoteSlices";
import ScrapsReducer from "../features/scrapSlices";

const Store = configureStore({
  reducer: {
    Auth: AuthReducer,
    ProductsFamilly: ProductFamillyReducer,
    Products: ProductReducer,
    ProductDetails: ProductDetailsReducer,
    RawProducts: RawProductsReducer,
    Quotes: QuotesReducer,
    Scraps: ScrapsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
export default Store;
