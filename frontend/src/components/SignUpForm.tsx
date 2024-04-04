import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { createUser } from "../services/userApis";
import CustomModal from "./CustomModal";
import { ErrorBody } from "../services";

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createUser({ email, password });

      setEmail("");
      setPassword("");
      setShowSuccessModal(true);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorBody: ErrorBody = error.response.data;
        setErrorMessage(errorBody.message);
        setShowErrorModal(true);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Your secured password"
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="on"
          />
        </div>
        <button type="submit">Sign up</button>
      </form>

      <CustomModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title="Success"
        titleIcon={<FontAwesomeIcon icon={faCheckCircle} />}
        content={
          <div>
            <p>
              Registration successful. Please check your inbox or spam to verify
              your account.
            </p>
          </div>
        }
      />

      <CustomModal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        title="Failed"
        titleIcon={<FontAwesomeIcon icon={faExclamationCircle} />}
        content={
          <div>
            <p>
              There was an error when signing up. Please check the error details
              below:
            </p>
            <p>
              <strong>
                {errorMessage
                  ? errorMessage
                  : "network error. please try again"}
              </strong>
            </p>
          </div>
        }
      />
    </>
  );
};

export default SignUpForm;
