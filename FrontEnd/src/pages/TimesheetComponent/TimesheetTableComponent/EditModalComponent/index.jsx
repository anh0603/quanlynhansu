import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const EditModal = ({ show, handleClose, timesheet, handleSave }) => {
    const [formData, setFormData] = useState({ ...timesheet });

    useEffect(() => {
        setFormData(timesheet);
    }, [timesheet]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        handleSave(formData); // Save changes
        handleClose(); // Close the modal
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Timesheet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="employee_id">
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="employee_name">
                        <Form.Label>Employee Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="employee_name"
                            value={formData.employee_name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

EditModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    timesheet: PropTypes.object.isRequired,
    handleSave: PropTypes.func.isRequired,
};

export default EditModal;