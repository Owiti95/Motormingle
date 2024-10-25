import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import "../index.css"; // Import your styles

const EditEvent = () => {
  const { id } = useParams();
  const history = useHistory();
  const [eventData, setEventData] = useState({
    title: "",
    location: "",
    date_of_event: "",
    time: "",
    image_url: "",
    available_tickets: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`/events/${id}`);
        setEventData(response.data);
      } catch (err) {
        setError("Failed to load event data.");
      }
    };

    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...eventData,
        available_tickets: parseInt(eventData.available_tickets, 10),
      };
      await axios.patch(`/admin/dashboard/event/${id}`, formattedData);
      history.push("/admin/dashboard");
    } catch (err) {
      setError("Failed to update event.");
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="edit-event-container">
      <h1>Edit Event</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-event-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date_of_event"
            value={eventData.date_of_event}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image_url"
            value={eventData.image_url}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Available Tickets:</label>
          <input
            type="number"
            name="available_tickets"
            value={eventData.available_tickets}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
