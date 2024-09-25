import React, { useEffect, useState } from 'react';
import FormInput from '../../../components/FormInputComponents';
import { fetchEmployees } from "../QualificationService/qualificationService";

const QualificationForm = ({ onSubmit }) => {

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Fetch employees and handle the response
        fetchEmployees().then((response) => {
            setEmployees(response);
        });
    }, []);

    const [formData, setFormData] = useState({
        qualificationName: '',
        employeeId: '',
        expiryDate: '',
        image: null,  // Initialize image to null for single image handling
        status: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files.length > 0) {
            setFormData({
                ...formData,
                image: files[0],  // Only store the first image file
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.qualificationName) {
            newErrors.qualificationName = 'Tên bằng cấp không được để trống';
        }

        if (!formData.employeeId) {
            newErrors.employeeId = 'Tên nhân viên không được để trống';
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = 'Thời hạn không được để trống';
        }

        if (!formData.image) {
            newErrors.image = 'Hình ảnh không được để trống';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            // Prepare the formData to submit and reset the form
            onSubmit({
                ...formData,
                status: 1,  // You may want to adjust this dynamically based on your needs
            });

            // Reset the form
            setFormData({
                qualificationName: '',
                employeeId: '',
                expiryDate: '',
                image: null,  // Reset image to null
                status: '',
            });
            setErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormInput
                label="Tên bằng cấp"
                type="text"
                name="qualificationName"
                value={formData.qualificationName}
                onChange={handleChange}
                error={errors.qualificationName}
            />

            <div className="form-group">
                <label>Tên nhân viên</label>
                <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="">-- Chọn nhân viên --</option>
                    {
                        employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.employeeName}
                            </option>
                        ))
                    }
                </select>
                {errors.employeeId && <div className="text-danger">{errors.employeeId}</div>}
            </div>

            <FormInput
                label="Thời hạn"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                error={errors.expiryDate}
            />

            <div className="form-group">
                <label>Image</label>
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="form-control"
                    accept="image/*"
                />
                {formData.image && (
                    <ul className="list-group mt-2">
                        <li className="list-group-item">
                            {formData.image.name}
                        </li>
                    </ul>
                )}
                {errors.image && <div className="text-danger">{errors.image}</div>}
            </div>

            <button type="submit" className="btn btn-primary">Thêm bằng cấp</button>
        </form>
    );
};

export default QualificationForm;
