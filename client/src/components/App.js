import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "./RouteProtection"; // Custom route for protecting routes
import EventList from "./EventList";
import EventDetail from "./EventDetails";
import Myevents from "./Myevents";
import Login from "./Login";
import LogoutButton from "./Logout";
import NavBar from "./NavBar";
import Register from "./Register";
import { UserProvider, useUserContext } from './UserContext'; // UserContext to manage global user state

const App = () => {
  const { user, isAdmin, fetchUserData } = useUserContext() || {}; // Destructure values from UserContext
  const [userRsvps, setUserRsvps] = useState([]); // State to store user's RSVPs
  const [loggedIn, setLoggedIn] = useState(false); // State to track if the user is logged in

  // Fetch RSVPs when the user is logged in
  useEffect(() => {
    if (user) {
      fetchUserRsvps(); // Call function to fetch RSVPs only if user is logged in
    }
  }, [user]); // Dependency array: Runs when user changes

  // Fetch user's RSVPs from the API
  const fetchUserRsvps = async () => {
    const response = await fetch('`/events/${event.id}/rsvps`'); 
    const data = await response.json();
    setUserRsvps(data); // Set the fetched RSVPs to state
  };

  // Function to handle RSVP action
  const handleRSVP = (event) => {
    const newRsvp = {
      event, // Event data
      status: "Attending", // Mark status as "Attending"
      participantName: user?.name, // Set user's name from context
      participantId: user?.id, // Set user's ID from context
    };
    setUserRsvps((prevRsvps) => [...prevRsvps, newRsvp]); // Add new RSVP to the existing array
  };

  // Function to handle canceling an RSVP
  const handleCancelRSVP = (eventId) => {
    setUserRsvps((prevRsvps) => prevRsvps.filter((rsvp) => rsvp.event.id !== eventId)); // Remove RSVP based on event ID
  };

  // Function to handle logout
  const handleLogout = () => {
    setLoggedIn(false); // Set loggedIn state to false when user logs out
  };

  return (
    <UserProvider> {/* Wrap the app with UserProvider to manage user state globally */}
      <Router>
        <NavBar 
          loggedIn={loggedIn} // Pass loggedIn state to NavBar for conditional rendering of buttons
          onLogout={handleLogout} // Pass logout handler to NavBar
        />

        <div>
          <h1>Welcome to Motormingle</h1>

          <Switch> {/* Switch to render only one route at a time */}
            {/* Home Page */}
            <Route path="/" exact>
              <EventList /> {/* Event List component for listing all events */}
            </Route>

            {/* Login Page */}
            <Route path="/login">
              <Login setLoggedIn={setLoggedIn} /> {/* Pass setLoggedIn function to Login for updating login state */}
            </Route>

            {/* Registration Page */}
            <Route path="/register">
              <Register setLoggedIn={setLoggedIn} /> {/* Pass setLoggedIn function to Register for updating login state */}
            </Route>

            {/* Event Detail Page */}
            <Route
              path="/events/:id" // :id is a dynamic parameter to fetch specific event details
              render={(props) => (
                <EventDetail {...props} handleRSVP={handleRSVP} user={user} />
              )}
            />

            {/* My Events Page */}
            <ProtectedRoute path="/myevents" loggedIn={loggedIn}> {/* ProtectedRoute ensures only logged-in users can access this page */}
              <Myevents userRsvps={userRsvps} handleCancelRSVP={handleCancelRSVP} /> {/* Pass user's RSVPs and cancel handler to MyEvents */}
            </ProtectedRoute>

            {/* Redirect to home for unknown routes */}
            <Redirect to="/" /> {/* Redirect users to home if they try to access an unknown route */}
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
