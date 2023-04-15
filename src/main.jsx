import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AccountProvider } from "./context/AccountContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </React.StrictMode>
);
