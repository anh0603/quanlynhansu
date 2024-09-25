import React, {useState} from 'react';
import InputComponents from "../InputComponents";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

const SearchComponents = ({onSearch, placeholder = "Search..."}) => { // Thêm prop placeholder
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        const searchValue = searchTerm.toLowerCase();
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    return (
        <div className="d-flex align-items-center">
            <InputComponents
                type="text"
                name="search"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder={placeholder} // Truyền prop placeholder vào InputComponents
                icon={<FontAwesomeIcon icon={faSearch}/>}
                onIconClick={handleSearchClick}
            />
        </div>
    );
};

export default SearchComponents;
