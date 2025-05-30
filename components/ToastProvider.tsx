"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          style: {
            background: "#22c55e",
          },
        },
        error: {
          style: {
            background: "#ef4444",
          },
          duration: 4000,
        },
      }}
    />
  );
}
