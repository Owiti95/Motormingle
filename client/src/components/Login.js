import React, { useState } from 'react'; // Import React and useState hook

// Login component definition
// Receives 'setLoggedIn' as a prop to update login status in the parent component
const Login = ({ setLoggedIn }) => {
  // State for storing the email entered by the user
  const [email, setEmail] = useState(''); // Initial value is an empty string

  // State for storing the password entered by the user
  const [password, setPassword] = useState(''); // Initial value is an empty string

  // State for storing error messages (e.g., incorrect credentials, server errors)
  const [error, setError] = useState(null); // Initial value is null (no error)

  // Function to handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)

    try {
      // Sends a POST request to the '/login' endpoint with email and password
      const response = await fetch('/login', {
        method: 'POST', // POST method to send the login data
        headers: { 'Content-Type': 'application/json' }, // Tells the server to expect JSON
        body: JSON.stringify({ email, password }), // Send email and password as JSON
      });

      // If the response is OK (200 status), process login
      if (response.ok) {
        const data = await response.json(); // Parse response data (e.g., user info)
        setLoggedIn(true); // Update the parent component's loggedIn state (user is logged in)
        setError(null); // Clear any previous error messages (successful login)
      } else {
        // If the response status is not OK, extract and show error message
        const errorData = await response.json(); // Parse the response for error details
        setError(errorData.error); // Update the error state with the error message
      }
    } catch (err) {
      // If there's a network or server error, display a generic error message
      setError('An error occurred while logging in.'); // Show a fallback error message
    }
  };

  // JSX to render the login form
  return (
    <div>
      <h2>Login</h2>
      {/* Conditionally render error message in red if the error state is set */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form that calls handleLogin on submission */}
      <form onSubmit={handleLogin}>
        {/* Input field for email */}
        <input
          type="email"              // Input type is email (basic validation in browsers)
          placeholder="Email"        // Placeholder text inside the input field
          value={email}              // Bound to the 'email' state
          onChange={(e) => setEmail(e.target.value)} // Update email state as user types
        />

        {/* Input field for password */}
        <input
          type="password"            // Input type is password (hides entered characters)
          placeholder="Password"     // Placeholder text inside the input field
          value={password}           // Bound to the 'password' state
          onChange={(e) => setPassword(e.target.value)} // Update password state as user types
        />

        {/* Submit button for the form */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login; // Export the Login component so it can be used elsewhere in the app



// How This Relates to UserContext.js:
// Login and Context Integration:
// The Login component focuses on the login process, sending the user's email and password to the server for authentication. Once the user successfully logs in, you might want to update global user data (e.g., the user and isAdmin values) using the UserContext.
// Global State Management:
// UserContext.js provides a context (UserContext) where global user data and authentication status can be managed. Once the user is logged in via this Login component, it can trigger fetchUserData() from UserContext.js to retrieve the full user details, update the user state, and possibly manage roles like isAdmin.
// Example of Integration:
// In the handleLogin function, after successfully logging in, you could fetch user details using the fetchUserData() function from UserContext. You can modify Login to consume UserContext by calling it after the user logs in:
// javascript
// Copy code
// const { fetchUserData } = useUserContext(); // Get fetchUserData from UserContext

// if (response.ok) {
//   const data = await response.json();
//   setLoggedIn(true); // Update loggedIn state
//   setError(null); // Clear error state
//   fetchUserData(); // Fetch and set the global user data after successful login
// }
// In this way, the login process updates not only the local component but also the global user state managed by the context.






































// // import React, { useState } from 'react';

// // // Define the Login component, which takes a prop setLoggedIn
// // const Login = ({ setLoggedIn }) => {
// //   // State variables for storing email, password, and error messages
// //   const [email, setEmail] = useState('');           // To hold the user's email
// //   const [password, setPassword] = useState('');     // To hold the user's password
// //   const [error, setError] = useState(null);         // To hold any error messages

// //   // Asynchronous function to handle form submission and login process
// //   const handleLogin = async (e) => {
// //     e.preventDefault();  // Prevent the default form submission behavior

// //     try {
// //       // Sending a POST request to the backend login endpoint
// //       const response = await fetch('http://localhost:5000/login', {
// //         method: 'POST',  // Specify the request method as POST
// //         headers: { 'Content-Type': 'application/json' },  // Set the request header to indicate JSON content
// //         body: JSON.stringify({ email, password }),  // Convert email and password to JSON format for the request body
// //       });

// //       // Check if the response indicates success (status code in the range 200-299)
// //       if (response.ok) {
// //         const data = await response.json();  // Parse the response body as JSON
// //         setLoggedIn(true);  // Update the parent component's state to indicate the user is logged in
// //         setError(null);     // Clear any previous error messages
// //       } else {
// //         const errorData = await response.json();  // If not successful, parse the error response
// //         setError(errorData.error); // Set the error message from the response to the state
// //       }
// //     } catch (err) {
// //       // Catch any errors that occur during the fetch operation and set a generic error message
// //       setError('An error occurred while logging in.');
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Login</h2>
// //       {error && <p style={{ color: 'red' }}>{error}</p>}
// //       <form onSubmit={handleLogin}>  {/* Attach the handleLogin function to the form's onSubmit event*/}
// //         <input
// //           type="email"  // Input field for the email address
// //           placeholder="Email"  // Placeholder text for the input field
// //           value={email}  // Controlled input value, linked to email state
// //           onChange={(e) => setEmail(e.target.value)}  // Update email state on input change
// //         />
// //         <input
// //           type="password"  // Input field for the password
// //           placeholder="Password"  // Placeholder text for the input field
// //           value={password}  // Controlled input value, linked to password state
// //           onChange={(e) => setPassword(e.target.value)}  // Update password state on input change
// //         />
// //         <button type="submit">Login</button>  {/* Button to submit the form*/}
// //       </form>
// //     </div>
// //   );
// // };


// // export default Login;


// //Login


// import React, { useState } from 'react';

// const Login = ({ setLoggedIn }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setLoggedIn(true);  // Update the loggedIn state in the parent
//         setError(null);     // Clear any previous error
//       } else {
//         const errorData = await response.json();
//         setError(errorData.error); // Set error message
//       }
//     } catch (err) {
//       setError('An error occurred while logging in.');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;