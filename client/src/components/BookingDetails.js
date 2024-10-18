import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns"; // Import date-fns for formatting dates

const BookingDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantName, setParticipantName] = useState("");
  const [participantId, setParticipantId] = useState("");

  // Mock event data to simulate API call
  const mockEventData = {
    1: {
      title: "Car Show 2024",
      date_of_event: "2024-10-21",
      time_of_event: "10:00 AM",
      location: "Downtown",
      total_tickets: 50,
      booked_tickets: 20,
    },
    2: {
      title: "Luxury Car Show",
      date_of_event: "2024-11-05",
      time_of_event: "1:00 PM",
      location: "City Park",
      total_tickets: 50,
      booked_tickets: 50,
    },
    3: {
      title: "Vintage Auto Fair",
      date_of_event: "2024-11-20",
      time_of_event: "9:00 AM",
      location: "Fairgrounds",
      total_tickets: 50,
      booked_tickets: 10,
    },
    // Add more events as needed
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = mockEventData[id];
        if (!eventData) throw new Error("Event not found");
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
      setBookingConfirmation(
        `Booking confirmed for ${participantName} (ID: ${participantId})`
      );
      // Reset input fields after confirmation
      setParticipantName("");
      setParticipantId("");
    } else {
      setError("Please provide both participant name and ID.");
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="booking-detail">
      <h2>Booking Details for {event.title}</h2>
      <p>
        <strong>Date of Event:</strong>{" "}
        {format(new Date(event.date_of_event), "MMMM dd, yyyy")}
      </p>
      <p>
        <strong>Time:</strong> {event.time_of_event}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Total Tickets:</strong> {event.total_tickets}
      </p>
      <p>
        <strong>Booked Tickets:</strong> {event.booked_tickets}
      </p>

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
      <button onClick={handleBooking} className="rsvp-button">
        RSVP
      </button>

      {bookingConfirmation && (
        <p className="booking-confirmation">{bookingConfirmation}</p>
      )}
      {error && <p className="error">{error}</p>}

      <Link to="/events" className="back-to-events">
        Back to Events
      </Link>
    </div>
  );
};

export default BookingDetail;
