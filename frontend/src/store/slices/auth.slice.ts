import { createSlice } from "@reduxjs/toolkit";
import { AuthSlice } from "../../utils/types";
import api from "../../utils/api";

const initialState: AuthSlice = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
      if (!action.payload.user.otp_enabled) {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    });
    builder.addMatcher(api.endpoints.logout.matchFulfilled, (state, action) => {
      if (action.payload.success) {
        state.user =null;
        state.isAuthenticated = false;
      }
      state.isLoading = false;
    });
    builder.addMatcher(
      api.endpoints.validateOtp.matchFulfilled,
      (state, action) => {
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      api.endpoints.checkAuthState.matchFulfilled,
      (state, action) => {
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      }
    );
    builder.addMatcher(api.endpoints.checkAuthState.matchRejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default authSlice.reducer;

export const {} = authSlice.actions;
