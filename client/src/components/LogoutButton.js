//LogoutButton
import React from 'react';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
      });

      if (response.ok) {
        onLogout();  // Update the parent state to reflect the logged-out status
      } else {
        console.log('Logout failed.');
      }
    } catch (err) {
      console.log('An error occurred during logout.');
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
