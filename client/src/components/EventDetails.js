import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { format } from 'date-fns';

const EventDetail = () => {
    const { id } = useParams(); // Get the event ID from the URL
    const [event, setEvent] = useState(null); // State for storing event details
    const [userData, setUserData] = useState(null); // State for storing user data
    const [bookingConfirmation, setBookingConfirmation] = useState(''); // Confirmation message for booking
    const [error, setError] = useState(null); // State for error handling
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [categories, setCategories] = useState([]); // State for storing categories
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
    const history = useHistory(); // Hook for programmatic navigation

    useEffect(() => {
        // Fetch event details
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/events/${id}`); 
                if (!response.ok) throw new Error('Event not found');
                const eventData = await response.json();
                setEvent(eventData); // Set event data to state
            } catch (err) {
                setError(err.message); // Set error message if fetching fails
            } finally {
                setLoading(false); // Stop loading after fetching
            }
        };

        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/users`);
                if (!response.ok) throw new Error('User not authenticated');
                const userData = await response.json();
                setUserData(userData); // Set user data to state
            } catch (err) {
                setError(err.message); // Set error message if fetching fails
            }
        };

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/categories'); 
                if (!response.ok) throw new Error('Categories not found');
                const categoryData = await response.json();
                setCategories(categoryData); // Set categories to state
            } catch (err) {
                setError(err.message); // Set error message if fetching fails
            }
        };

        fetchEvent(); // Fetch event details
        fetchUserData(); // Fetch user data
        fetchCategories(); // Fetch categories
    }, [id]);

    // Handle RSVP booking
    const handleBooking = async () => {
        // Check if user data is available
        if (!userData) {
            setError('User information is required for RSVP.');
            return;
        }

        // Calculate remaining tickets
        const remainingTickets = event.available_tickets;
        if (remainingTickets <= 0) {
            setError('No available tickets to book.');
            return;
        }

        // Make the API call to RSVP
        try {
            const response = await fetch(`http://127.0.0.1:5555/events/${id}/rsvps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userData.id, status: 'Attending' }), // Include user ID and status
            });

            if (!response.ok) throw new Error('Failed to RSVP');

            // Update confirmation message
            setBookingConfirmation(`RSVP confirmed for ${userData.name} (ID: ${userData.id}) in category ${selectedCategory}`);
            setError(null);

            // Update event state with new ticket counts
            setEvent(prevEvent => ({
                ...prevEvent,
                booked_tickets: prevEvent.booked_tickets + 1, // Increment booked tickets
                available_tickets: prevEvent.available_tickets - 1, // Decrement available tickets
            }));

            // Redirect to "My Events" after successful RSVP
            setTimeout(() => {
                history.push('/myevents');
            }, 4000);
        } catch (err) {
            setError(err.message); // Set error message if RSVP fails
        }
    };

    // Loading and error handling
    if (loading) return <div className="loading">Loading event details...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="event-detail">
            <h2>{event.title}</h2>
            <img src={event.image_url} alt={event.title} className="event-image" />
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {format(new Date(event.date_of_event), 'MMMM dd, yyyy')}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Booked Tickets:</strong> {event.booked_tickets}</p>
            <p><strong>Available Tickets:</strong> {event.available_tickets || 0}</p>

            {/* Conditional rendering based on available tickets */}
            {event.available_tickets > 0 ? (
                <>
                    <div>
                        <label htmlFor="category-select"><strong>Select a Category:</strong></label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category
                        >
                            <option value="">--Choose a category--</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleBooking} className="booking-button">RSVP Now</button>
                    {bookingConfirmation && <p className="booking-confirmation">{bookingConfirmation}</p>} {/* Show confirmation */}
                </>
            ) : (
                <p>Tickets Sold Out</p>
            )}

            <Link to="/" className="back-to-events">Back to Events</Link>
        </div>
    );
};

export default EventDetail;
