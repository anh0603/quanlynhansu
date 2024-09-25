// src/components/EditAllowanceModal.js
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { fetchPosition } from "../AllowanceService/allowanceService";

const AllowanceEditComponents = ({ show, handleClose, allowance, onSave }) => {

    const [positions, setPositions] = useState([]);

    useEffect(() => {
        fetchPosition().then((data) => {
            setPositions(data);
        })
    }, []);

    const [formData, setFormData] = useState({
        allowanceCategory: '',
        allowanceSalary: '',
        positionId: '',
        status: '',
        id: ''
    });

    useEffect(() => {
        if (allowance) {
            setFormData({
                allowanceCategory: allowance.allowanceCategory || '',
                allowanceSalary: allowance.allowanceSalary || '',
                positionId: allowance.positionId || '',
                status: allowance.status || 0,
                id: allowance.id || '',
            });

        }
    }, [allowance]);

    // Perform formData update when there is a change in the input form
    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleSave = () => {
        const updatedAllowance = {
            ...formData,
            id: allowance.id
        };
        console.log('Phụ cấp đã cập nhật:', updatedAllowance); // Kiểm tra dữ liệu đã cập nhật
        onSave(updatedAllowance);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa Phụ cấp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>ID Phụ cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        name="id"
                        value={formData.id}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Tên Loại Phụ cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        name="allowanceCategory"
                        value={formData.allowanceCategory}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Lương Phụ cấp</label>
                    <input
                        type="number"
                        className="form-control"
                        name="allowanceSalary"
                        value={formData.allowanceSalary}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Tên chức vụ</label>
                    <select
                        name="positionId"
                        onChange={handleChange}
                        className="form-control"
                        value={formData.positionId} // Đặt giá trị được chọn dựa trên formData.positionId
                    >
                        <option value="">-- Chọn chức vụ --</option>
                        {
                            positions.map((position) => (
                                <option key={position.id} value={position.id}>
                                    {position.positionName}
                                </option>
                            ))
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


export default AllowanceEditComponents;
