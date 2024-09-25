import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteExamModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận Xoá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xoá không?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Huỷ bỏ
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Xoá
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteExamModal;
