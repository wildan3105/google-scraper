import React from "react";
import { useNavigate } from "react-router-dom";
import { itemNames } from "../configs/local-storage";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(itemNames.accessToken);
    localStorage.removeItem(itemNames.userEmail);
    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
