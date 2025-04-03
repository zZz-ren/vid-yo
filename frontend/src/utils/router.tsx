import { createBrowserRouter } from "react-router-dom";
import {
  ProtectedRoute,
  RedirectAuthenticatedUser,
} from "../components/RouterComponents";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../components/Dashboard";
import EnableOtpPage from "../pages/EnableOtpPage";
import RegisterPage from "../pages/RegisterPage";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/enable-otp", element: <EnableOtpPage /> },
    ],
  },
  {
    element: <RedirectAuthenticatedUser />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
]);

export default router;
