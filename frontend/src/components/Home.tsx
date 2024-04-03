import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import CSV from "./CSV";
import KeywordDetails from "./KeywordDetails";

import "../styles/Home.scss";
import { fetchKeywords, getKeywordsResponse } from "../services/keywordApis";

const dateTimeFormat = "MMMM do yyyy, h:mm:ss a";
const itemsPerPage = 25; // Number of items per page

interface HomeProps {
  userEmail: string | null;
}

const Home: React.FC<HomeProps> = ({ userEmail }) => {
  const [keywords, setKeywords] = useState<getKeywordsResponse[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Calculate the indexes for the current page
  const indexOfLastKeyword = currentPage * itemsPerPage;
  const indexOfFirstKeyword = indexOfLastKeyword - itemsPerPage;

  // Filter keywords based on search query
  const filteredKeywords = keywords.filter((keyword) =>
    keyword.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
        <CSV />
      </div>
      {keywords.length > 0 && (
        <div className="keywords-top">
          <h4>Keywords </h4>
          <div className="search-box">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="search"
                placeholder="Search by keyword"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      )}
      <div className="keywords">
        {filteredKeywords.length > 0 ? (
          <div>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Created At</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords
                  .slice(indexOfFirstKeyword, indexOfLastKeyword)
                  .map((keyword) => (
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
                          title={`Click to see more Google search result about "${keyword.value}"`}
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
          <p>{searchQuery ? "No records found..." : "Nothing to see..."}</p>
        )}
        <nav>
          <ul className="pagination">
            {Array.from(
              Array(Math.ceil(filteredKeywords.length / itemsPerPage)).keys()
            ).map((pageNumber) => (
              <li
                key={pageNumber + 1}
                className={`page-item ${
                  currentPage === pageNumber + 1 ? "active" : ""
                }`}
              >
                <button
                  onClick={() => paginate(pageNumber + 1)}
                  className="page-link"
                >
                  {pageNumber + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
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
