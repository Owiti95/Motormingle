import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import carShowImage from "../assets/carshow.png";
import luxuryCarShowImage from "../assets/luxurycarshow.webp";
import vintageAutoFairImage from "../assets/vintagecars.webp";
import customCarShowImage from "../assets/customcarshow.jpg";
import electricVehicleShowImage from "../assets/electricvehicleshow.webp";
import "../index.css";
import NavBar from "./NavBar";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Simulated events data
        const mockEvents = [
          {
            id: 1,
            title: "Car Show 2024",
            date_of_event: "2024-10-21",
            time_of_event: "10:00 AM",
            location: "Downtown",
            image_url: carShowImage,
            category: "Classic Car Shows",
            total_tickets: 50,
            booked_tickets: 20,
          },
          {
            id: 2,
            title: "Luxury Car Show",
            date_of_event: "2024-11-05",
            time_of_event: "1:00 PM",
            location: "City Park",
            image_url: luxuryCarShowImage,
            category: "Luxury Car Shows",
            total_tickets: 50,
            booked_tickets: 50,
          },
          {
            id: 3,
            title: "Vintage Auto Fair",
            date_of_event: "2024-11-20",
            time_of_event: "9:00 AM",
            location: "Fairgrounds",
            image_url: vintageAutoFairImage,
            category: "Vintage Car Shows",
            total_tickets: 50,
            booked_tickets: 10,
          },
          {
            id: 4,
            title: "Custom and Modified Car Show",
            date_of_event: "2024-12-10",
            time_of_event: "11:00 AM",
            location: "Exhibition Center",
            image_url: customCarShowImage,
            category: "Custom Car Shows",
            total_tickets: 50,
            booked_tickets: 25,
          },
          {
            id: 5,
            title: "Electric Vehicle Show",
            date_of_event: "2024-12-15",
            time_of_event: "10:00 AM",
            location: "Tech Expo",
            image_url: electricVehicleShowImage,
            category: "Electric Vehicle Shows",
            total_tickets: 50,
            booked_tickets: 50,
          },
        ];

        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        event.category.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <div className="home">
        <h1>MotorMingle</h1>
      </div>
      <NavBar />
      <input
        type="text"
        placeholder="Search by name or category"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="event-cards">
        {filteredEvents.map((event) => {
          const remainingTickets = event.total_tickets - event.booked_tickets;
          return (
            <div key={event.id} className="event-card">
              <img
                src={event.image_url}
                alt={event.title}
                className="event-image"
              />
              <h3>
                <Link to={`/events/${event.id}`}>{event.title}</Link>
              </h3>
              <p>
                <strong>Date:</strong> {event.date_of_event}
              </p>
              <p>
                <strong>Time:</strong> {event.time_of_event}
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
              <p>
                {remainingTickets > 0
                  ? "Tickets Available"
                  : "Tickets Sold Out"}
              </p>
              <Link to={`/events/${event.id}`} className="booking-button">
                Book Now
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventList;
