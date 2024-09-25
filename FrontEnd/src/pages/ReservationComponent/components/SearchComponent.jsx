import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";

const SearchComponent = ({ setSearchTerm }) => {
  ///
  const [input, setInput] = useState("");

  const handleSearch = () => {
    setSearchTerm(input);
  };
  /////
  return (
    <div className="d-flex w-25 align-items-center gap-2">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        aria-label="Search input"
        //
        value={input}
        onChange={(e) => setInput(e.target.value)}
        //
      />
      <Button variant="light" size="sm" onClick={handleSearch}>
        <i className="bi bi-search"></i>
      </Button>
    </div>
  );
};

export default SearchComponent;
