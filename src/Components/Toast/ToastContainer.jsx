import React from "react";
import { useToast } from "../Toast/Toast";

const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`text-white p-4 rounded-lg shadow-lg transition-all duration-500 transform
            ${toast.open ? "scale-100 opacity-100 translate-x-0" : "scale-95 opacity-0 translate-x-4"}
            ${toast.variant === "destructive" ? "bg-red-500" : "bg-green-500"}
          `}
          onAnimationEnd={() => {
            if (!toast.open) dismiss(toast.id);
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <strong>{toast.title}</strong>
              <p className="text-sm">{toast.description}</p>
            </div>
            <button
              className="absolute top-3 right-3 text-white text-xs opacity-70 hover:opacity-100"
              onClick={() => dismiss(toast.id)}
            >
              ✖
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
