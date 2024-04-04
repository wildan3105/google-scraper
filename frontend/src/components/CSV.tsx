import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

import { uploadCSV, UploadCSVResponse } from "../services/csvApis";
import CustomModal from "./CustomModal";

const CSV: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [numOfUploadedKeywords, setNumOfUploadedKeywords] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDownloadCSV = () => {
    const templateUrl = "/sample.csv";
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "sample.csv";
    link.click();
  };

  const handleUploadCSV = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target) return;
      const csvContent = event.target.result as string;
      const keywords = parseCSV(csvContent);

      try {
        const response = await uploadCSV(keywords);
        handleUploadSuccess(response);
        setNumOfUploadedKeywords(response.data.result.length);
      } catch (error: any) {
        console.error("Error uploading CSV:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message);
          setShowErrorModal(true);
        }
      }
    };

    reader.readAsText(file);
  };

  const parseCSV = (csvContent: string): string[] => {
    const lines = csvContent.split(/\r?\n/);
    const nonEmptyLines = lines.filter((line) => line.trim() !== "");

    return nonEmptyLines;
  };

  const handleUploadSuccess = (_: UploadCSVResponse) => {
    setShowSuccessModal(true);
  };

  return (
    <div className="csv-buttons">
      <Button
        variant="primary"
        onClick={handleDownloadCSV}
        style={{ marginRight: "10px" }}
      >
        Download CSV Template
      </Button>
      <label htmlFor="csv-upload" className="btn btn-success">
        Upload CSV
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleUploadCSV}
        />
      </label>

      <CustomModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title="Success"
        titleIcon={<FontAwesomeIcon icon={faCheckCircle} />}
        content={
          <div>
            <p>
              Your CSV file has been successfully uploaded. Now it's waiting for
              scraping result.
            </p>
            <p>
              Number of (unique) keywords inside the CSV:{" "}
              <strong>{numOfUploadedKeywords}</strong>
            </p>
          </div>
        }
      />

      <CustomModal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        title="Failed"
        titleIcon={<FontAwesomeIcon icon={faExclamationCircle} />}
        content={
          <div>
            <p>
              There was an error uploading your CSV file. Here's the detail of
              the error:
            </p>
            <p>
              <strong>
                {errorMessage
                  ? errorMessage
                  : "unknown. Please contact wildansnahar@gmail.com"}
              </strong>
            </p>
          </div>
        }
      />
    </div>
  );
};

export default CSV;
