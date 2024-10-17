import React, { useEffect, useState } from 'react';

const EventList = () => {
    const [events, setEvents] = useState([]); // State for event list
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true); // Set loading state
            try {
                const response = await fetch('/api/events');
                if (!response.ok) throw new Error('Failed to fetch events'); // Error handling
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError(err.message); // Capture error message
            } finally {
                setLoading(false); // Reset loading state
            }
        };

        fetchEvents(); // Fetch events
    }, []);

    if (loading) return <div>Loading events...</div>; // Loading message
    if (error) return <div>Error: {error}</div>; // Error message

    return (
        <div>
            <h2>Events</h2>
            {events.length === 0 ? (
                <p>No events available. Please check back later.</p> // Empty state message
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            <a href={`/events/${event.id}`}>{event.title}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EventList;