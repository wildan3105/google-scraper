import React from "react";
import { Link } from "react-router-dom";
import "./styles/LandingPage.scss";

function App() {
  return (
    <div className="landing-page">
      <h1>Welcome to the Google Scraper</h1>
      <div className="button-container">
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
        <Link to="/signin" className="btn btn-success">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default App;
