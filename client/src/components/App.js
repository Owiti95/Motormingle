import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./RouteProtection";
import EventList from "./EventList";
import EventDetail from "./EventDetails";
import Myevents from "./Myevents";
import Login from "./Login";
import LogoutButton from "./Logout";
import NavBar from "./NavBar";
import Register from "./Register";
import { UserProvider, useUserContext } from './UserContext'; // UserContext to manage global user state

const App = () => {
  const { user, isAdmin, fetchUserData } = useUserContext() || {};
  const [userRsvps, setUserRsvps] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Fetch RSVPs when the user is logged in
  useEffect(() => {
    if (user) {
      fetchUserRsvps();
    }
  }, [user]);

  // Fetch user's RSVPs from the API
  const fetchUserRsvps = async () => {
    const response = await fetch('/api/user_rsvps'); // Adjust API URL
    const data = await response.json();
    setUserRsvps(data);
  };

  // RSVP handler
  const handleRSVP = (event) => {
    const newRsvp = {
      event,
      status: "Attending",
      participantName: user?.name,
      participantId: user?.id,
    };
    setUserRsvps((prevRsvps) => [...prevRsvps, newRsvp]);
  };

  // Cancel RSVP handler
  const handleCancelRSVP = (eventId) => {
    setUserRsvps((prevRsvps) => prevRsvps.filter((rsvp) => rsvp.event.id !== eventId));
  };

  // Handle login/logout/register button clicks
  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <UserProvider>
      <Router>
        <NavBar 
          loggedIn={loggedIn} 
          onLoginClick={handleLoginClick} 
          onRegisterClick={handleRegisterClick} 
          onLogout={handleLogout} // Optional: Pass logout handler if needed
        />

        <div>
          <h1>Welcome to Motormingle</h1>

          <Switch>
            {/* Home Page */}
            <Route path="/" exact>
              <EventList />
            </Route>

            {/* Admin Login Page */}
            <Route path="/admin">
              <Login setLoggedIn={setLoggedIn} />
            </Route>

            {/* Event Detail Page */}
            <Route
              path="/events/:id"
              render={(props) => (
                <EventDetail {...props} handleRSVP={handleRSVP} user={user} />
              )}
            />

            {/* My Events Page */}
            <Route path="/myevents">
              {userRsvps.length > 0 ? (
                <Myevents userRsvps={userRsvps} handleCancelRSVP={handleCancelRSVP} />
              ) : (
                <p>No RSVPs found. Please RSVP to some events first.</p>
              )}
            </Route>

            {/* Registration Page */}
            <Route path="/register">
              <Register setLoggedIn={setLoggedIn} />
            </Route>
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
