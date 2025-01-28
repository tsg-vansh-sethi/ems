import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter keeps track of different routes and links we have in our website */}
    <App />
  </StrictMode>
);
