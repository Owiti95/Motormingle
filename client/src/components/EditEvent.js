import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
  const history = useHistory();
  const [eventData, setEventData] = useState({
    title: "",
    location: "",
    date_of_event: "",
    image_url: "",
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
      await axios.put(`/admin/dashboard/event/${id}`, eventData); // Update the event
      history.push("/admin/dashboard"); // Redirect after successful update
    } catch (err) {
      setError("Failed to update event.");
    }
  };

  return (
    <div className="edit-event">
      <h1>Edit Event</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date_of_event"
            value={eventData.date_of_event}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image_url"
            value={eventData.image_url}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;