import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../index.css"; // Custom CSS for this page

const MyEvents = () => {
  const [rsvps, setRsvps] = useState([]);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchRsvps = async () => {
      const token = sessionStorage.getItem("token"); // Assuming you're using token-based auth

      try {
        const response = await axios.get("/events/my-rsvps", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRsvps(response.data);
      } catch (err) {
        setError("Failed to load RSVPs.");
      }
    };

    fetchRsvps();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!rsvps.length) {
    return <p>No RSVPs found.</p>;
  }

  return (
    <div className="my-events">
      <h1>My Events</h1>
      <ul>
        {rsvps.map((rsvp) => (
          <li key={rsvp.event_id}>
            <h2>{rsvp.event.title}</h2>
            <p>
              Date: {new Date(rsvp.event.date_of_event).toLocaleDateString()}
            </p>
            <p>Status: {rsvp.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyEvents;
