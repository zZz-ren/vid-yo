import { configureStore } from "@reduxjs/toolkit";
import AuthReducers from "./slices/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
export const appStore = configureStore({
  reducer: {
    auth: AuthReducers,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export const useDispatcher = useDispatch.withTypes<AppDispatch>();

export const customUseSelector = useSelector.withTypes<RootState>();
