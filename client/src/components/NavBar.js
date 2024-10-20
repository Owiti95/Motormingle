import React from "react";
import { NavLink } from "react-router-dom"; // create navigational links that integrate with React Router

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/admin" className="nav-link" activeClassName="active">
        ADMIN
      </NavLink>
      <NavLink to="/register" className="nav-link" activeClassName="active">
        SIGN UP
      </NavLink>
      <NavLink to="/login" className="nav-link" activeClassName="active">
        LOGIN
      </NavLink>
      <NavLink to="/" className="nav-link" exact activeClassName="active">
        HOME
      </NavLink>
      <NavLink to="/Myevents" className="nav-link" activeClassName="active">
        MY EVENTS
      </NavLink>
    </nav>
  );
}

export default NavBar;
