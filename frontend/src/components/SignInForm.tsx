// src/components/SignInForm.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your sign-up logic here (e.g., sending request to backend)
    console.log("Signing in:", email, password);
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
