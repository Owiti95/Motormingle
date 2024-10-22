// src/components/EventCard.js
import React from "react";
import "../index.css"; // Ensure this file has styles for the card

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <h2>{event.title}</h2>
      {event.image && (
        <img src={event.image} alt={event.title} className="event-image" />
      )}
      <p>{event.description}</p>
      {/* Add a link to the event detail page if needed */}
      <button onClick={() => (window.location.href = `/events/${event.id}`)}>
        View Details
      </button>
    </div>
  );
};

export default EventCard;
