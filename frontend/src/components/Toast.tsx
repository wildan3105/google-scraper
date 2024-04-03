import React from "react";
import "../styles/Toast.scss";

interface ToastProps {
  message: string;
  onClick: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClick }) => {
  return (
    <div className="toast-container" onClick={onClick}>
      <div className="toast-content">{message}</div>
    </div>
  );
};

export default Toast;
