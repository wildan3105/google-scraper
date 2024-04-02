import React, { useState } from "react";
import SignInForm from "../components/SignInForm";
import { Link } from "react-router-dom";

import "../styles/SignInPage.scss";
import Modal from "../components/Modal";

const SignInPage: React.FC = () => {
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleFailureModal = () => setFailureModalOpen(!failureModalOpen);

  const handleFailure = (error: string) => {
    setErrorMessage(error);
    toggleFailureModal();
  };

  return (
    <div className="signin-page">
      <h2>Sign In</h2>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
      <div className="signin-form">
        <SignInForm onFailure={handleFailure} />
      </div>
      <p className="home-link">
        Back to <Link to="../">home</Link>
      </p>

      <Modal
        visible={failureModalOpen}
        onClose={() => toggleFailureModal()}
        children={errorMessage}
      ></Modal>
    </div>
  );
};

export default SignInPage;
