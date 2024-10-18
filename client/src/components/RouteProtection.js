import React from "react";
import { Redirect } from "react-router-dom";

const ProtectedRoute = ({ is_admin, children }) => {
  if (!is_admin) {
    return <Redirect to="/" />;
  }
  return children;
};

export default ProtectedRoute;

