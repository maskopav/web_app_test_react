// src/main.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; //
import App from "./App.jsx";
import { AppProvider } from "./context/AppProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </StrictMode>
);