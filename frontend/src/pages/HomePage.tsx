import React from "react";
import Home from "../components/Home";
import LogoutButton from "../components/LogoutButton";
import { itemNames } from "../configs/local-storage";

const HomePage: React.FC = () => {
  const userEmail = localStorage.getItem(itemNames.userEmail);

  return (
    <div className="home-container">
      <header className="profile-header">
        <h2>Profile</h2>
      </header>
      <Home userEmail={userEmail} />
      <LogoutButton />
    </div>
  );
};

export default HomePage;
