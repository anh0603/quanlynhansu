// src/components/Button.js
import React from "react";
import PropTypes from "prop-types";

const ButtonComponents = ({
  type = "button",
  className = "",
  onClick = () => {},
  children,
}) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

ButtonComponents.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};
export default ButtonComponents;
