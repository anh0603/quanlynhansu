import { Modal, Button } from "react-bootstrap";
import FormInput from "../FormInputComponents";
import { useState, useEffect } from "react";
const ModalExamComponent = ({
  show,
  handleClose,
  title,
  titleButton,
  action,
  examData = {},
  mode = "create", // create, view, edit
}) => {
  const [formData, setFormData] = useState({
    ma_mon: "",
    ma_lop: "",
    thoi_gian: "",
    link_bai_thi: "",
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp * 1000);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  useEffect(() => {
    if (examData) {
      setFormData({
        ma_mon: examData.ma_mon || "",
        ma_lop: examData.ma_lop || "",
        thoi_gian: examData.thoi_gian ? formatDate(examData.thoi_gian) : "",
        link_bai_thi: examData.link_bai_thi || "",
      });
    }
  }, [examData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAction = () => {
    if (action) action(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between">
          <FormInput
            label="Mã môn học"
            name="ma_mon"
            value={formData.ma_mon}
            onChange={handleChange}
            disabled={mode === "view"}
          />
          <FormInput
            label="Mã lớp học"
            name="ma_lop"
            value={formData.ma_lop}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <FormInput
          label="Thời gian"
          name="thoi_gian"
          type="date"
          value={formData.thoi_gian}
          onChange={handleChange}
          disabled={mode === "view"}
        />
        <FormInput
          label="Link bài thi"
          name="link_bai_thi"
          value={formData.link_bai_thi}
          onChange={handleChange}
          disabled={mode === "view"}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {mode !== "view" && (
          <Button variant="primary" onClick={handleAction}>
            {titleButton}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalExamComponent;
