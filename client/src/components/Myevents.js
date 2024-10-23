import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from './UserContext'; // Import UserContext

const MyEvents = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(UserContext); // Get current user from context

    // Fetch RSVPed events on component mount
    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const response = await fetch('/events/my-rsvps', {
                    credentials: "include", // Ensure cookies are sent with the request
                });
                if (!response.ok) throw new Error("Failed to fetch my events.");
                const data = await response.json();
                setMyEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, []);

    // Handle canceling RSVP
    const handleCancelRSVP = async (eventId) => {
        try {
            const response = await fetch(`/events/${eventId}/rsvps`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                // Remove canceled event from state
                setMyEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
                alert('RSVP canceled successfully');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Failed to cancel RSVP', error);
            alert('Failed to cancel RSVP');
        }
    };

    // Show loading or error messages if applicable
    if (loading) return <div className="loading">Loading your events...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="my-events">
            <h1>Your RSVPed Events</h1>
            {myEvents.length === 0 ? (
                <p>You have not RSVPed to any events.</p>
            ) : (
                myEvents.map((event) => (
                    <div key={event.id} className="event-card">
                        <h2>{event.title}</h2>
                        <p>Date: {new Date(event.date_of_event).toLocaleDateString()}</p>
                        <p>Location: {event.location}</p>
                        <button onClick={() => handleCancelRSVP(event.id)} className="cancel-rsvp-button">
                            Cancel RSVP
                        </button>
                    </div>
                ))
            )}
            <Link to="/" className="back-to-events">Back to Events</Link>
        </div>
    );
};

export default MyEvents;
