import React, { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import "../styles/SignUpPage.scss";

const SignUpPage: React.FC = () => {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSuccessModal = () => setSuccessModalOpen(!successModalOpen);
  const toggleFailureModal = () => setFailureModalOpen(!failureModalOpen);

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    toggleSuccessModal();
  };

  const handleFailure = (error: string) => {
    setErrorMessage(error);
    toggleFailureModal();
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <p className="signin-link">
        Already have an account? <Link to="/signin">Sign in here</Link>
      </p>
      <div className="signup-form">
        <SignUpForm onSuccess={handleSuccess} onFailure={handleFailure} />
      </div>
      <p className="home-link">
        Back to <Link to="../">home</Link>
      </p>

      <Modal
        visible={successModalOpen}
        onClose={() => toggleSuccessModal()}
        children={successMessage}
      ></Modal>

      <Modal
        visible={failureModalOpen}
        onClose={() => toggleFailureModal()}
        children={errorMessage}
      ></Modal>
    </div>
  );
};

export default SignUpPage;
