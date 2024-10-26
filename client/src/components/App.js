import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventList from "./EventList";
import EventDetail from "./EventDetails";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import { UserProvider } from "./UserContext";
import NavBar from "./NavBar";
import ProtectedRoute from "./RouteProtection";
import EditEvent from "./EditEvent";
import MyEvents from "./Myevents";
import Home from "./Home";
import Attendees from "./Attendees";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard/event/:id/edit" element={<EditEvent />} />
          <Route path="/admin/dashboard/event/:eventId/attendees" element={<Attendees />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Myevents" element={<MyEvents />} />
          <Route path="/admin" element={<ProtectedRoute component={AdminDashboard} />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
