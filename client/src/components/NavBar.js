import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";
import "../index.css";

const NavBar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  // Check if the current path is the root path
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav>
      <div className="brand">
        <Link to="/">MotorMingle</Link>
      </div>
      <ul>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/events"
            className={location.pathname === "/events" ? "active" : ""}
          >
            Events
          </Link>
        </li>
        {currentUser && ( // Only render My Events if currentUser is defined
          <li>
            <Link
              to="/Myevents"
              className={location.pathname === "/Myevents" ? "active" : ""}
            >
              My Events
            </Link>
          </li>
        )}
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
        {currentUser && currentUser.is_admin && (
          <li>
            <Link to="/admin">Admin Dashboard</Link>
          </li>
        )}
        {currentUser && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
