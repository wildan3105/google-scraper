// components/KeywordDetailsModal.tsx
import React, { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import {
  getSingleKeyword,
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
        const response = await getSingleKeyword({ id: keywordId });
        setKeywordDetails(response.data);
      } catch (error) {
        console.error("Error fetching keyword details:", error);
      }
    };

    fetchData();
    return () => {};
  }, [keywordId]);

  return (
    <CustomModal
      show={!!keywordDetails}
      onHide={onClose}
      title="Success"
      titleIcon={<p></p>}
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
          </div>
        )
      }
    ></CustomModal>
  );
};

export default KeywordDetails;
