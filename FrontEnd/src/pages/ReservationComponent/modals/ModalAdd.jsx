import { Button, Form, Modal } from "react-bootstrap";
import { getConfigInput } from "../constants";
import useClassStore from "../useClassStore";

const ModalAdd = () => {
  const mode = useClassStore((state) => state.mode);
  const showModalAdd = useClassStore((state) => state.showModalAdd);
  const handleClose = useClassStore((state) => state.handleClose);
  const configInput1 = getConfigInput(mode);

  return (
    <Modal show={showModalAdd} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm học viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form>
            {configInput1.map((item) => (
              <Form.Group className="mb-3">
                <Form.Label>{item.label}</Form.Label>
                <Form.Control
                  disabled={item.disabled}
                  placeholder={item.placeholder}
                  type={item.type}
                />
              </Form.Group>
            ))}
          </Form>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Thêm mới
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAdd;
