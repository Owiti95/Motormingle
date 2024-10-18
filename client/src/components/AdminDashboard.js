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
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

  useEffect(() => {
    // Fetch events and attendees for the admin dashboard
    axios
      .get("/admin/dashboard")
      .then((response) => {
        setEvents(response.data.events);
        setAttendees(response.data.attendees);
        setIsAdmin(true); // Assume successful response means the user is an admin
      })
      .catch((error) => {
        setError("Error fetching admin data. Please try again.");
        setIsAdmin(false); // If there's an error, assume the user is not an admin
      });
  }, []);

  // Function to handle adding newly created events to the list
  const handleEventCreated = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

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

      {/* Only show CreateEvent if the user is an admin */}
      {isAdmin && (
        <>
          <h3>Create New Event</h3>
          <CreateEvent onEventCreated={handleEventCreated} />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
