import React from "react";

interface HomeProps {
  children: React.ReactNode | string;
}

const Home: React.FC<HomeProps> = ({ children }) => {
  return <>{<div className="homepage">{children}</div>}</>;
};

export default Home;
