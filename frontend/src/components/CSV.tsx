import React, { useState } from "react";
import { uploadCSV, UploadCSVResponse } from "../services/csvApis";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const CSV: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [numOfUploadedKeywords, setNumOfUploadedKeywords] = useState(0);
  const [erroMessage, setErrorMessage] = useState("");

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
    // Split the CSV content by new lines
    const lines = csvContent.split(/\r?\n/);

    // Return the keywords
    return lines;
  };

  const handleUploadSuccess = (response: UploadCSVResponse) => {
    // Handle successful upload
    console.log("Uploaded keywords:", response.data.result);
    setShowSuccessModal(true);
  };

  const handleCloseModals = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    const inputElement = document.getElementById(
      "csv-upload"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
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

      <Modal show={showSuccessModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your CSV file has been successfully uploaded. Now it's waiting for
            scraping result.
          </p>
          <p>
            Number of (unique) keywords inside the CSV:{" "}
            <strong>
              {" "}
              {numOfUploadedKeywords ? numOfUploadedKeywords : 0}{" "}
            </strong>
          </p>
        </Modal.Body>
      </Modal>

      <Modal show={showErrorModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            There was an error uploading your CSV file. Here's the detail of the
            error:
          </p>
          <p>
            <strong>
              {" "}
              {erroMessage
                ? erroMessage
                : "unknown. please contact wildansnahar@gmail.com"}{" "}
            </strong>
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CSV;