// src/routes/SignUpRoute.tsx

import React from "react";
import { Route } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage"; // Update import path

const SignUpRoute: React.FC = () => {
  return <Route path="/signup" element={<SignUpPage />} />; // Use 'element' prop to render SignUpPage component
};

export default SignUpRoute;
