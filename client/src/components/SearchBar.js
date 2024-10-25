// src/components/SearchBar.js
import React, { useState } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Implement filtering logic based on searchTerm
  };

  return (
    <input
      type="text"
      placeholder="Search for events..."
      value={searchTerm}
      onChange={handleSearch}
      className="search-bar"
    />
  );
};

export default SearchBar;
