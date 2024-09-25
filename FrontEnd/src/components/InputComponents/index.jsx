// src/components/Input.js
import React from 'react';
import PropTypes from 'prop-types';
import './InputComponents.scss';

const InputComponents = ({
                             type = 'text',
                             name,
                             value,
                             onChange,
                             placeholder = '',
                             icon,
                             onIconClick,
                             disabled = false
                         }) => {
    return (
        <div className="input-group">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="form-control"
                disabled={disabled}
            />
            {icon && (
                <span className="input-group-text" onClick={onIconClick} style={{cursor: 'pointer'}}>
                    {icon}
                </span>
            )}
        </div>
    );
};

InputComponents.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    icon: PropTypes.node, // thêm prop icon để nhận component React
    onIconClick: PropTypes.func, // thêm prop onIconClick để nhận hàm xử lý sự kiện
    disabled: PropTypes.bool // Thêm sự kiện disabled
};

// Example :
// return (
//     <InputComponents
//         type="text"
//         name="username"
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         placeholder="Enter your username"
//         icon={<FontAwesomeIcon icon={faUser} />}
//     />
// );

export default InputComponents;
