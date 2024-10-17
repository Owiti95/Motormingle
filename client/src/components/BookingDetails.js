// import React from 'react';
// import { useParams, Link } from 'react-router-dom';

// const BookingDetails = () => {
//     const { id } = useParams();

//     return (
//         <div className="booking-details">
//             <h2>Booking Details for Event ID: {id}</h2>
//             <p>Here you can add your booking form or details.</p>
//             {/* You can add more booking-related fields here */}
            
//             <Link to={`/events/${id}`} className="back-to-event">Back to Event</Link>
//         </div>
//     );
// };

// export default BookingDetails;

// import React from 'react';
// import { useParams, Link } from 'react-router-dom';

// const BookingDetails = () => {
//     const { id } = useParams();

//     // Mock event data for booking
//     const mockEventData = {
//         1: { title: 'Car Show 2024', date_of_event: '2024-06-01' },
//         2: { title: 'Luxury Car Show', date_of_event: '2024-07-15' },
//         3: { title: 'Vintage Auto Fair', date_of_event: '2024-08-20' },
//         // Add more events as needed
//     };

//     const event = mockEventData[id];

//     if (!event) return <div>Event not found</div>;

//     return (
//         <div className="booking-details">
//             <h2>Booking Details for {event.title}</h2>
//             <p>Date of Event: {event.date_of_event}</p>
//             <p>Please confirm your booking below:</p>
//             {/* Add booking form or details here */}
//             <Link to="/events" className="back-to-events">Back to Events</Link>
//         </div>
//     );
// };

// export default BookingDetails;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns'; // Import date-fns for formatting

const BookingDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [bookingConfirmation, setBookingConfirmation] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [participantName, setParticipantName] = useState('');
    const [participantId, setParticipantId] = useState('');

    const mockEventData = {
        1: { title: 'Car Show 2024', date_of_event: '2024-10-21', time_of_event: '10:00 AM', location: 'Downtown', total_tickets: 50, booked_tickets: 20 },
        2: { title: 'Luxury Car Show', date_of_event: '2024-11-05', time_of_event: '1:00 PM', location: 'City Park', total_tickets: 50, booked_tickets: 50 },
        3: { title: 'Vintage Auto Fair', date_of_event: '2024-11-20', time_of_event: '9:00 AM', location: 'Fairgrounds', total_tickets: 50, booked_tickets: 10 },
        // Add other events as needed
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = mockEventData[id];
                if (!eventData) throw new Error('Event not found');
                setEvent(eventData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleBooking = () => {
        if (participantName && participantId) {
            setBookingConfirmation(`Booking confirmed for ${participantName} (ID: ${participantId})`);
            // Reset fields
            setParticipantName('');
            setParticipantId('');
        } else {
            setError('Please provide participant name and ID.');
        }
    };

    if (loading) return <div className="loading">Loading event details...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="booking-detail">
            <h2>Booking Details for {event.title}</h2>
            <p><strong>Date of Event:</strong> {format(new Date(event.date_of_event), 'MMMM dd, yyyy')}</p>
            <p><strong>Time:</strong> {event.time_of_event}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Total Tickets:</strong> {event.total_tickets}</p>
            <p><strong>Booked Tickets:</strong> {event.booked_tickets}</p>

            <h3>Please confirm your booking below:</h3>
            <input
                type="text"
                placeholder="Participant Name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Participant ID"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
            />
            <button onClick={handleBooking} className="rsvp-button">RSVP</button>
            {bookingConfirmation && <p className="booking-confirmation">{bookingConfirmation}</p>}
            {error && <p className="error">{error}</p>}

            <Link to="/events" className="back-to-events">Back to Events</Link>
        </div>
    );
};

export default BookingDetail;

