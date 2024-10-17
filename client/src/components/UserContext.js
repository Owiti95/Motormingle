import React, { createContext, useState } from 'react';

// Create a context for managing user-related data
export const UserContext = createContext();

// UserProvider component to provide the context value to all child components
export const UserProvider = ({ children }) => {
  // State to hold the current user information, initially set to null (no user logged in)
  const [user, setUser] = useState(null);

  return (
    // Provide the user state and the function to update it (setUser) to all components within this provider
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* Render any child components */}
    </UserContext.Provider>
  );
};
