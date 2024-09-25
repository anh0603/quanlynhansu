// src/components/TableBodyComponents.js
import PropTypes from 'prop-types';
import React from 'react';

const TableBodyComponents = ({ rows }) => {
    const handleActionClick = (action, item) => {
        if (action.onClick) {
            action.onClick(item);
        }
    };
    return (
        <>
            {rows && rows.length > 0 ? (
                rows.map((row, index) => (
                    <tr key={index}>
                        {row.data && row.data.length > 0 ? (
                            row.data.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))
                        ) : (
                            <td colSpan={row.actions ? row.actions.length : 1}>No data available</td>
                        )}

                        <td>
                            {row.actions && row.actions.length > 0 ? (
                                row.actions.map((action, actionIndex) => (
                                    <button
                                        type="button"
                                        className={`btn ${action.className}`}
                                        key={actionIndex}
                                        onClick={() => handleActionClick(action, row)}
                                    >
                                        <i className={`fas ${action.icon}`}></i>
                                    </button>
                                ))
                            ) : (
                                <span>No actions available</span>
                            )}
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="100%">No rows available</td>
                </tr>
            )}

        </>
    );
};

TableBodyComponents.propTypes = {
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            data: PropTypes.arrayOf(
                PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object // Cập nhật điều này để phản ánh các loại thực tế
                ])
            ).isRequired,
            actions: PropTypes.arrayOf(
                PropTypes.shape({
                    className: PropTypes.string.isRequired,
                    icon: PropTypes.string.isRequired,
                    onClick: PropTypes.func // Xử lý sự kiện nhấp chuột
                })
            ).isRequired
        })
    ).isRequired
};

export default TableBodyComponents;
