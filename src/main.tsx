import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function resolveStrictMode(): boolean {
  const raw = import.meta.env.VITE_ENABLE_STRICT_MODE;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return import.meta.env.DEV;
}

const tree = resolveStrictMode() ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
);

ReactDOM.createRoot(document.getElementById("root")!).render(tree);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/assets/sw.js").catch((err) => {
      // eslint-disable-next-line no-console
      console.warn("[SW] registration failed:", err);
    });
  });
}
