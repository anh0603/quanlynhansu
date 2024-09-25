import React from 'react';

const InputField = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="form-group ">
      <label>{label}</label>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;
