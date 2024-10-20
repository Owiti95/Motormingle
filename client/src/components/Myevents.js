import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function MyEvents({ userId, handleCancelRSVP }) {
    const [myEvents, setMyEvents] = useState([]); // Store attending events
    const [error, setError] = useState(null); // For error messages
    const [successMessage, setSuccessMessage] = useState(''); // Success message
    const [loading, setLoading] = useState(false); // Loading state
    const history = useHistory();

    // Ensure user is logged in, if not redirect to login
    useEffect(() => {
        if (!userId) {
            history.push('/login'); // Redirect to login if no user is logged in
        }
    }, [userId, history]);

    // Fetch user's RSVPs when the component loads
    useEffect(() => {
        const fetchUserRsvps = async () => {
            setLoading(true); // Start loading

            try {
                const response = await fetch(`http://127.0.0.1:5555/users/${userId}/rsvps`);
                if (!response.ok) throw new Error('Failed to fetch RSVPs');
                
                const data = await response.json();
                setMyEvents(data); // Set the RSVPs as events
                setError(null); // Clear any errors
            } catch (error) {
                setError(error.message); // Set error message
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUserRsvps();
    }, [userId]);

    // Handle canceling an RSVP
    const handleCancelClick = (event) => {
        if (!event.id) {
            console.error("Event ID is missing");
            return;
        }

        setLoading(true); // Start loading
        fetch(`http://127.0.0.1:5555/events/${event.id}/rsvps`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, eventId: event.id }), // Include userId in request body
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to cancel RSVP');
            }
            return response.json(); // Parse response
        })
        .then(() => {
            handleCancelRSVP(event); // Update parent state
            setSuccessMessage(`RSVP canceled for ${event.title}`); // Set success message
            setError(null); // Clear errors
        })
        .catch((error) => {
            setError(error.message); // Set error message
            setSuccessMessage(''); // Clear success message on error
        })
        .finally(() => {
            setLoading(false); // Stop loading
        });
    };

    // Optional: Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(''); // Clear success message after 3 seconds
            }, 3000);
            return () => clearTimeout(timer); // Cleanup timer on unmount
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
