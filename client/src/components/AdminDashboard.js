// AdminDashboard.js
// AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import EventList from "./EventList";
import CreateEvent from "./CreateEvent";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch events and attendees for the admin dashboard
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5555/admin/dashboard");
        setEvents(response.data.events);
        setAttendees(response.data.attendees);
      } catch (error) {
        setError("Error fetching admin data. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  const handleEventCreated = (newEvent) => {
    // Update the events list with the new event
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading ? (
        <p>Loading...</p> // Display loading state
      ) : (
        <>
          {error && <p>{error}</p>}

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
          <CreateEvent onEventCreated={handleEventCreated} />
          <h3>Event List</h3>
          <EventList events={events} /> {/* Display the event list */}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
