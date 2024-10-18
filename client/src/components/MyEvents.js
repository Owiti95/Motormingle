import React, { useState, useEffect } from "react";

function MyEvents({ userRsvps, handleCancelRSVP }) {
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    const attendingEvents = userRsvps.filter(
      (rsvp) => rsvp.status === "Attending"
    );
    setMyEvents(attendingEvents);
  }, [userRsvps]);

  const handleCancelClick = (event) => {
    fetch(`/rsvp/${event.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: 1 }),
    })
      .then((response) => response.json())
      .then(() => {
        handleCancelRSVP(event); // Update parent state to reflect cancellation
      })
      .catch((error) => console.error("Error canceling RSVP:", error));
  };

  return (
    <div className="event-collection">
      <h2>My Events</h2>
      {myEvents.length > 0 ? (
        myEvents.map((rsvp) => (
          <div key={rsvp.event.id} className="event-profile">
            <img src={rsvp.event.imageUrl} width="200" alt={rsvp.event.name} />
            <p>{rsvp.event.title}</p>
            <p>{rsvp.event.description}</p>
            <p>{rsvp.event.date_of_event}</p>
            <p>{rsvp.event.location}</p>
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
