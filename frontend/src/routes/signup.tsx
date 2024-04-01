// src/routes/SignUpRoute.tsx

import React from "react";
import { Route } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";

const SignUpRoute: React.FC = () => {
  return <Route exact path="/signup" component={SignUpPage} />;
};

export default SignUpRoute;
