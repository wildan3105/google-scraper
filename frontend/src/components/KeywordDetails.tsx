import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import CustomModal from "./CustomModal";
import {
  getSingleKeyword,
  getHTMLContent,
  keywordDetailsResponse,
} from "../services/keywordApis";

interface KeywordDetailsProps {
  keywordId: string;
  onClose: () => void;
}

const KeywordDetails: React.FC<KeywordDetailsProps> = ({
  keywordId,
  onClose,
}) => {
  const [keywordDetails, setKeywordDetails] =
    useState<keywordDetailsResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keywordResponse = await getSingleKeyword({ id: keywordId });
        setKeywordDetails(keywordResponse.data);
      } catch (error) {
        console.error("Error fetching keyword details:", error);
      }
    };

    fetchData();
  }, [keywordId]);

  const openHtmlContentInNewTab = async () => {
    try {
      const htmlResponse = await getHTMLContent({ id: keywordId });
      const htmlContent = htmlResponse.data;

      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    } catch (error) {
      console.error("Error fetching HTML content:", error);
    }
  };

  return (
    <CustomModal
      show={!!keywordDetails}
      onHide={onClose}
      title="Details"
      titleIcon={<FontAwesomeIcon icon={faInfoCircle} />}
      content={
        keywordDetails && (
          <div>
            <p>ID: {keywordDetails.id}</p>
            <p>Keyword: {keywordDetails.keyword}</p>
            <p>Number of Links: {keywordDetails.num_of_links}</p>
            <p>Number of AdWords: {keywordDetails.num_of_adwords}</p>
            <p>
              Search Result Information:{" "}
              {keywordDetails.search_result_information}
            </p>
            <p>
              <button
                className="btn btn-info"
                onClick={openHtmlContentInNewTab}
              >
                View HTML Content
              </button>
            </p>
          </div>
        )
      }
    />
  );
};

export default KeywordDetails;
