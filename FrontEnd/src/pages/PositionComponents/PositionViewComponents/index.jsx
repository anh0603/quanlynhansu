// src/components/ViewpositionModal.js
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const PositionViewComponents = ({show, handleClose, position}) => {
    if (!position) return null;

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết chức vụ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>ID chức vụ</label>
                    <input
                        type="text"
                        className="form-control"
                        value={position.id}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Tên Chức Vụ</label>
                    <input
                        type="text"
                        className="form-control"
                        value={position.positionName}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Loại Phòng Ban</label>
                    <input
                        type="text"
                        className="form-control"
                        value={position.departmentName}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Ngày tạo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={position.createdAt ? new Date(position.createdAt).toISOString().split('T')[0] : ''}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Ngày sửa</label>
                    <input
                        type="text"
                        className="form-control"
                        value={position.updatedAt ? new Date(position.updatedAt).toISOString().split('T')[0] : ''}
                        disabled
                    />
                </div>
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PositionViewComponents;
