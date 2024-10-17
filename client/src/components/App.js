import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { UserProvider } from './UserContext'; // Import UserProvider

const App = () => {
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

  return (
    <UserProvider> {/* Wrap the whole app with UserProvider */}
      <div>
        <h1>Welcome to Motormingle</h1>
        <button onClick={handleRegisterButtonClick}>
          {showRegister ? ' X ' : 'Register'}
        </button>
        {showRegister && <Register />}
        <button onClick={handleLoginButtonClick}>
          {showLogin ? ' X ' : 'Login'}
        </button>
        {showLogin && <Login />}
      </div>
    </UserProvider>
  );
};

export default App;
