import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { getConfigInput } from "../constants";
import useClassStore from "../useClassStore";

const ModalCommon = () => {
  const modeModal = useClassStore((state) => state.modeModal);
  const showModalCommon = useClassStore((state) => state.showModalCommon);
  const handleClose = useClassStore((state) => state.handleClose);
  const configInput = getConfigInput(modeModal);
  const dataRow = useClassStore((state) => state.dataRow);

  const [formData, setFormData] = useState(dataRow);

  useEffect(() => {
    setFormData(dataRow);
  }, [dataRow]);

  return (
    <Modal show={showModalCommon} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modeModal ? "Cập nhật thông tin lớp học" : "Thêm mới lớp học"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {configInput.map((item) => (
            <Form.Group className="mb-3" key={item.name}>
              <Form.Label>{item.label}</Form.Label>
              {modeModal ? (
                <Form.Control
                  name={item.name}
                  type={item.type}
                  placeholder={item.placeholder}
                  disabled={item.disabled}
                  value={formData[item.name] || ""}
                />
              ) : (
                <Form.Control
                  name={item.name}
                  type={item.type}
                  placeholder={item.placeholder}
                  disabled={item.disabled}
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>

        <Button
          variant="primary"
          // onClick={handleUpdate}
        >
          {modeModal ? " Cập nhật" : "Thêm mới"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCommon;
