import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ is_admin, children }) => {
  if (!is_admin) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
