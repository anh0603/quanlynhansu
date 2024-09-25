import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import ButtonComponents from "../../../../components/ButtonComponents";

const ImportButton = ({ onImport }) => {
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const rows = text.trim().split('\n').slice(1);
                const importedData = rows.map(row => {
                    const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(value => value.replace(/^"|"$/g, ''));  // Properly handle quoted fields
                    return {
                        id: Number(values[0]),
                        employee_id: Number(values[1]),
                        employee_name: values[2],

                        status: values[3]

                    };
                });
                onImport(importedData);
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            <ButtonComponents className="btn-success" onClick={() => document.getElementById('fileInput').click()}>
                <i className="fas fa-file-excel"></i>
            </ButtonComponents>
            <input type="file" id="fileInput" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
        </>
    );
};

ImportButton.propTypes = {
    onImport: PropTypes.func.isRequired,
};

export default ImportButton;