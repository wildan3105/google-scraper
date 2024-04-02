import React from "react";

import "../styles/Home.scss";

interface HomeProps {
  userEmail: string | null;
  keywords: { id: string; created_at: string; value: string }[];
}

const Home: React.FC<HomeProps> = ({ userEmail, keywords }) => {
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
                <td>{keyword.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
