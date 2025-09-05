import React from "react"; // 👈 add this back

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "flowbite"; // or "daisyui" depending on which you use

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
