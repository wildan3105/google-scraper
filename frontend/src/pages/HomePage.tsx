// src/pages/HomePage.tsx

import React, { useEffect, useState } from "react";
import Home from "../components/Home";
import LogoutButton from "../components/LogoutButton";
import { itemNames } from "../configs/local-storage";
import { getKeywordsResponse, fetchKeywords } from "../services/keywordApis";

const HomePage: React.FC = () => {
  const [keywords, setKeywords] = useState<getKeywordsResponse[]>([]);
  const userEmail = localStorage.getItem(itemNames.userEmail);

  useEffect(() => {
    fetchKeywords()
      .then((response) => {
        setKeywords(response.data);
      })
      .catch((error) => {
        console.error("Error fetching keywords:", error);
      });
  }, []);

  return (
    <div className="home-container">
      <header className="profile-header">
        <h2>Profile</h2>
      </header>
      <Home userEmail={userEmail} keywords={keywords} />
      <LogoutButton />
    </div>
  );
};

export default HomePage;
