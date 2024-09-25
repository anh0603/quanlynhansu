import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const Timesheet2 = ({ onAddTimesheet }) => {
    const [show, setShow] = useState(false);
    const [id, setId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [status, setStatus] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTimesheet = {
            id,
            employee_id: employeeId,
            employee_name: employeeName,
            status
        };
        onAddTimesheet(newTimesheet);
        setId('');
        setEmployeeId('');
        setEmployeeName('');
        setStatus('');
        handleClose();
    };

    return (
        <>
            <Button className="btn-primary btn-xl mr-3" onClick={handleShow}>
                <i className="bi bi-plus bi-2xl"></i>

            </Button>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                    <Modal.Title>Add Timesheet </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="timesheet-form">
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="employeeId">Employee ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="employeeId"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="employeeName">Employee Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="employeeName"
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <input
                                type="text"
                                className="form-control"
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="submit-add-btn" variant="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Timesheet2;