import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ConfirmationComponents = ({show, handleClose, onConfirm, message}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Không
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Có
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationComponents;

