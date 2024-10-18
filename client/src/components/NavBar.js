import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "./UserContext"; // Import UserContext for managing user state

function NavBar() {
  const { user, setUser } = useContext(UserContext); // Access the user state and setter
  const history = useHistory();

  // Handle logout and reset the user state
  const handleLogout = () => {
    setUser(null);
    history.push("/"); // Redirect to the login page after logging out
  };

  return (
    <nav className="navbar">
      <NavLink to="/home" className="nav-link">
        HOME
      </NavLink>
      <NavLink to="/eventlist" className="nav-link">
        EVENTS
      </NavLink>
      <NavLink to="/my_events" className="nav-link">
        MY EVENTS
      </NavLink>
      {user ? ( // If user is logged in
        <>
          <NavLink to="/admin" className="nav-link">
            ADMIN
          </NavLink>
          <span className="nav-link">Welcome, {user.name}!</span>
          <button onClick={handleLogout} className="nav-link">
            LOGOUT
          </button>
        </>
      ) : (
        // If user is not logged in
        <>
          <NavLink to="/register" className="nav-link">
            SIGN UP
          </NavLink>
          <NavLink to="/login" className="nav-link">
            LOGIN
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default NavBar;
