import React, { useState } from "react";
import axios from "axios";

const CreateEvent = ({ onEventCreated }) => {
  const [title, setTitle] = useState("");
  const [date_of_event, setDateOfEvent] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      date_of_event,
      location,
      description,
      category_id,
    };

    axios
      .post("/admin/events", newEvent)
      .then((response) => {
        onEventCreated((prevEvents) => [...prevEvents, response.data]);
        setTitle("");
        setDateOfEvent("");
        setLocation("");
        setDescription("");
        setCategoryId("");
        setError("");
      })
      .catch((error) => {
        setError("Failed to create event. Please check the fields.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}

      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date_of_event}
          onChange={(e) => setDateOfEvent(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Category ID:</label>
        <input
          type="number"
          value={category_id}
          onChange={(e) => setCategoryId(e.target.value)}
        />
      </div>

      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEvent;
