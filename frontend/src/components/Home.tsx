// components/Home.tsx
import React, { useState } from "react";
import CSV from "./CSV";
import KeywordDetails from "./KeywordDetails";

import "../styles/Home.scss";

interface HomeProps {
  userEmail: string | null;
  keywords: { id: string; created_at: string; value: string }[];
}

const Home: React.FC<HomeProps> = ({ userEmail, keywords }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const handleKeywordClick = (keyword: { id: string; value: string }) => {
    setSelectedKeyword(keyword);
  };

  return (
    <div className="homepage">
      <div className="welcome-message">
        {userEmail && (
          <p>
            Welcome back, <strong>{userEmail}</strong>!
          </p>
        )}
      </div>
      <div className="keywords-header-container">
        <h3 className="keywords-header">Your Keywords:</h3>
        <CSV />
      </div>
      <div className="keywords">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Created At</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((keyword) => (
              <tr key={keyword.id}>
                <td>{keyword.id}</td>
                <td>{keyword.created_at}</td>
                <td>
                  <button
                    className="btn btn-link"
                    onClick={() => handleKeywordClick(keyword)}
                    data-bs-toggle="modal"
                    data-bs-target="#keywordModal"
                    title={`Click to learn more about ${keyword.value}`}
                  >
                    {keyword.value}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedKeyword && (
        <KeywordDetails
          keywordId={selectedKeyword.id}
          onClose={() => setSelectedKeyword(null)}
        />
      )}
    </div>
  );
};

export default Home;
