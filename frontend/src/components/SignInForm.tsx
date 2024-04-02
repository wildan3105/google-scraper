import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userApis";

import { itemNames } from "../configs/local-storage";

const genericSignInErrorMessage = "Email or password is invalid.";

interface SignInFormProps {
  onFailure: (error: string) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onFailure }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await loginUser({ email, password });

      setEmail("");
      setPassword("");

      // set cookie in http data.access_token
      localStorage.setItem(itemNames.accessToken, data.access_token);
      localStorage.setItem(itemNames.userEmail, data.email);

      // redirect to the /home page
      navigate("/home");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(`error on login`);
        onFailure(genericSignInErrorMessage);
      }
    }
  };

  return (
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
  );
};

export default SignInForm;
