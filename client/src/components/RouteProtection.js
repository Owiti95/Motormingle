import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ component: Component }) => {
  const { currentUser } = useContext(UserContext);

  return currentUser && currentUser.is_admin ? (
    <Component />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
