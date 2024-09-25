import React from "react";
import { Button, Modal } from "react-bootstrap";
import useClassStore from "../useClassStore";

const ModalDelete = () => {
  const showModalDelete = useClassStore((state) => state.showModalDelete);
  const handleClose = useClassStore((state) => state.handleClose);
  const handleDelete = useClassStore((state) => state.handleDelete);
  const itemToDelete = useClassStore((state) => state.itemToDelete);

  return (
    <Modal show={showModalDelete} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xóa học viên có ID : {itemToDelete}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDelete;
