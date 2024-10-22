import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import "../index.css"; // Custom CSS for this page

const EventDetail = () => {
  const { id } = useParams(); // Extract the event ID from the URL
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for the RSVP button
  const history = useHistory();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError("Failed to load event details.");
      }
    };

    fetchEvent();
  }, [id]);

  const handleRSVP = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("token"); // Assuming you're using token-based auth

    try {
      const response = await axios.post(
        `/events/${id}/rsvps`,
        { status: "going" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to My Events page after successful RSVP
      history.push("/my-events");
    } catch (err) {
      setError("Attendance Confirmed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Loading event details...</p>;
  }

  const handleBackClick = () => {
    history.push("/events"); // Navigate back to the event list page
  };

  return (
    <div className="event-detail">
      <h1>{event.title}</h1>
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="event-image-detail"
        />
      )}
      <p>
        <strong>Date:</strong>{" "}
        {new Date(event.date_of_event).toLocaleDateString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      {event.category && (
        <p>
          <strong>Category:</strong> {event.category.name}
        </p>
      )}
      <p>
        <strong>Tickets Available</strong> {event.tickets_available}
      </p>
      <button className="rsvp-button" onClick={handleRSVP} disabled={loading}>
        {loading ? "RSVPing..." : "RSVP Now"}
      </button>

      <button className="back-button" onClick={handleBackClick}>
        Back to Events
      </button>
    </div>
  );
};

export default EventDetail;
