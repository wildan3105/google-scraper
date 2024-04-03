import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import CSV from "./CSV";
import KeywordDetails from "./KeywordDetails";

import "../styles/Home.scss";
import { fetchKeywords, getKeywordsResponse } from "../services/keywordApis";

const dateTimeFormat = "MMMM do yyyy, h:mm:ss a";

interface HomeProps {
  userEmail: string | null;
}

const Home: React.FC<HomeProps> = ({ userEmail }) => {
  const [keywords, setKeywords] = useState<getKeywordsResponse[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const handleKeywordClick = (keyword: { id: string; value: string }) => {
    setSelectedKeyword(keyword);
  };

  useEffect(() => {
    fetchKeywords()
      .then((response) => {
        setKeywords(response.data);
      })
      .catch((error) => {
        console.error("Error fetching keywords:", error);
      });
  }, []);

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
        <CSV />
      </div>
      <div className="keywords">
        {keywords.length > 0 ? (
          <div>
            <h4>Keywords </h4>
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
                    <td>
                      {format(new Date(keyword.created_at), dateTimeFormat)}
                    </td>
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
        ) : (
          <p> Nothing to see... Please upload your first CSV</p>
        )}
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
