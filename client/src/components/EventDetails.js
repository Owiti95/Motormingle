import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import carShowImage from "../assets/carshow.png";
import luxuryCarShowImage from "../assets/luxurycarshow.webp";
import vintageAutoFairImage from "../assets/vintagecars.webp";
import customCarShowImage from "../assets/customcarshow.jpg";
import electricVehicleShowImage from "../assets/electricvehicleshow.webp";
import "../index.css";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantName, setParticipantName] = useState("");
  const [participantId, setParticipantId] = useState("");

  const mockEventData = {
    1: {
      title: "Car Show 2024",
      description: "A grand car show for all car enthusiasts.",
      date_of_event: "2024-10-21",
      time_of_event: "10:00 AM",
      location: "Downtown",
      image_url: carShowImage,
      category: "Classic Car Shows",
      average_rating: 4.5,
      total_tickets: 50,
      booked_tickets: 20,
    },
    2: {
      title: "Luxury Car Show",
      description: "Explore the latest luxury vehicles.",
      date_of_event: "2024-11-05",
      time_of_event: "1:00 PM",
      location: "City Park",
      image_url: luxuryCarShowImage,
      category: "Luxury Car Shows",
      average_rating: 4.7,
      total_tickets: 50,
      booked_tickets: 40,
    },
    3: {
      title: "Vintage Auto Fair",
      description: "Explore classic cars at the Vintage Auto Fair.",
      date_of_event: "2024-11-20",
      time_of_event: "9:00 AM",
      location: "Fairgrounds",
      image_url: vintageAutoFairImage,
      category: "Vintage Car Shows",
      average_rating: 4.8,
      total_tickets: 50,
      booked_tickets: 10,
    },
    4: {
      title: "Custom and Modified Car Show",
      description: "Showcasing the best in custom and modified vehicles.",
      date_of_event: "2024-12-10",
      time_of_event: "11:00 AM",
      location: "Exhibition Center",
      image_url: customCarShowImage,
      category: "Custom and Modified Car Shows",
      average_rating: 4.6,
      total_tickets: 50,
      booked_tickets: 25,
    },
    5: {
      title: "Electric Vehicle Show",
      description: "Discover the future of driving with electric vehicles.",
      date_of_event: "2024-12-15",
      time_of_event: "10:00 AM",
      location: "Tech Expo",
      image_url: electricVehicleShowImage,
      category: "Electric Vehicle Shows",
      average_rating: 4.9,
      total_tickets: 50,
      booked_tickets: 35,
    },
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
    if (!participantName || !participantId) {
      setError("Please provide participant name and ID.");
      return;
    }

    const remainingTickets = event.total_tickets - event.booked_tickets;
    if (remainingTickets <= 0) {
      setError("No available tickets to book.");
      return;
    }

    setBookingConfirmation(
      `Booking confirmed for ${participantName} (ID: ${participantId})`
    );
    setParticipantName("");
    setParticipantId("");
    setError(null); // Reset error after successful booking
  };

  if (loading)
    return (
      <div className="loading" aria-live="polite">
        Loading event details...
      </div>
    );
  if (error)
    return (
      <div className="error" aria-live="assertive">
        Error: {error}
      </div>
    );

  const remainingTickets = event.total_tickets - event.booked_tickets;

  return (
    <div className="event-detail">
      <h2>{event.title}</h2>
      <img
        src={event.image_url}
        alt={event.title}
        className="event-image"
        loading="lazy"
      />
      <p>
        <strong>Category:</strong> {event.category}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {format(new Date(event.date_of_event), "MMMM dd, yyyy")}
      </p>
      <p>
        <strong>Time:</strong> {event.time_of_event}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      <p>
        <strong>Average Rating:</strong> {event.average_rating}
      </p>
      <p>
        <strong>Total Tickets:</strong> {event.total_tickets}
      </p>
      <p>
        <strong>Booked Tickets:</strong> {event.booked_tickets}
      </p>
      <p>
        <strong>Available Tickets:</strong> {remainingTickets}
      </p>

      {remainingTickets > 0 ? (
        <>
          <h3>Book Your Ticket</h3>
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
          <button onClick={handleBooking} className="booking-button">
            Book Now
          </button>
          {bookingConfirmation && (
            <p className="booking-confirmation">{bookingConfirmation}</p>
          )}
        </>
      ) : (
        <p>Tickets Sold Out</p>
      )}

      <Link to="/events" className="back-to-events">
        Back to Events
      </Link>
    </div>
  );
};

export default EventDetail;
