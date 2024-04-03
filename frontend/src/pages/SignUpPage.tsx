import React from "react";
import SignUpForm from "../components/SignUpForm";
import { Link } from "react-router-dom";
import "../styles/SignUpPage.scss";

const SignUpPage: React.FC = () => {
  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <p className="signin-link">
        Already have an account? <Link to="/signin">Sign in here</Link>
      </p>
      <div className="signup-form">
        <SignUpForm />
      </div>
      <p className="home-link">
        Back to <Link to="../">home</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
