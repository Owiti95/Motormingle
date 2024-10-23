import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { UserContext } from './UserContext'; // Import UserContext

const EventDetail = () => {
    const { id } = useParams(); // Get the event ID from URL parameters
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const history = useHistory();
    const { currentUser } = useContext(UserContext); // Get current user from context

    // Fetch event details and categories on component mount
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/events/${id}`, {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Event not found');
                const eventData = await response.json();
                setEvent(eventData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('/categories', {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Categories not found');
                const categoryData = await response.json();
                setCategories(categoryData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEvent();
        fetchCategories();
    }, [id]);

    // Handle RSVP booking
    const handleBooking = async () => {
        if (!currentUser) { // Check if user is logged in
            alert('You need to be logged in to RSVP.');
            history.push('/login');
            return;
        }

        if (!selectedCategory) { // Check if a category is selected
            alert('Please select a category.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/events/${event.id}/rsvps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: 'Attending', // RSVP status
                    eventId: event.id,
                    category: selectedCategory,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Update the number of tickets in the frontend state
                setEvent((prevEvent) => ({
                    ...prevEvent,
                    available_tickets: prevEvent.available_tickets - 1,
                    booked_tickets: prevEvent.booked_tickets + 1,
                }));

                // Display the welcome message
                const userName = currentUser?.name || currentUser?.email || "Guest"; // Fallback to email if name is not available
                alert(`Welcome ${userName}! ${data.message}`);

                history.push('/Myevents'); // Redirect to My Events
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (err) {
            setError('An error occurred during booking.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading or error messages if applicable
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

            {event.available_tickets > 0 ? (
                <>
                    <div>
                        <label htmlFor="category-select"><strong>Select a Category:</strong></label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">--Choose a category--</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <button onClick={handleBooking} className="booking-button">RSVP Now</button>
                </>
            ) : (
                <p>Tickets Sold Out</p>
            )}

            <Link to="/" className="back-to-events">Back to Events</Link>
        </div>
    );
};

export default EventDetail;
