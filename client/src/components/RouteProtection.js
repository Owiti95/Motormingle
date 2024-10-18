import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(UserContext);
  const is_admin = user?.is_admin;

  return (
    <Route
      {...rest}
      render={(props) =>
        is_admin ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
