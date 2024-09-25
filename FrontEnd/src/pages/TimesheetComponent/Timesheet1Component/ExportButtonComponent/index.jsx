import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import ButtonComponents from "../../../../components/ButtonComponents";

const ExportButton = ({ data, headers }) => {
    const handleExport = () => {
        const csvContent = [
            headers.map(header => `"${header}"`).join(','),  // Ensure headers are properly quoted
            ...data.map(row => [
                row.id,
                row.employee_id,
                row.employee_name,
                row.status,
                row.remarks
            ].map(value => `"${value}"`).join(','))  // Ensure values are properly quoted
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'timesheets.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ButtonComponents variant="secondary" className="btn-danger" onClick={handleExport}>
            <i className="fas fa-file-export"></i>
        </ButtonComponents>
    );
};

ExportButton.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        employee_id: PropTypes.number.isRequired,
        employee_name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        check_in_time: PropTypes.string.isRequired,
        check_out_time: PropTypes.string.isRequired,
        work_hours: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        remarks: PropTypes.string.isRequired,
    })).isRequired,
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ExportButton;