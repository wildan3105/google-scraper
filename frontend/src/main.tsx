// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import SignUpRoute from "./routes/signup.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <SignUpRoute />
        {/* Add any additional routes here */}
        <Redirect to="/" />
        {/* Redirect to the landing page for any undefined routes */}
      </Switch>
    </Router>
  </React.StrictMode>
);
