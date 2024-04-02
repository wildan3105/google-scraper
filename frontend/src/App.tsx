// src/App.tsx

import React from "react";
import { Link } from "react-router-dom";
import "./styles/LandingPage.scss"; // Update import path

function App() {
  return (
    <div className="landing-page">
      <h1>Welcome to the Google Scraper</h1>
      <div className="button-container">
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

export default App;
