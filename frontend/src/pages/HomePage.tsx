import React from "react";
import { useNavigate } from "react-router-dom";
import { itemNames } from "../configs/local-storage";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem(itemNames.userEmail);

  const handleLogout = () => {
    // Clear the access token cookie
    localStorage.removeItem(itemNames.accessToken);
    localStorage.removeItem(itemNames.userEmail);

    // Redirect to the landing page
    navigate("/");
  };

  return (
    <div className="home-container">
      <header className="profile-header">
        <h2>Profile</h2>
      </header>
      <div className="welcome-message">
        {userEmail && (
          <p>
            Welcome back, <strong> {userEmail} </strong> !
          </p>
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
