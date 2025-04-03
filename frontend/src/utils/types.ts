import { ReactNode } from "react";

export type Children = {
  children: ReactNode;
};

export interface AuthSlice {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}
export interface User {
  id: string;
  name: string;
  email: string;
  otp_enabled: boolean;
  otp_verified: boolean;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse extends GenericResponse {
  user: User;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface Verify2FaRequest {
  otp: string;
  userId: string;
}
export interface Verify2FaResponse extends GenericResponse {
  user: User;
}

export interface EnableOtpResponse extends GenericResponse {
  otp_secret: string;
  token: string;
  otpAuthUrl: string;
  qrCode: string;
}
