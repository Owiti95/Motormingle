import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateEvent = ({ onEventCreated }) => {
  const [title, setTitle] = useState("");
  const [date_of_event, setDateOfEvent] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [categories, setCategories] = useState([]); // State to hold categories
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5555/categories"); // Adjust the API endpoint accordingly
        setCategories(response.data);
      } catch (error) {
        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state

    const newEvent = {
      title,
      date_of_event,
      location,
      description,
      category_id,
    };

    try {
      const response = await axios.post("/admin/events", newEvent);
      onEventCreated((prevEvents) => [...prevEvents, response.data]);
      setTitle("");
      setDateOfEvent("");
      setLocation("");
      setDescription("");
      setCategoryId("");
      setError("");
      setSuccessMessage("Event created successfully!"); // Success message
    } catch (error) {
      setError("Failed to create event. Please check the fields.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

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
        <label>Category:</label>
        <select
          value={category_id}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
};

export default CreateEvent;
