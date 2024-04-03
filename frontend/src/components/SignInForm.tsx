import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import { loginUser } from "../services/userApis";

import { itemNames } from "../configs/local-storage";
import CustomModal from "./CustomModal";

const genericSignInErrorMessage = "Email or password is invalid.";

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await loginUser({ email, password });

      setEmail("");
      setPassword("");

      localStorage.setItem(itemNames.accessToken, data.access_token);
      localStorage.setItem(itemNames.userEmail, data.email);

      navigate("/home");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(`error on login`);
        setErrorMessage(genericSignInErrorMessage);
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
            placeholder="Your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="Your secured password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
      <CustomModal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        title="Failed"
        titleIcon={<FontAwesomeIcon icon={faExclamationCircle} />}
        content={
          <div>
            <p>
              There was an error when signing in. Please check the error details
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

export default SignInForm;
