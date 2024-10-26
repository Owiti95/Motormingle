import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useContext(UserContext);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const navigate = useNavigate(); // Updated useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      setCurrentUser(response.data.user);

      if (response.data.user && response.data.user.username) {
        setWelcomeMessage(`Welcome ${response.data.user.username}`);
      }

      navigate("/events"); // Replaced history.push with navigate
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(err.response.data.message || "Login failed!");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {welcomeMessage && <h2>{welcomeMessage}</h2>}
      </div>
    </div>
  );
};

export default Login;
