import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap'; // Sử dụng React-Bootstrap
import InputComponents from "../../../components/InputComponents";


const PersonnelEditComponent = ({ show, handleClose, personnel, onSave, personnels = [] }) => { // Gán giá trị mặc định cho personnels là một mảng rỗng

    const [formData, setFormData] = useState({
        id: '',
        positionId: '',
        allowanceId: '',
        qualificationId: '',
        contractId: '',
        employeeId: '',
        employeeName: '',
        positionName: '',
        departmentName: '',
        contractName: '',
        date: '',
        address: '',
        gender: '',
        email: '',
        phoneNumber: '',
        CCCD: '',
        qualificationName: '',
        status: true,
        image: [],
        updated_at: "",
    });

    useEffect(() => {
        if (personnel) {
            setFormData({
                id: personnel.id || '',
                positionId: personnel.positionId || '',
                allowanceId: personnel.allowanceId || '',
                qualificationId: personnel.qualificationId || '',
                contractId: personnel.contractId || '',
                employeeId: personnel.employeeId || '',
                employeeName: personnel.employeeName || '',
                positionName: personnel.positionName || '',
                departmentName: personnel.departmentName || '',
                date: personnel.date || '',
                address: personnel.address || '',
                gender: personnel.gender || '',
                email: personnel.email || '',
                phoneNumber: personnel.phoneNumber || '',
                CCCD: personnel.CCCD || '',
                contractName: personnel.contractName || '',
                qualificationName: personnel.qualificationName || '',
                status: personnel.status || false,
                image: personnel.image || [],
                updated_at: personnel.updatedd_at || "",
            });
        }
    }, [personnel]);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({
                ...formData,
                [name]: Array.from(files)
            });
        } else if (name === "status") {
            setFormData({
                ...formData,
                [name]: value === "true" // Chuyển đổi chuỗi thành boolean
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const validateFormEdit = () => {
        const newErrors = {};
        const isNumber = value => /^\d+$/.test(value);
        const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        // Kiểm tra mã CCCD
        if (!formData.CCCD) {
            newErrors.CCCD = 'CCCD không được để trống';
        } else if (!/^\d+$/.test(formData.CCCD)) {
            newErrors.CCCD = 'CCCD chỉ được chứa số';
        } else if (formData.CCCD.length !== 12) {
            newErrors.CCCD = 'CCCD phải là 12 ký tự';
        } else if (personnels.length > 0 && personnels.some(personnel => personnel.CCCD === formData.CCCD && personnel.id !== formData.id)) {
            newErrors.CCCD = 'CCCD đã tồn tại';
        }
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống';
        } else if (!isNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại chỉ được chứa số';
        } else if (formData.phoneNumber.length !== 10) {
            newErrors.phoneNumber = 'Số điện thoại phải là 10 ký tự';
        }
        if (!formData.qualificationName) {
            newErrors.qualificationName = 'Bằng cấp không được để trống';
        }
        if (!formData.email) {
            newErrors.email = 'Email không được để trống';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.date) {
            newErrors.date = 'Ngày sinh không được để trống';
        }
        return newErrors;
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Gọi hàm validate để kiểm tra các lỗi trong form
        const errors = validateFormEdit();

        if (Object.keys(errors).length > 0) {
            // Nếu có lỗi, cập nhật state để hiển thị lỗi
            setErrors(errors);
        } else {
            const updateddPersonnel = {
                ...formData,
                id: personnel.id,
                updated_at: new Date().toISOString(), // Cập nhật thời gian
            };
            onSave(updateddPersonnel);
            handleClose();
            setErrors({});
        }


    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa thông tin nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Mã nhân viên</label>
                            <input
                                type="text"
                                className="form-control"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Tên nhân viên</label>
                            <input
                                type="text"
                                className="form-control"
                                name="employeeName"
                                value={formData.employeeName}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Giới tính</label>
                            <input
                                type="text"
                                className="form-control"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Ngày sinh</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                            {errors.date && <span className="text-danger">{errors.date}</span>}
                        </div>
                        <div className="form-group">
                            <label>Phòng ban</label>
                            <input
                                type="text"
                                className="form-control"
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Chức vụ</label>
                            <input
                                type="text"
                                className="form-control"
                                name="positionName"
                                value={formData.positionName}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span className="text-danger">{errors.email}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                            {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber}</span>}
                        </div>
                        <div className="form-group">
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>CCCD</label>
                            <input
                                type="text"
                                name="CCCD"
                                className="form-control"
                                value={formData.CCCD}
                                onChange={handleChange}
                            />
                            {errors.CCCD && <span className="text-danger">{errors.CCCD}</span>}
                        </div>
                        <div className="form-group">
                            <label>Bằng cấp</label>
                            <input
                                type="text"
                                className="form-control"
                                name="qualificationName"
                                value={formData.qualificationName}
                                onChange={handleChange}
                            />

                        </div>
                        <div className="form-group">
                            <label>Hợp đồng</label>
                            <input
                                type="text"
                                className="form-control"
                                name="contractName"
                                value={formData.contractName}
                                onChange={handleChange}
                                disabled
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
                                <option value={true}>Hoạt động</option>
                                <option value={false}>Không hoạt động</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Image</label>
                            <input
                                type="file"
                                className="form-control"
                                name="image"
                                onChange={handleChange}
                                multiple
                            />
                            {Array.isArray(formData.image) && formData.image.length > 0 && (
                                <div>
                                    {formData.image.map((file, index) => (
                                        <div key={index}>{file.name}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
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

export default PersonnelEditComponent;
