import React from 'react';
import PropTypes from "prop-types";

const TableComponents = ({headers, children}) => {
    return (
        <table className="table table-bordered table-hover" style={{marginTop: '18px'}}>
            <thead>
            <tr>
                {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {children}
            </tbody>
        </table>
    );
};

TableComponents.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired
};

export default TableComponents;