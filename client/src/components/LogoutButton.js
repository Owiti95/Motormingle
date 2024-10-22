// Importing React library for building the component
import React from 'react';

// Define a functional component named LogoutButton
// This component accepts a prop named onLogout, which is a function to be called on successful logout
const LogoutButton = ({ onLogout }) => {
  
  // Define an asynchronous function to handle the logout process
  const handleLogout = async () => {
    try {
      // Send a POST request to the backend logout endpoint
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',  // Specify the method as POST
      });

      // Check if the response from the server is successful (status code in the range 200-299)
      if (response.ok) {
        // If successful, call the onLogout function passed as a prop
        // This will update the parent component's state to indicate the user is logged out
        onLogout();  
      } else {
        // If the response is not successful, log a message indicating the logout failed
        console.log('Logout failed.');
      }
    } catch (err) {
      // Catch any errors that occur during the fetch operation and log an error message
      console.log('An error occurred during logout.');
    }
  };

  // Render a button element
  // When the button is clicked, it triggers the handleLogout function
  return <button onClick={handleLogout}>Logout</button>;
};

// Export the LogoutButton component as the default export for this module
export default LogoutButton;
