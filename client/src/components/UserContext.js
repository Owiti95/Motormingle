import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // You can define other user-related state here, like authentication status

  const fetchUserData = async () => {
    // Simulating an API call to fetch user data
    const response = await fetch("http://127.0.0.1:5555/users");
    const userData = await response.json();
    setUser(userData);
    setIsAdmin(userData?.isAdmin || false); // Set admin status based on user data
  };

  return (
    <UserContext.Provider value={{ user, isAdmin, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
