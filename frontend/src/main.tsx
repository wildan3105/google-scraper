import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import App from "./App";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import HomePage from "./pages/HomePage";
import NotFoundHandler from "./components/NotFound";

import ProtectedRoute from "./routes/ProtectedRoutes";

import "bootstrap/dist/css/bootstrap.css";
import "./main.css";

library.add(fas);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/users/verify" element={<EmailVerificationPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundHandler />} />
    </Routes>
  </Router>
);
