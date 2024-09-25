import React, { useEffect, useState } from 'react';
import FormInput from '../../../components/FormInputComponents';
import { fetchDepartment } from '../PositionService/positionService';

const PositionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    positionName: '',
    departmentId: '',
    status: 1,
    id: '',
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartment().then(res => {
      setDepartments(res);
    })
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: Array.from(files),
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

    if (!formData.positionName) {
      newErrors.positionName = 'Tên Chức vụ không được để trống';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Loại tên phòng ban không được để trống';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSubmit({
        ...formData,
        status: 1,
      });
      setFormData({
        positionName: '',
        departmentId: '',
        status: 1,
        id: '',
      });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Tên Chức vụ"
        type="text"
        name="positionName"
        value={formData.positionName}
        onChange={handleChange}
        error={errors.positionName}
      />
      <div className="form-group">
        <label>Phòng Ban</label>
        <select
          name="departmentId"
          onChange={handleChange}
          className="form-control"
        >
          <option>---Chọn Phòng Ban---</option>
          {
            departments.map((item) => {
              return <option key={item.departmentId} value={item.departmentId}>{item.departmentName}</option>;
            })
          }
        </select>
        {errors.departmentId && <div className="text-danger">{errors.departmentId}</div>}
      </div>
      <button type="submit" className="btn btn-primary">Thêm Chức Vụ</button>
    </form>
  );
};

export default PositionForm;
