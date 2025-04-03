import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { appStore } from "./store/store.ts";
import { ToastBar, Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={appStore}>
      <Toaster position="top-center" />
      <App />
    </Provider>
  </StrictMode>
);
