import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from "recoil";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ToastContainer/>
        <App />
      </RecoilRoot>
    </QueryClientProvider>
  </React.StrictMode>
);
