import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { format } from 'date-fns';

const EventDetail = () => {
    const { id } = useParams(); // Get the event ID from the URL
    const [event, setEvent] = useState(null);
    const [userData, setUserData] = useState(null); // For actual user data
    const [bookingConfirmation, setBookingConfirmation] = useState(''); // Stores the confirmation message after booking
    const [error, setError] = useState(null); // Stores any errors that occur
    const [loading, setLoading] = useState(true); // Loading state while fetching data
    const [categories, setCategories] = useState([]); // Stores the categories fetched from the backend
    const [selectedCategory, setSelectedCategory] = useState(''); // Selected category for the dropdown
    const history = useHistory(); // To programmatically navigate to other pages

    useEffect(() => {
        // Fetch event details
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/events/${id}`); 
                if (!response.ok) throw new Error('Event not found');
                const eventData = await response.json();
                setEvent(eventData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/users`);
                if (!response.ok) throw new Error('User not authenticated');
                const userData = await response.json();
                setUserData(userData);
            } catch (err) {
                setError(err.message);
            }
        };

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/categories'); 
                if (!response.ok) throw new Error('Categories not found');
                const categoryData = await response.json();
                setCategories(categoryData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEvent();
        fetchUserData();
        fetchCategories();
    }, [id]);

    // Handle RSVP booking
    const handleBooking = () => {
        if (!userData) {
            setError('User information is required for RSVP.');
            return;
        }

        const remainingTickets = event.total_tickets - event.booked_tickets;
        if (remainingTickets <= 0) {
            setError('No available tickets to book.');
            return;
        }

        setBookingConfirmation(`RSVP confirmed for ${userData.name} (ID: ${userData.id}) in category ${selectedCategory}`);
        setError(null);

        setEvent(prevEvent => ({
            ...prevEvent,
            booked_tickets: prevEvent.booked_tickets + 1,
        }));

        // Redirect to "My Events" after successful RSVP
        setTimeout(() => {
            history.push('/myevents');
        }, 4000);
    };

    if (loading) return <div className="loading">Loading event details...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    const remainingTickets = event.total_tickets - event.booked_tickets;

    return (
        <div className="event-detail">
            <h2>{event.title}</h2>
            <img src={event.image_url} alt={event.title} className="event-image" />
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {format(new Date(event.date_of_event), 'MMMM dd, yyyy')}</p>
            <p><strong>Time:</strong> {event.time_of_event}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Average Rating:</strong> {event.average_rating}</p>
            <p><strong>Total Tickets:</strong> {event.total_tickets}</p>
            <p><strong>Booked Tickets:</strong> {event.booked_tickets}</p>
            <p><strong>Available Tickets:</strong> {remainingTickets}</p>

            {remainingTickets > 0 ? (
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
                    {bookingConfirmation && <p className="booking-confirmation">{bookingConfirmation}</p>}
                </>
            ) : (
                <p>Tickets Sold Out</p>
            )}

            <Link to="/" className="back-to-events">Back to Events</Link>
        </div>
    );
};

export default EventDetail;
