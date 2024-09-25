import React, { useEffect, useState } from 'react';
import FormInput from '../../../components/FormInputComponents';
import { fetchPosition } from '../AllowanceService/allowanceService';

const AllowanceForm = ({ onSubmit }) => {

    const [positions, setPositions] = useState([]);

    useEffect(() => {
        // Fetch position and handle the response
        fetchPosition().then((response) => {
            setPositions(response);
        });
    }, []);

    const [formData, setFormData] = useState({
        allowanceCategory: '',
        allowanceSalary: '',
        positionId: '',
        status: '',
        id: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.allowanceCategory) {
            newErrors.allowanceName = 'Tên loại phụ cấp không được để trống';
        }

        if (!formData.allowanceSalary) {
            newErrors.allowanceSalary = 'Lương phụ cấp không được để trống';
        }

        if (!formData.positionId) {
            newErrors.positionId = 'Tên chức vụ không được để trống';
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
                allowanceCategory: '',
                allowanceSalary: '',
                positionId: '',
                status: '',
                id: ''
            });
            setErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormInput
                label="Tên loại phụ cấp"
                type="text"
                name="allowanceCategory"
                value={formData.allowanceCategory}
                onChange={handleChange}
                error={errors.allowanceCategory}
            />

            <FormInput
                label="Lương phụ cấp"
                type="number"
                name="allowanceSalary"
                value={formData.allowanceSalary}
                onChange={handleChange}
                error={errors.allowanceSalary}
            />

            <div className="form-group">
                <label>Tên chức vụ</label>
                <select
                    name="positionId"
                    value={formData.positionId}
                    onChange={handleChange}
                    className="form-control"
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
                {errors.positionId && <div className="text-danger">{errors.positionId}</div>}
            </div>

            <button type="submit" className="btn btn-primary">Thêm phụ cấp</button>
        </form>
    );
};

export default AllowanceForm;
