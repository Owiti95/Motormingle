import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'; // Import format from date-fns


const EventList = () => {
    const [events, setEvents] = useState([]); // Stores event data
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [error, setError] = useState(null); // Handles any errors that occur
    const [searchTerm, setSearchTerm] = useState(''); // Stores the user's search input
    const [filteredEvents, setFilteredEvents] = useState([]); // Stores the filtered events based on the search

    // Fetch events from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true); // Set loading to true while fetching data
            try {
                // Fetch events from your backend API
                const response = await fetch('http://127.0.0.1:5555/events'); // Adjust the endpoint based on your backend route
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const eventData = await response.json(); // Assuming the response is JSON
                setEvents(eventData); // Set events with real data
                setFilteredEvents(eventData); // Set filtered events for displaying
            } catch (err) {
                setError(err.message); // Capture any errors during fetching
            } finally {
                setLoading(false); // Stop loading after fetching is complete
            }
        };

        fetchEvents(); // Fetch event data when the component mounts
    }, []);

    // Handle search input by filtering events based on title or category
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = events.filter(event =>
            event.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
            (event.category && event.category.toLowerCase().includes(e.target.value.toLowerCase()))
        );
        setFilteredEvents(filtered); // Update filtered events to show search results
    };

    if (loading) return <div className="loading">Loading events...</div>; // Display loading message while fetching
    if (error) return <div className="error">Error: {error}</div>; // Display error if fetching fails

    return (
        <div>
            <h2>Event List</h2>
            <input
                type="text"
                placeholder="Search by name or category"
                value={searchTerm}
                onChange={handleSearch}
                className="search-bar"
            />
            <div className="event-cards">
                {filteredEvents.map(event => {
                    return (
                        <div key={event.id} className="event-card">
                            {/* Display event details */}
                            <img src={event.image_url} alt={event.title} className="event-image" />
                            <h3>
                                <p><strong>{event.title}</strong></p>
                            </h3>
                            <p><strong>Date:</strong> {format(new Date(event.date_of_event), 'MMMM dd, yyyy')}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            {/* Link to Event Details page */}
                            <Link to={`/events/${event.id}`} className="rsvp-button">Book Now</Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventList;
