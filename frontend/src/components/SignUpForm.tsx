// src/components/SignUpForm.tsx

import React, { useState } from "react";
import { createUser } from "../services/userApis";
import { ErrorBody } from "../services";

interface SignUpFormProps {
  onSuccess: (msg: string) => void;
  onFailure: (error: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onFailure }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createUser({ email, password });

      setEmail("");
      setPassword("");
      setError("");
      onSuccess("Please check your inbox or spam to verify your account");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorBody: ErrorBody = error.response.data;
        const errorMessage = errorBody.message;
        setError(errorMessage);
        onFailure(errorMessage);
      } else {
        setError("Error signing up. Please try again.");
        onFailure("Error signing up. Please try again.");
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
          />
        </div>
        <button type="submit">Sign up</button>
      </form>
    </>
  );
};

export default SignUpForm;
