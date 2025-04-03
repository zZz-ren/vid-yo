import { Navigate, Outlet } from "react-router-dom";
import { customUseSelector } from "../store/store";

// authentication Logic

export const ProtectedRoute = () => {
  const { isAuthenticated } = customUseSelector((state) => state.auth);
  return <>{isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />}</>;
};

export const RedirectAuthenticatedUser = () => {
  const { isAuthenticated } = customUseSelector((state) => state.auth);

  return <>{!isAuthenticated ? <Outlet /> : <Navigate to={"/"} />}</>;
};
