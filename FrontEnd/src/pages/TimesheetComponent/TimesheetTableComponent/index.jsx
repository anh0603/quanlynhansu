import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ButtonComponents from '../../../components/ButtonComponents/index.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import TableComponent from '../../../components/TableComponents/index.jsx';
import CheckinButton from './CheckinButtonComponent/index.jsx';
import EditModal from './EditModalComponent/index.jsx';
import axios from 'axios';

const TimesheetTable = ({ timesheets = [], setTimesheets, onRowClick }) => {
    const headers = ['ID', 'Tên nhân viên', 'Trạng thái', 'Actions'];

    const [showModal, setShowModal] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    const handleEdit = (timesheet) => {
        setSelectedTimesheet(timesheet);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
            axios.delete(`https://66b19f8e1ca8ad33d4f4971e.mockapi.io/api/v1/timesheets/${id}`)
                .then(response => {
                    // Remove the deleted timesheet from the list
                    setTimesheets(prevTimesheets => prevTimesheets.filter(timesheet => timesheet.id !== id));
                    console.log('Xóa thành công:', response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi xóa:', error);
                });
        }
    };

    const handleSave = (updatedTimesheet) => {
        axios.put(`https://66b19f8e1ca8ad33d4f4971e.mockapi.io/api/v1/timesheets/${updatedTimesheet.id}`, updatedTimesheet)
            .then(response => {
                // Update the timesheet list with the updated timesheet
                setTimesheets(prevTimesheets =>
                    prevTimesheets.map(timesheet =>
                        timesheet.id === updatedTimesheet.id ? updatedTimesheet : timesheet
                    )
                );
                console.log('Update successful:', response.data);
            })
            .catch(error => {
                console.error('Error updating timesheet:', error);
            });
    };

    return (
        <>
            <TableComponent className="table-hover" headers={headers}>
                {timesheets.map((entry) => (
                    <tr key={entry.id}>
                        <td>{String(entry.id)}</td>
                        <td>{entry.employee_id}</td>
                        <td>{entry.employee_name}</td>
                        <td>{entry.status}</td>
                        <td>
                            <ButtonComponents className="btn btn-info btn-sm mr-2" onClick={() => handleEdit(entry)}>
                                <i className="bi bi-pencil"></i>
                            </ButtonComponents>
                            <button className="btn btn-danger btn-sm mr-2" onClick={() => handleDelete(entry.id)}>
                                <i className="bi bi-trash"></i>
                            </button>
                            <CheckinButton />
                        </td>
                    </tr>
                ))}
            </TableComponent>
            {selectedTimesheet && (
                <EditModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    timesheet={selectedTimesheet}
                    handleSave={handleSave}
                />
            )}
        </>
    );
};

TimesheetTable.propTypes = {
    timesheets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            employee_id: PropTypes.number.isRequired,
            employee_name: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ),
    setTimesheets: PropTypes.func.isRequired,
};

export default TimesheetTable;