import { Navigate, Route } from "react-router-dom";
import { ReactNode } from "react";
import { itemNames } from "../configs/local-storage";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const accessToken = localStorage.getItem(itemNames.accessToken);

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
