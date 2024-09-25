import { Button, Form, Modal } from "react-bootstrap";
import { getConfigInput } from "../constants";
import useClassStore from "../useClassStore";

const ModalCommon = () => {
  const mode = useClassStore((state) => state.mode);
  const showModalCommon = useClassStore((state) => state.showModalCommon);
  const handleClose = useClassStore((state) => state.handleClose);
  const configInput = getConfigInput(mode);

  return (
    <Modal show={showModalCommon} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode ? "Chi tiết lớp học" : "Cập nhật thông tin lớp học"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {configInput.map((item) => (
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
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        {mode ? (
          ""
        ) : (
          <Button variant="primary" onClick={handleClose}>
            Cập nhật
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCommon;
