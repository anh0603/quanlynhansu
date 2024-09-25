import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmComponent = ({ show, onHide, handleDelete }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận xoá</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc chắn muốn xoá không?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Huỷ bỏ
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Xoá
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmComponent;
