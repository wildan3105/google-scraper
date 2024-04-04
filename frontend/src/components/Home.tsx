import React, { useState, useEffect } from "react";
import { format } from "date-fns";

import CSV from "./CSV";
import KeywordDetails from "./KeywordDetails";
import Toast from "./Toast";

import "../styles/Home.scss";
import { fetchKeywords, getKeywordsResponse } from "../services/keywordApis";
import { socket } from "../services/socket";
import { socketEventNames } from "../configs/socket-event";
import { itemNames } from "../configs/local-storage";

const dateTimeFormat = "MMMM do yyyy, h:mm:ss a";
const itemsPerPage = 25;

interface HomeProps {
  userEmail: string | null;
}

interface SocketEvent {
  userId: string;
  userEmail: string;
  total: number;
}

interface ToastMessage {
  id: number;
  message: string;
}

const Home: React.FC<HomeProps> = ({ userEmail }) => {
  const [keywords, setKeywords] = useState<getKeywordsResponse[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
  const [_, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log(`socket is connected!`);
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onSocketEvent(msg: SocketEvent) {
      const currentUserEmail = localStorage.getItem(itemNames.userEmail);
      if (msg.userEmail === currentUserEmail) {
        const timestamp = new Date().getTime();
        setToastMessages((previous) => [
          ...previous,
          {
            id: timestamp,
            message: `${msg.total} keyword scraped successfully. Click here to see those!`,
          },
        ]);
      }
    }

    socket.connect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(socketEventNames.keywordsScrapped, onSocketEvent);

    fetchKeywords()
      .then((response) => {
        setKeywords(response.data);
      })
      .catch((error) => {
        console.error("Error fetching keywords:", error);
      });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("keywords_scraped_succeed", onSocketEvent);
    };
  }, []);

  const indexOfLastKeyword = currentPage * itemsPerPage;
  const indexOfFirstKeyword = indexOfLastKeyword - itemsPerPage;

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const hideToast = async () => {
    setToastMessages([]);
    try {
      const response = await fetchKeywords();
      setKeywords(response.data);
    } catch (error) {
      console.error("Error fetching keywords:", error);
    }
  };

  const handleKeywordClick = (keyword: { id: string; value: string }) => {
    setSelectedKeyword(keyword);
  };

  return (
    <>
      {toastMessages.map(({ id, message }) => (
        <Toast key={id} message={message} onClick={hideToast} />
      ))}
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
    </>
  );
};

export default Home;
