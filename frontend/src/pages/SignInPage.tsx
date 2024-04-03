import React from "react";
import SignInForm from "../components/SignInForm";
import { Link } from "react-router-dom";

import "../styles/SignInPage.scss";

const SignInPage: React.FC = () => {
  return (
    <div className="signin-page">
      <h2>Sign In</h2>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
      <div className="signin-form">
        <SignInForm />
      </div>
      <p className="home-link">
        Back to <Link to="../">home</Link>
      </p>
    </div>
  );
};

export default SignInPage;
