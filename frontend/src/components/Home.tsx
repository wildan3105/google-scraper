import React, { useState } from "react";

import "../styles/Home.scss";

interface HomeProps {
  userEmail: string | null;
  keywords: { id: string; created_at: string; value: string }[];
}

const Home: React.FC<HomeProps> = ({ userEmail, keywords }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    created_at: string;
    value: string;
  } | null>(null);

  const handleKeywordClick = (keyword: {
    id: string;
    created_at: string;
    value: string;
  }) => {
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
      <div className="keywords">
        <h3>Your Keywords:</h3>
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
        <div className="modal" id="keywordModal" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Keyword Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedKeyword(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>ID: {selectedKeyword.id}</p>
                <p>Created At: {selectedKeyword.created_at}</p>
                <p>Value: {selectedKeyword.value}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
