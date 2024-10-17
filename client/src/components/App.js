import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Home from "./Home";
import ProtectedRoute from "./RouteProtection";

const App = () => {
  const is_admin = true; // Replace with actual admin check logic

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute is_admin={is_admin}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
