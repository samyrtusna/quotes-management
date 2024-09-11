import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  token: "",
};

const AuthSlice = createSlice({
  name: "auths",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state, action) => {
      state.user = "";
      state.token = "";
    },
  },
});
export const { setLogin, setLogout } = AuthSlice.actions;
export default AuthSlice.reducer;
