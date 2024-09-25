// src/components/EditPositionModal.js
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { fetchDepartment } from '../PositionService/positionService';

const PositionEditComponents = ({ show, handleClose, position, onSave }) => {
    const [formData, setFormData] = useState({
        positionName: '',
        departmentId: '',
        departmentName: '',
        status: 1,
        id: '',
    });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchDepartment().then(res => {
            setDepartments(res);
        })
    }, []);

    useEffect(() => {
        if (position) {
            setFormData({
                positionName: position.positionName || '',
                departmentName: position.departmentName || '',
                status: position.status || 0,
                id: position.id || '',
            });
        }
    }, [position]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = () => {
        const updatedPosition = {
            ...formData,
            id: position.id
        };
        console.log('Hợp đồng đã cập nhật:', updatedPosition);
        onSave(updatedPosition);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa Chức Vụ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>ID</label>
                    <input
                        type="text"
                        className="form-control"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Tên chức vụ</label>
                    <input
                        type="text"
                        className="form-control"
                        name="positionName"
                        value={formData.positionName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Phòng Ban</label>
                    <select
                        name="departmentName"
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option key="default" value="">---Chọn Phòng Ban---</option>
                        {
                            departments.map((item, index) => {
                                return <option key={item.id || index} value={item.departmentName} selected={item.departmentName === formData.departmentName}>{item.departmentName}</option>;
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                    </select>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Lưu thay đổi
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default PositionEditComponents;
