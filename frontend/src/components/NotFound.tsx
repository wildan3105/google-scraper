import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoadLock } from "@fortawesome/free-solid-svg-icons";

import "../styles/NotFound.scss";

const NotFoundHandler: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      navigate("/home");
    }, 5000);
  }, [navigate]);

  return (
    <div className="not-found-handler-container">
      <div className="alert alert-warning" role="alert">
        <h2>
          <FontAwesomeIcon icon={faRoadLock} />
        </h2>
        <p>There's nothing in here.</p>
        <p>Redirecting back to home page in {countdown} seconds...</p>
      </div>
    </div>
  );
};

export default NotFoundHandler;
