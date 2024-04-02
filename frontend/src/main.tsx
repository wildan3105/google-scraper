import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";

import "bootstrap/dist/css/bootstrap.css";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/users/verify" element={<EmailVerificationPage />} />
    </Routes>
  </Router>
);
