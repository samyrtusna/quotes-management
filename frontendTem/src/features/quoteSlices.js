import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import QuoteService from "../service/QuoteService";

const initialState = {
  loading: false,
  quotes: [],
  error: "",
};

export const FetchQuotes = createAsyncThunk(
  "quotes/fetchQuotes",
  async (rejectWithValue) => {
    try {
      const response = await QuoteService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const FetchSingleQuote = createAsyncThunk(
  "quotes/fetchsingleQuote",
  async (id, rejectWithValue) => {
    try {
      const response = await QuoteService.detail(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const QuotesSlices = createSlice({
  name: "Quotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchQuotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload;
        console.log("Quotes : ", action.payload);
        state.error = "";
      })
      .addCase(FetchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.quotes = [];
        state.error = action.error.message;
      })
      .addCase(FetchSingleQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchSingleQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload;
        console.log("Quote Details : ", action.payload);
        state.error = "";
      })
      .addCase(FetchSingleQuote.rejected, (state, action) => {
        state.loading = false;
        state.quotes = [];
        state.error = action.error.message;
      });
  },
});

export default QuotesSlices.reducer;
