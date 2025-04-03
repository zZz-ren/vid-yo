import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  EnableOtpResponse,
  GenericResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Verify2FaRequest,
  Verify2FaResponse,
} from "./types";

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8001/api/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<GenericResponse, void>({
      query: (data) => ({
        url: "/auth/logout",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<GenericResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<GenericResponse, Verify2FaRequest>({
      query: (data) => ({
        url: "/auth/verify",
        method: "POST",
        body: data,
      }),
    }),
    validateOtp: builder.mutation<Verify2FaResponse, Verify2FaRequest>({
      query: (data) => ({
        url: "/auth/validate",
        method: "POST",
        body: data,
      }),
    }),
    enableOtp: builder.mutation<EnableOtpResponse, { user_id: string }>({
      query: (data) => ({
        url: "/auth/enable2Fa",
        method: "POST",
        body: data,
      }),
    }),
    checkAuthState: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/auth/status",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCheckAuthStateMutation,
  useEnableOtpMutation,
  useLoginMutation,
  useRegisterMutation,
  useValidateOtpMutation,
  useVerifyOtpMutation,
  useLogoutMutation
} = api;

export default api;
