import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import "../index.css"; // Import the updated CSS file

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events");
        setEvents(response.data);
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

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`/admin/dashboard/event/${eventId}`); // API call to delete the event
      setEvents(events.filter((event) => event.id !== eventId)); // Update the state to remove the deleted event
    } catch (err) {
      setError("Failed to delete event.");
    }
  };

  return (
    <div className="event-list">
      {error && <p>{error}</p>}
      <h1>Motormingle</h1>
      <div className="event-cards-container">
        {events.map((event) => (
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
              {isAdmin &&
                location.pathname !== "/" && ( // Check if the current path is not the root page
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
