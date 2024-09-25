// src/components/FormInputComponents.js
import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
    label,
    type = 'text',
    name,
    value = '',
    onChange,
    placeholder = '',
    error = '',
    disabled = false
}) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                type={type}
                name={name}
                defaultValue={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                disabled={disabled}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

FormInput.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    disabled: PropTypes.bool
};

export default FormInput;
