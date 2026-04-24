import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";
const container = document.getElementById("root");
// TypeScript null check for the container
if (!container) throw new Error("Root element not found");
const root = createRoot(container);
root.render(<App />);