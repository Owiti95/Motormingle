import React, { createContext, useContext, useState } from "react";

// Creates a new context for managing user data and related state
const UserContext = createContext();

// Custom hook to simplify access to the UserContext
// Any component that calls this function will get the current value of the UserContext
export const useUserContext = () => {
  return useContext(UserContext); // Returns the value provided by UserContext
};

// Component that provides user-related data and functionality to its children
// It wraps around components that need access to the user state and functions
export const UserProvider = ({ children }) => {
  // Declares user state variable and its setter function
  // Initially, 'user' is set to null since no user data has been fetched
  const [user, setUser] = useState(null);
  
  // Declares a boolean state to track if the current user is an admin
  // Initially set to false
  const [isAdmin, setIsAdmin] = useState(false);

  // This function fetches user data from an API
  // It's asynchronous to handle the time it takes to receive the response
  const fetchUserData = async () => {
    // Simulating an API call to fetch user data
    const response = await fetch("http://127.0.0.1:5555/users"); // Sends a request to the specified URL
    const userData = await response.json(); // Converts the response data to JSON format

    // Updates the 'user' state with the fetched user data
    setUser(userData);

    // Sets the 'isAdmin' state based on whether the user data includes an 'isAdmin' field
    // Defaults to false if 'isAdmin' is not defined in the user data
    setIsAdmin(userData?.isAdmin || false);
  };

  // The 'UserContext.Provider' component makes the 'user', 'isAdmin', and 'fetchUserData'
  // accessible to any child component that consumes this context
  return (
    <UserContext.Provider value={{ user, isAdmin, fetchUserData }}>
      {children} {/* 'children' refers to any components wrapped by 'UserProvider' */}
    </UserContext.Provider>
  );
};





// Comment Breakdown:
// Imports:

// createContext: Creates a new context for sharing data across components.
// useContext: Retrieves the value from the created context.
// useState: Manages local state in the component.
// UserContext:

// A context object created with createContext(). This context will be used to provide and consume user data throughout the app.
// useUserContext Hook:

// A custom hook that simplifies how components access the context value. Instead of writing useContext(UserContext) in every component that needs the context, this hook wraps it in a neat function.
// UserProvider Component:

// A component that provides the UserContext to all its children.
// State Management:
// user: Holds the user data fetched from the API.
// isAdmin: Boolean indicating if the user has admin privileges.
// fetchUserData Function:

// Fetches user data from an API (in this case, the URL http://127.0.0.1:5555/users).
// After fetching, the user data is stored in the user state, and the isAdmin state is set based on whether the fetched user data contains the isAdmin property.
// UserContext.Provider:

// This component wraps the application and provides the context's values (user, isAdmin, and fetchUserData) to all nested components that need them.
// {children}: Represents the components wrapped by UserProvider that will consume the user data.
// In summary, this code sets up a user management context where components can access the current user's data, determine if they are an admin, and trigger a function to fetch or refresh the user data from an API.


















// // Import necessary React functionalities
// import React, { createContext, useState } from 'react';

// // Create a context for managing user-related data
// // This allows components to access and modify user data throughout the app without passing props manually at every level
// export const UserContext = createContext();

// // UserProvider component to provide the context value to all child components
// export const UserProvider = ({ children }) => {
//   // State to hold the current user information, initially set to null (no user logged in)
//   // The user state can later be updated to store user details when they log in
//   const [user, setUser] = useState(null);

//   return (
//     // Provide the user state and the function to update it (setUser) to all components within this provider
//     // The value prop of the Provider component allows nested components to consume the context
//     <UserContext.Provider value={{ user, setUser }}>
//       {children} {/* Render any child components passed to UserProvider */}
//     </UserContext.Provider>
//   );
// };
