import { RouterProvider } from "react-router-dom";
import router from "./utils/router";
import { useCheckAuthStateMutation } from "./utils/api";
import { useEffect } from "react";
import { customUseSelector } from "./store/store";

function App() {
  const [checkAuth] = useCheckAuthStateMutation();
  const { isLoading } = customUseSelector((state) => state.auth);
  useEffect(() => {
    checkAuth();
  }, []);
  if (isLoading) {
    return <>Loading</>;
  }
  return <RouterProvider router={router} />;
}

export default App;
