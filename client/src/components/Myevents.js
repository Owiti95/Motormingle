import React, { useState, useEffect } from "react";

function MyEvents({ userRsvps, handleCancelRSVP, userId }) {
  const [myEvents, setMyEvents] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (Array.isArray(userRsvps)) {
      const attendingEvents = userRsvps.filter((rsvp) => rsvp.status === "Attending");
      setMyEvents(attendingEvents);
    }
  }, [userRsvps]);

  const handleCancelClick = (event) => {
    if (!event.id) {
      console.error("Event ID is missing");
      return;
    }

    setLoading(true); // Set loading state to true
    fetch(`http://127.0.0.1:5555/events${event.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), // Use dynamic userId
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to cancel RSVP');
        }
        return response.json();
      })
      .then(() => {
        handleCancelRSVP(event); // Update parent state to reflect cancellation
        setSuccessMessage(`RSVP canceled for ${event.title}`); // Success message
        setError(null); // Reset error on success
      })
      .catch((error) => {
        setError(error.message); // Set error message
        setSuccessMessage(''); // Reset success message on error
        console.error("Error canceling RSVP:", error);
      })
      .finally(() => {
        setLoading(false); // Reset loading state
      });
  };

  // Optional: Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Clear message after 3 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or change
    }
  }, [successMessage]);

  return (
    <div className="event-collection">
      <h2>My Events</h2>
      {error && <div className="error-message" role="alert">{error}</div>}
      {successMessage && <div className="success-message" role="alert">{successMessage}</div>}

      {loading && <p>Loading...</p>} {/* Loading state message */}

      {myEvents.length > 0 ? (
        myEvents.map((rsvp) => (
          <div key={rsvp.event.id} className="event-profile">
            <img src={rsvp.event.imageUrl} width="200" alt={rsvp.event.title} />
            <p><strong>{rsvp.event.title}</strong></p>
            <p>{rsvp.event.description}</p>
            <p><strong>Date:</strong> {rsvp.event.date_of_event}</p>
            <p><strong>Location:</strong> {rsvp.event.location}</p>
            <button onClick={() => handleCancelClick(rsvp.event)}>
              Cancel RSVP
            </button>
          </div>
        ))
      ) : (
        <p>You haven't RSVPed to any events yet.</p>
      )}
    </div>
  );
}

export default MyEvents;
