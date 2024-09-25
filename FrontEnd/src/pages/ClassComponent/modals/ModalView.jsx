import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TableNoActions from "../components/TableNoActions";
import useClassStore from "../useClassStore";

const ModalView = () => {
  const dataRow = useClassStore((state) => state.dataRow);
  const showModalView = useClassStore((state) => state.showModalView);
  const handleClose = useClassStore((state) => state.handleClose);
  const [formViewData, setFormViewData] = useState(dataRow);

  useEffect(() => {
    setFormViewData(dataRow);
  }, [dataRow]);

  return (
    <Modal show={showModalView} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin lớp học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between mb-3">
          <div>Tên lớp: {formViewData.name} </div>
          <div>Sĩ số: {formViewData.size}</div>
        </div>
        <TableNoActions />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalView;
