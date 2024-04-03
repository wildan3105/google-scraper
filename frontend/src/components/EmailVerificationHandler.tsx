import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { verifyUserEmail } from "../services/userApis";
import "../styles/EmailVerificationHandler.scss";
import { ErrorBody } from "../services";

interface EmailVerificationHandlerProps {
  verificationCode: string | null;
}

const EmailVerificationHandler: React.FC<EmailVerificationHandlerProps> = ({
  verificationCode,
}) => {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const mapVerificationStatusToAlert = {
    loading: "light",
    success: "success",
    failed: "danger",
  };

  useEffect(() => {
    if (verificationCode) {
      verifyUserEmail({ code: verificationCode })
        .then(() => {
          setVerificationStatus("success");
          const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
          }, 1000);
          setTimeout(() => {
            clearInterval(timer);
            navigate("/signin");
          }, 5000);
        })
        .catch((error: any) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            const errorBody: ErrorBody = error.response.data;
            setErrorMessage(errorBody.message);
            setVerificationStatus("failed");
          }
        });
    }
  }, [verificationCode, navigate]);

  return (
    <div className="email-verification-handler-container">
      <div
        className={`alert alert-${mapVerificationStatusToAlert[verificationStatus]}`}
        role="alert"
      >
        {verificationStatus === "loading" && <p>Verifying...</p>}
        {verificationStatus === "success" && <p>Verification success!</p>}
        {verificationStatus === "failed" && (
          <p>Verification failed. Error details: {errorMessage}</p>
        )}
      </div>
      {verificationStatus === "success" && (
        <p>Redirecting to sign-in page in {countdown} seconds...</p>
      )}
    </div>
  );
};

export default EmailVerificationHandler;
