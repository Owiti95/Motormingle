import React from "react";
import { Redirect } from "react-router-dom";

const ProtectedRoute = ({ loggedIn, isAdmin, children }) => {
  // Check if the user is logged in
  if (!loggedIn) {
    return <Redirect to="/login" />; // Redirect to login if not logged in
  }

  // Optional: Check if the user is an admin if that's required for certain routes
  if (!isAdmin) {
    return <Redirect to="/" />; // Redirect to home if not an admin
  }

  return children; // Render the child components if the checks pass
};

export default ProtectedRoute;


