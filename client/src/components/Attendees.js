import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Attendees = () => {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get(
          `/admin/dashboard/event/${eventId}/attendees`
        );
        setAttendees(response.data);
      } catch (err) {
        setError("Failed to load attendees.");
      }
    };

    fetchAttendees();
  }, [eventId]);

  return (
    <div className="attendees">
      <h1>Attendees for Event {eventId}</h1>
      {error && <p>{error}</p>}
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id}>
            {attendee.user_name} - Status: {attendee.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attendees;
