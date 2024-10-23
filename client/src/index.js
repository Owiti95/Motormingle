import React from "react";
import ReactDOM from "react-dom/client"; // Ensure you import from react-dom/client
import App from "./components/App"; // Import your App component
import { UserProvider } from "./components/UserContext"; // Import UserProvider from your UserContext file
import "./index.css"; // Import your CSS file

// Get the root element from the HTML
const container = document.getElementById("root");

// Create a root using ReactDOM
const root = ReactDOM.createRoot(container); // Use ReactDOM.createRoot

// Render the App component wrapped in UserProvider
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);

