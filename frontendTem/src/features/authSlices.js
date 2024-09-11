import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authServices from "../service/authService";

export const signup = createAsyncThunk("auth/signup", async (userData) => {
  try {
    const response = await authServices.signup(userData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    token: "",
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        console.log("Login fulfilled payload:", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = {};
        state.token = "";
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "logout failed";
        console.error("logout rejected : ", action.payload);
      });
  },
});

export default AuthSlice.reducer;
