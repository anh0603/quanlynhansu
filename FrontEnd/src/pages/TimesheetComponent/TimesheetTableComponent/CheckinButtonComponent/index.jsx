import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ButtonComponents from "../../../../components/ButtonComponents/index.jsx";
import axios from 'axios';

const CheckinButton = ({ timesheets }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        employee_name: timesheets,
        date: '',
        checkin_time: '',
        checkout_time: '',
        worked_hours: '',
        status: 'Active', // Default status
        note: ''
    });

    useEffect(() => {
        // Set employee_name to the constant value from timesheets
        setFormData((prevState) => ({
            ...prevState,
            employee_name: timesheets // Assuming timesheets is a string
        }));
    }, [timesheets]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const checkinTime = new Date(`${formData.date}T${formData.checkin_time}`);
        const checkoutTime = new Date(`${formData.date}T${formData.checkout_time}`);

        // Validate that checkout time is after check-in time
        if (checkoutTime <= checkinTime) {
            alert("Check-out time must be after check-in time.");
            return;
        }

        // Calculate worked hours (if needed)
        const workedHours = (checkoutTime - checkinTime) / (1000 * 60 * 60); // Convert milliseconds to hours
        setFormData((prevState) => ({
            ...prevState,
            worked_hours: workedHours.toFixed(2) // Round to 2 decimal places
        }));

        try {
            // Send the formData to the backend API
            const response = await axios.post(
                `https://66b19f8e1ca8ad33d4f4971e.mockapi.io/api/v1/timesheets`,
                {
                    ...formData,
                    worked_hours: workedHours.toFixed(2)
                }
            );

            if (response.status === 201) {
                // Data successfully posted
                console.log('Form data submitted successfully:', response.data);
                handleClose(); // Close the modal after successful submission
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            // Handle any errors that occurred during the POST request
            console.error('Error submitting form data:', error);
        }
    };

    return (
        <>
            <ButtonComponents className="btn-primary btn-sm mr-2" variant="primary" onClick={handleShow}>
                <i className="bi bi-calendar3"></i>
            </ButtonComponents>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Check In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="employeeName">
                            <Form.Label>Employee Name:</Form.Label>
                            <Form.Control
                                type="text"
                                name="employee_name"
                                value={formData.employee_name}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="date">
                                    <Form.Label>Date:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="status">
                                    <Form.Label>Status:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="checkinTime">
                                    <Form.Label>Check-in Time:</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="checkin_time"
                                        value={formData.checkin_time}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="checkoutTime">
                                    <Form.Label>Check-out Time:</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="checkout_time"
                                        value={formData.checkout_time}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="note">
                            <Form.Label>Note:</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                rows={3}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CheckinButton;