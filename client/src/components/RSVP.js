import React, { useState } from "react";
import axios from "axios";

const RSVP = ({ eventId }) => {
  const [status, setStatus] = useState("attending"); // or "not attending"
  const [error, setError] = useState("");

  const handleRSVP = async () => {
    try {
      const response = await axios.post(`https://server-ai40.onrender.com/events/${eventId}/rsvps`, { status });
      console.log("RSVP successful:", response.data);
    } catch (err) {
      setError(err.response.data.error || "RSVP failed.");
    }
  };

  return (
    <div>
      <button onClick={handleRSVP}>RSVP: {status}</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RSVP;
