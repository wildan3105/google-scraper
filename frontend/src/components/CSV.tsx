import React from "react";

import "../styles/Home.scss";

const CSV: React.FC = () => {
  const handleDownloadCSV = () => {
    // Get the URL of the CSV template file
    const templateUrl = "/sample.csv";

    // Create an anchor element
    const link = document.createElement("a");

    // Set the href attribute to the template URL
    link.href = templateUrl;

    // Set the download attribute to force download
    link.download = "sample.csv";

    // Trigger a click on the anchor element
    link.click();
  };

  const handleUploadCSV = () => {
    // Logic to handle upload CSV
  };

  return (
    <div className="csv-buttons">
      <button
        className="btn btn-primary"
        onClick={handleDownloadCSV}
        style={{ marginRight: "10px" }}
      >
        Download CSV Template
      </button>
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
    </div>
  );
};

export default CSV;
