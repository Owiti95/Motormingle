import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../index.css"; // Import the updated CSS file

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://server-ai40.onrender.com/events");
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        setError("Failed to load events.");
      }
    };

    const checkAdminStatus = async () => {
      try {
        const response = await axios.get("https://server-ai40.onrender.com/check-admin-status");
        setIsAdmin(response.data.isAdmin);
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    };

    fetchEvents();
    checkAdminStatus();
  }, []);

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`https://server-ai40.onrender.com/admin/dashboard/event/${eventId}`);
      setEvents(events.filter((event) => event.id !== eventId));
      setFilteredEvents(filteredEvents.filter((event) => event.id !== eventId));
    } catch (err) {
      setError("Failed to delete event.");
    }
  };

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
      {error && <p className="error-message">{error}</p>}
      <h1 className="page-title">
        <i>Motormingle</i>
      </h1>

      <div className="search-form">
        <input
          type="text"
          placeholder="Search event by title or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
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
              {isAdmin && location.pathname !== "/" && (
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
