import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router-dom"; // Import useHistory

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useContext(UserContext);
  const [welcomeMessage, setWelcomeMessage] = useState(""); // State for welcome message
  const history = useHistory(); // Initialize history

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    try {
      const response = await axios.post(
        "/login",
        { email, password },
        { withCredentials: true } // Include this option to send cookies
      );

      console.log(response); // Log the whole response
      setCurrentUser(response.data.user); // Assuming response.data.user contains the user info
      
      // Set the welcome message using the username from the response
      if (response.data.user && response.data.user.username) {
        setWelcomeMessage(`Welcome ${response.data.user.username}`);
      }

      // Redirect to the event list page after successful login
      history.push("/"); // Change this if your event list page has a different route
    } catch (err) {
      console.error(err);
      if (err.response) {
        // Handle the error response
        console.error("Error response:", err.response.data);
        alert(err.response.data.message || "Login failed!"); // Show error message
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Display the welcome message if it exists */}
      {welcomeMessage && <h2>{welcomeMessage}</h2>}
    </div>
  );
};

export default Login;
