// src/pages/LandingPage.tsx

import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.scss";

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome to google-scraper!</h1>
      <div className="menu">
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
        <Link to="/signin" className="btn btn-secondary">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
