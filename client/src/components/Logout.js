import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";

const Logout = () => {
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await axios.post("/logout"); // Make sure you implement this in your backend
      setUser(null); // Clear user in context
      history.push("/login"); // Redirect to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;