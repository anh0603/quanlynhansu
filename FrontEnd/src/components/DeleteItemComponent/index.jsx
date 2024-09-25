import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";

function DeleteComponent(props) {
    const { show, onHide, onConfirm, deleteItemID, apiDelete } = props;

    const handleDelete = () => {
        if (deleteItemID) {
            axios
                .delete(`${apiDelete}/${deleteItemID}`)
                .then(() => {
                    console.log(
                        "Delete Successful: " + JSON.stringify(deleteItemID)
                    );
                    toast.success(  "Xoá thành công!");
                    if (onConfirm) onConfirm(); // Call onConfirm to notify parent
                })
                .catch((error) => {
                    console.error("Error deleting item: ", error);
                    toast.error("Xoá đối tượng bị lỗi: ", error);

                })
                .finally(() => {
                    onHide(); // Close modal
                });
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận Xoá</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Bạn có chắc chắn muốn xoá không?</p>
                <p>Hành động này không thể hoàn tác.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Huỷ bỏ
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Xoá
                </Button>
            </Modal.Footer>
            <ToastContainer />
        </Modal>

    );
}

export default DeleteComponent;
