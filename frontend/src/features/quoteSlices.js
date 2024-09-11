import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quotes: [],
};

const QuotesSlices = createSlice({
  name: "Quotes",
  initialState,
  reducers: {
    setQuotes: (state, action) => {
      state.quotes = action.payload;
    },
  },
});
export const { setQuotes } = QuotesSlices.actions;
export default QuotesSlices.reducer;
