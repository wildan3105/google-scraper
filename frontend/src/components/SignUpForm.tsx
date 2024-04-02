import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../services/userApis"; // Import createUser function

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false); // State for success modal

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Send request to backend to create user
      await createUser({ email, password });
      console.log("User signed up successfully!");
      // Clear form fields
      setEmail("");
      setPassword("");
      setError("");
      // Open success modal
      setSuccessModalOpen(true);

      console.log(`successModalOpen is ${successModalOpen}`);
    } catch (error) {
      // Handle error
      console.error("Error signing up:", error);
      setError("Error signing up. Please try again.");
    }
  };

  const handleCloseModal = () => {
    // Close success modal
    setSuccessModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}{" "}
        {/* Display error message */}
        <button type="submit">Sign Up</button>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </form>
      {successModalOpen && (
        <div className="modal" onClick={() => handleCloseModal()}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Sign up success! Please check your inbox or spam to verify
                  your account.{" "}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpForm;
