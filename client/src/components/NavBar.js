import React from 'react';
import { NavLink } from 'react-router-dom';//create navigational links that integrate with React Router

function NavBar() {
  return (
    <nav className="navbar">
        <NavLink to="/admin" className="nav-link" >
        ADMIN
      </NavLink>
      <NavLink to="/signup/login" className="nav-link">
        SIGNUP/LOGIN
      </NavLink>
      <NavLink to="/home" className="nav-link" >
        HOME
      </NavLink>
      <NavLink to="/eventlist" className="nav-link" >
        EVENTS
      </NavLink>
      <NavLink to="/my_events" className="nav-link" >
        My Events
      </NavLink>
      
    </nav>
  );
}

export default NavBar;