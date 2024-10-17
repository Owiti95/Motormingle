// AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import EventList from "./EventList";
import CreateEvent from "./CreateEvent";
import SearchBar from "./SearchBar";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch events and attendees for the admin dashboard
    axios
      .get("/admin/dashboard")
      .then((response) => {
        setEvents(response.data.events);
        setAttendees(response.data.attendees);
      })
      .catch((error) => {
        setError("Error fetching admin data. Please try again.");
      });
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p>{error}</p>}

      <SearchBar onSearch={setSearchQuery} />
      <h3>Events</h3>
      <EventList events={events} searchQuery={searchQuery} />

      <h3>Attendees</h3>
      {attendees.length > 0 ? (
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee.id}>{attendee.name}</li>
          ))}
        </ul>
      ) : (
        <p>No attendees found.</p>
      )}

      <h3>Create New Event</h3>
      <CreateEvent onEventCreated={setEvents} />
    </div>
  );
};

export default AdminDashboard;
