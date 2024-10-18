// Import necessary React functionalities
import React, { createContext, useState } from 'react';

// Create a context for managing user-related data
// This allows components to access and modify user data throughout the app without passing props manually at every level
export const UserContext = createContext();

// UserProvider component to provide the context value to all child components
export const UserProvider = ({ children }) => {
  // State to hold the current user information, initially set to null (no user logged in)
  // The user state can later be updated to store user details when they log in
  const [user, setUser] = useState(null);

  return (
    // Provide the user state and the function to update it (setUser) to all components within this provider
    // The value prop of the Provider component allows nested components to consume the context
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* Render any child components passed to UserProvider */}
    </UserContext.Provider>
  );
};
