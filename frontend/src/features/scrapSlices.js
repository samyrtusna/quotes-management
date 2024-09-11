import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Scraps: [],
};

const ScrapsSlice = createSlice({
  name: "Scraps",
  initialState,
  reducers: {
    setScraps: (state, action) => {
      state.Scraps = action.payload;
    },
  },
});
export const { setScraps } = ScrapsSlice.actions;
export default ScrapsSlice.reducer;
