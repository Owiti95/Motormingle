
import React, { useState } from 'react'; // Import React and useState hook
import Login from './Login'; // Import Login component
import Register from './Register'; // Import Register component
import LogoutButton from './LogoutButton'; // Import LogoutButton component
import EventList from './EventList'; // Import EventList component to display events
import { UserProvider } from './UserContext'; // Import UserProvider to manage user context

const App = () => {
  // State to manage login status and visibility of login/register forms
  const [loggedIn, setLoggedIn] = useState(false); // Initialize loggedIn state as false
  const [showLogin, setShowLogin] = useState(false); // Initialize showLogin state as false
  const [showRegister, setShowRegister] = useState(false); // Initialize showRegister state as false

  // Function to handle login button click
  const handleLoginButtonClick = () => {
    setShowLogin((prev) => !prev); // Toggle the visibility of the login form
    setShowRegister(false); // Hide Register form if Login is shown
  };

  // Function to handle register button click
  const handleRegisterButtonClick = () => {
    setShowRegister((prev) => !prev); // Toggle the visibility of the register form
    setShowLogin(false); // Hide Login form if Register is shown
  };

  // Function to handle user logout
  const handleLogout = () => {
    setLoggedIn(false); // Update loggedIn state to false on logout
  };

  return (
    <UserProvider> {/* Provide user context to child components */}
      <div>
        <h1>Welcome to Motormingle</h1> {/* Application title */}
        
        {loggedIn ? ( // Conditional rendering based on login status
          <div>
            <LogoutButton onLogout={handleLogout} /> {/* Render LogoutButton when logged in */}
            <EventList /> {/* Render EventList to show upcoming events */}
          </div>
        ) : (
          <> {/* Fragment to group children */}
            <button onClick={handleRegisterButtonClick}>
              {showRegister ? ' X ' : 'Register'} {/* Show 'X' to close Register form or 'Register' to open it */}
            </button>
            {showRegister && <Register setLoggedIn={setLoggedIn} />} {/* Render Register component if showRegister is true */}

            <button onClick={handleLoginButtonClick}>
              {showLogin ? ' X ' : 'Login'} {/* Show 'X' to close Login form or 'Login' to open it */}
            </button>
            {showLogin && <Login setLoggedIn={setLoggedIn} />} {/* Render Login component if showLogin is true */}
          </>
        )}
      </div>
    </UserProvider>
  );
};

export default App;
