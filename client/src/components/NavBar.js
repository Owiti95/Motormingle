import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

const NavBar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext); // Access currentUser and setCurrentUser
  const history = useHistory();

  const handleLogout = () => {
    // Clear user session or token
    setCurrentUser(null); // Clear the current user context
    history.push("/"); // Redirect to the root page after logout
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {/* Conditionally render Sign Up and Login links */}
        {!currentUser && (
          <>
            <li>
              <Link to="/register">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
        {/* Render Admin Dashboard link only if user is an admin */}
        {currentUser && currentUser.is_admin && (
          <li>
            <Link to="/admin">Admin Dashboard</Link>
          </li>
        )}
        {/* Render Logout button only if user is logged in */}
        {currentUser && (
          <li>
            <button onClick={handleLogout} aria-label="Logout">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
