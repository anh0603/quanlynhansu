import React from 'react';
import { Button } from 'react-bootstrap';

const SearchComponent = () => {
    return (
        <>
            <div
                className="d-flex col-md-6 align-items-center justify-content-end gap-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    aria-label="Search input"
                />
                <Button variant="light" size="">
                    <i className="bi bi-search"></i>
                </Button>
            </div>
        </>
    );
};

export default SearchComponent;