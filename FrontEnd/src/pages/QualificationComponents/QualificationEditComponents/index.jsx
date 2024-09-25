// src/components/EditQualificationModal.js
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { fetchEmployees } from "../QualificationService/qualificationService";

const QualificationEditComponents = ({show, handleClose, qualification, onSave}) => {

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees().then((data) => {
            setEmployees(data);
        })
    }, []);

    const [formData, setFormData] = useState({
        qualificationName: '',
        employeeName: '',
        image: '',
        status: 1,
        expiryDate: '',
        id: '',
    });

    useEffect(() => {
        if (qualification) {

            const formattedExpiryDate = qualification.expiryDate ? new Date(qualification.expiryDate).toISOString().split('T')[0] : '';
            setFormData({
                qualificationName: qualification.qualificationName || '',
                employeeName: qualification.employeeName || '',
                image: qualification.image || '',
                status: qualification.status || 0,
                expiryDate: formattedExpiryDate || '',
                id: qualification.id || '',
            });
            
        }
    }, [qualification]);

    // Perform formData update when there is a change in the input form
    const handleChange = (e) => {

        const {name, value, files} = e.target;
        if (name === 'image') {
            setFormData({
                ...formData,
                image: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSave = () => {
        const updatedQualification = {
            ...formData,
            id: qualification.id
        };
        console.log('Bằng cấp đã cập nhật:', updatedQualification); // Kiểm tra dữ liệu đã cập nhật
        onSave(updatedQualification);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa Bằng Cấp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>ID bằng cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        name="id"
                        value={formData.id}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Tên bằng cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        name="qualificationName"
                        value={formData.qualificationName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Tên Nhân Viên</label>
                    <select
                        name="employeeName"
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">-- Chọn nhân viên --</option>
                        {
                            employees.map((employee) => (
                                <option key={employee.id} value={employee.employeeName} selected={formData.employeeName === employee.employeeName}>
                                    {employee.employeeName}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label>Thời hạn</label>
                    <input
                        type="date"
                        name="expiryDate"
                        className="form-control"
                        value={formData.expiryDate}
                        onChange={handleChange}
                    />
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

                <div className="form-group">
                    <label>Image</label>
                    {formData.image ? (
                        <>
                            <input
                                type="file"
                                className="form-control"
                                name="image"
                                onChange={handleChange}
                            />
                            <div className="mt-2">
                                <img
                                    src={`http://localhost:9002${formData.image}`}
                                    alt="Ảnh bằng cấp"
                                    className="img-thumbnail mb-2"
                                    style={{width: '100px', height: '100px'}}
                                />
                            </div>
                        </>

                    ) : (
                        <input
                            type="file"
                            className="form-control"
                            name="image"
                            onChange={handleChange}
                        />
                    )}

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


export default QualificationEditComponents;
