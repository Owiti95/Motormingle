import React, { useContext } from 'react';  // Importing React and the useContext hook from React
import { Navigate } from 'react-router-dom';  // Importing Navigate component from react-router-dom to handle redirects
import { UserContext } from './UserContext';  // Importing the UserContext to access the global user state

// ProtectedRoute component to protect certain routes based on user authentication and role
const ProtectedRoute = ({ children }) => {
  // Accessing the `user` object from the UserContext using useContext
  const { user } = useContext(UserContext);

  // Check if there is no `user` or if the user's role is not 'admin'
  if (!user || user.role !== 'admin') {
    // If the user is not logged in or is not an admin, redirect them to the home page
    return <Navigate to="/" />;
  }

  // If the user exists and their role is 'admin', render the protected component (children)
  return children;
};

export default ProtectedRoute;
























// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { UserContext } from './UserContext';

// const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(UserContext);

//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/" />; // Redirect to home if not an admin
//   }

//   return children; // Render the protected component if the user is an admin
// };

// export default ProtectedRoute;
