
// import React, { useState } from 'react';

// // Define the Login component, which takes a prop setLoggedIn
// const Login = ({ setLoggedIn }) => {
//   // State variables for storing email, password, and error messages
//   const [email, setEmail] = useState('');           // To hold the user's email
//   const [password, setPassword] = useState('');     // To hold the user's password
//   const [error, setError] = useState(null);         // To hold any error messages

//   // Asynchronous function to handle form submission and login process
//   const handleLogin = async (e) => {
//     e.preventDefault();  // Prevent the default form submission behavior

//     try {
//       // Sending a POST request to the backend login endpoint
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',  // Specify the request method as POST
//         headers: { 'Content-Type': 'application/json' },  // Set the request header to indicate JSON content
//         body: JSON.stringify({ email, password }),  // Convert email and password to JSON format for the request body
//       });

//       // Check if the response indicates success (status code in the range 200-299)
//       if (response.ok) {
//         const data = await response.json();  // Parse the response body as JSON
//         setLoggedIn(true);  // Update the parent component's state to indicate the user is logged in
//         setError(null);     // Clear any previous error messages
//       } else {
//         const errorData = await response.json();  // If not successful, parse the error response
//         setError(errorData.error); // Set the error message from the response to the state
//       }
//     } catch (err) {
//       // Catch any errors that occur during the fetch operation and set a generic error message
//       setError('An error occurred while logging in.');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleLogin}>  {/* Attach the handleLogin function to the form's onSubmit event*/}
//         <input
//           type="email"  // Input field for the email address
//           placeholder="Email"  // Placeholder text for the input field
//           value={email}  // Controlled input value, linked to email state
//           onChange={(e) => setEmail(e.target.value)}  // Update email state on input change
//         />
//         <input
//           type="password"  // Input field for the password
//           placeholder="Password"  // Placeholder text for the input field
//           value={password}  // Controlled input value, linked to password state
//           onChange={(e) => setPassword(e.target.value)}  // Update password state on input change
//         />
//         <button type="submit">Login</button>  {/* Button to submit the form*/}
//       </form>
//     </div>
//   );
// };


// export default Login;


//Login


import React, { useState } from 'react';

const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setLoggedIn(true);  // Update the loggedIn state in the parent
        setError(null);     // Clear any previous error
      } else {
        const errorData = await response.json();
        setError(errorData.error); // Set error message
      }
    } catch (err) {
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;