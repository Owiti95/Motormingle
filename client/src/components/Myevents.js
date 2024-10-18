import React, { useState, useEffect } from "react";

function MyEvents({ userRsvps, handleCancelRSVP, userId }) {
    const [myEvents, setMyEvents] = useState([]); // State to store attending events
    const [error, setError] = useState(null); // State for error messages
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages
    const [loading, setLoading] = useState(false); // Loading state

    // Effect to filter user RSVPs whenever userRsvps changes
    useEffect(() => {
        if (Array.isArray(userRsvps)) {
            // Filter RSVPs to find events marked as "Attending"
            const attendingEvents = userRsvps.filter((rsvp) => rsvp.status === "Attending");
            setMyEvents(attendingEvents); // Update myEvents with the filtered RSVPs
        }
    }, [userRsvps]); // Run this effect whenever userRsvps changes

    // Handle canceling an RSVP
    const handleCancelClick = (event) => {
        if (!event.id) {
            console.error("Event ID is missing");
            return;
        }

        setLoading(true); // Set loading state to true
        // Correct the fetch URL by adding a slash before event.id
        fetch(`http://127.0.0.1:5555/events/rsvps`, { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }), // Include the userId in the request body
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to cancel RSVP');
                }
                return response.json(); // Parse the response JSON
            })
            .then(() => {
                handleCancelRSVP(event); // Update parent state to reflect the cancellation
                setSuccessMessage(`RSVP canceled for ${event.title}`); // Set success message
                setError(null); // Clear any previous errors
            })
            .catch((error) => {
                setError(error.message); // Set error message
                setSuccessMessage(''); // Clear success message on error
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
                setSuccessMessage(''); // Clear success message after 3 seconds
            }, 3000);

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
                <p>You haven't RSVPed to any events yet.</p> // Message if no events are found
            )}
        </div>
    );
}

export default MyEvents;
