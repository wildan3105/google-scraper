import React from "react";
import EmailVerificationHandler from "../components/EmailVerificationHandler";
import { useQuery } from "../hooks/useQuery";

const EmailVerificationPage: React.FC = () => {
  const query = useQuery();
  const code = query.get("code");

  return (
    <div className="email-verification-page">
      <EmailVerificationHandler verificationCode={code} />
    </div>
  );
};

export default EmailVerificationPage;
