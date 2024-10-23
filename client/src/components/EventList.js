import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../index.css"; // Import the updated CSS file

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // State to handle filtered events
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events");
        setEvents(response.data);
        setFilteredEvents(response.data); // Initialize filtered events with all events
      } catch (err) {
        setError("Failed to load events.");
      }
    };

    const checkAdminStatus = async () => {
      try {
        const response = await axios.get("/check-admin-status"); // Hypothetical endpoint
        setIsAdmin(response.data.isAdmin); // Assuming the API returns { isAdmin: true/false }
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    };

    fetchEvents();
    checkAdminStatus();
  }, []);

  // Function to delete an event
  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`/admin/dashboard/event/${eventId}`); // API call to delete the event
      setEvents(events.filter((event) => event.id !== eventId)); // Update the state to remove the deleted event
      setFilteredEvents(filteredEvents.filter((event) => event.id !== eventId)); // Update filtered events as well
    } catch (err) {
      setError("Failed to delete event.");
    }
  };

  // Function to handle the search input change for title OR location
  const handleSearch = () => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <div className="event-list">
      {error && <p>{error}</p>}
      <h1>Motormingle</h1>

      {/* Single Search bar */}
      <div className="search-form">
        <input
          type="text"
          placeholder="Search by title or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="event-cards-container">
        {filteredEvents.map((event) => (
          <div className="event-card" key={event.id}>
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="event-image"
              />
            )}
            <h2 className="event-title">{event.title}</h2>
            <p className="event-location">Location: {event.location}</p>
            <p className="event-date">
              Date: {new Date(event.date_of_event).toLocaleDateString()}
            </p>
            <div className="event-buttons">
              {isAdmin && location.pathname !== "/" && ( // Check if the current path is not the root page
                <>
                  <Link
                    to={`/admin/dashboard/event/${event.id}/edit`}
                    className="edit-button"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </>
              )}
              <Link to={`/events/${event.id}`} className="book-now-button">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
