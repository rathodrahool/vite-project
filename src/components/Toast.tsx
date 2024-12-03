// src/components/Toast.tsx
import React from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg fixed bottom-4 right-4 transition-opacity duration-300`}
    >
      {message}
    </div>
  );
};

export default Toast;
