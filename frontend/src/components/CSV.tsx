import React from "react";

import "../styles/Home.scss";

const CSV: React.FC = () => {
  const handleDownloadCSV = () => {
    const templateUrl = "/sample.csv";

    const link = document.createElement("a");

    link.href = templateUrl;

    link.download = "sample.csv";

    link.click();
  };

  const handleUploadCSV = () => {};

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
