import { Button } from "react-bootstrap";

const SearchComponent = () => {
  return (
    <div className="d-flex w-25 align-items-center gap-2">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        aria-label="Search input"
      />
      <Button variant="light" size="sm">
        <i className="bi bi-search"></i>
      </Button>
    </div>
  );
};

export default SearchComponent;
