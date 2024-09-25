import React from 'react';

const SelectField = ({ label, value, onChange, options }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <select
                className="form-control"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
