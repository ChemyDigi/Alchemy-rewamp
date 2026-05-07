"use client";

import { Toaster } from "react-hot-toast";

export default function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1a1a2e",
          color: "#e2e8f0",
          border: "1px solid #2d3748",
          borderRadius: "8px",
          fontSize: "14px",
        },
        success: { iconTheme: { primary: "#e3791d", secondary: "#1a1a2e" } },
        error: { iconTheme: { primary: "#fc8181", secondary: "#1a1a2e" } },
      }}
    />
  );
}
