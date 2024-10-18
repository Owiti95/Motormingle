//App.js

import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import LogoutButton from './LogoutButton';
import EventList from './EventList'; // Assume this component lists events
import { UserProvider } from './UserContext'; // Import UserProvider

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginButtonClick = () => {
    setShowLogin((prev) => !prev); // Toggle the visibility of the login form
    setShowRegister(false); // Hide Register if Login is shown
  };

  const handleRegisterButtonClick = () => {
    setShowRegister((prev) => !prev); // Toggle the visibility of the register form
    setShowLogin(false); // Hide Login if Register is shown
  };

  const handleLogout = () => {
    setLoggedIn(false); // Update loggedIn state on logout
  };

  return (
    <UserProvider>
      <div>
        <h1>Welcome to Motormingle</h1>
        
        {loggedIn ? (
          <div>
            <LogoutButton onLogout={handleLogout} />
            <EventList />
          </div>
        ) : (
          <>
            <button onClick={handleRegisterButtonClick}>
              {showRegister ? ' X ' : 'Register'}
            </button>
            {showRegister && <Register setLoggedIn={setLoggedIn} />}

            <button onClick={handleLoginButtonClick}>
              {showLogin ? ' X ' : 'Login'}
            </button>
            {showLogin && <Login setLoggedIn={setLoggedIn} />}
          </>
        )}
      </div>
    </UserProvider>
  );
};

export default App;
