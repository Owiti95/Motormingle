import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "./UserContext"; // Import UserContext
import "../index.css"; // Import CSS for EventDetail

const EventDetail = () => {
  const { id } = useParams(); // Get the event ID from URL parameters
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const history = useHistory();
  const { currentUser } = useContext(UserContext); // Get current user from context

  // Fetch event details and categories on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/events/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Event not found");
        const eventData = await response.json();
        setEvent(eventData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/categories", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Categories not found");
        const categoryData = await response.json();
        setCategories(categoryData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvent();
    fetchCategories();
  }, [id]);

  // Handle RSVP booking
  const handleBooking = async () => {
    if (!currentUser) {
      alert("You need to be logged in to RSVP.");
      history.push("/login");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }

    setLoading(true);
    setError(null);

    // Calculate remaining tickets
    const remainingTickets = event.available_tickets;
    if (remainingTickets <= 0) {
      setError("No available tickets to book.");
      return;
    }

    try {
      const response = await fetch(`/events/${event.id}/rsvps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: "Attending",
          eventId: event.id,
          category: selectedCategory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvent((prevEvent) => ({
          ...prevEvent,
          available_tickets: prevEvent.available_tickets - 1,
          booked_tickets: prevEvent.booked_tickets + 1,
        }));

        const userName = currentUser?.name || currentUser?.email || "Guest";
        alert(`Welcome ${userName}!`);
        history.push("/Myevents");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (err) {
      setError("An error occurred during booking.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="event-detail">
      <h2 className="event-title">{event.title}</h2>
      <img src={event.image_url} alt={event.title} className="event-image" />
      <div className="event-info">
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {format(new Date(event.date_of_event), "MMMM dd, yyyy")}
        </p>
        <p>
          <strong>Time:</strong> {event.time}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>
        <p>
          <strong>Booked Tickets:</strong> {event.booked_tickets}
        </p>
        <p>
          <strong>Available Tickets:</strong> {event.available_tickets || 0}
        </p>
      </div>

      {event.available_tickets > 0 ? (
        <div className="rsvp-section">
          <label htmlFor="category-select">
            <strong>Select a Category:</strong>
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">--Choose a category--</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <button onClick={handleBooking} className="rsvp-button">
            RSVP Now
          </button>
        </div>
      ) : (
        <p className="sold-out">Tickets Sold Out</p>
      )}

      <Link to="/events" className="back-to-events">
        Back to Events
      </Link>
    </div>
  );
};

export default EventDetail;
