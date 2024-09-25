import React, {useEffect, useState} from 'react';
import FormInput from "../../../components/FormInputComponents";
import 'bootstrap/dist/css/bootstrap.min.css';
import {fetchAllPosition, fetchDepartment} from "../../PositionComponents/PositionService/positionService";
import {fetchRoles} from "../PersonnelService/PersonnelSevice";

const PersonnelForm = ({onSubmit, personnels}) => {
    const [formData, setFormData] = useState({
        employeeCode: '',
        employeeName: '',
        dateOfBirth: '',
        gender: '',
        citizenId: '',
        address: '',
        email: '',
        password: '',
        phoneNumber: '',
        image: '',
        status: 1,
        positionId: '',
        departmentId: '',
        roleId: ''
    });
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchDepartment().then(res => setDepartments(res));
    }, []);

    useEffect(() => {
        fetchAllPosition().then(res => setPositions(res));
    }, []);

    useEffect(() => {
        fetchRoles().then(res => setRoles(res));
    }, []);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (files) {
            setFormData({
                ...formData,
                image: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // const validate = () => {
    //     const newErrors = {};
    //     const isNumber = value => /^\d+$/.test(value);
    //     const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    //
    //     if (!formData.employeeCode) {
    //         newErrors.employeeCode = 'Mã nhân viên không được để trống';
    //     }
    //     else if (personnels.some(personnel => personnel.employeeCode === formData.employeeCode)) {
    //         newErrors.employeeCode = 'Mã nhân viên đã tồn tại';
    //     }
    //
    //     if (!formData.employeeName) newErrors.employeeName = 'Tên nhân viên không được để trống';
    //
    //     if (!formData.citizenId) {
    //         newErrors.citizenId = 'citizenId không được để trống';
    //     } else if (!isNumber(formData.citizenId)) {
    //         newErrors.citizenId = 'citizenId chỉ được chứa số';
    //     } else if (formData.citizenId.length !== 12) {
    //         newErrors.citizenId = 'citizenId phải là 12 ký tự';
    //     } else if (personnels.some(personnel => personnel.citizenId === formData.citizenId)) {
    //         newErrors.citizenId = 'citizenId đã tồn tại';
    //     }
    //
    //     if (!formData.positionId || formData.positionId === "--Chọn chức vụ--") {
    //         newErrors.positionId = 'Chức vụ không được để trống';
    //     }
    //     if (!formData.departmentName) newErrors.departmentName = 'Tên Phòng ban không được để trống';
    //     if (!formData.address) newErrors.address = 'Địa chỉ không được để trống';
    //     if (!formData.gender || formData.gender === "--Chọn giới tính--") {
    //         newErrors.gender = 'Giới tính không được để trống';
    //     }
    //
    //     if (!formData.phoneNumber) {
    //         newErrors.phoneNumber = 'Số điện thoại không được để trống';
    //     } else if (!isNumber(formData.phoneNumber)) {
    //         newErrors.phoneNumber = 'Số điện thoại chỉ được chứa số';
    //     } else if (formData.phoneNumber.length !== 10) {
    //         newErrors.phoneNumber = 'Số điện thoại phải là 10 ký tự';
    //     }
    //     if (!formData.email) {
    //         newErrors.email = 'Email không được để trống';
    //     } else if (!isValidEmail(formData.email)) {
    //         newErrors.email = 'Email không hợp lệ';
    //     }
    //     if (!formData.dateOfBirth) {
    //         newErrors.dateOfBirth = 'Ngày sinh không được để trống';
    //     }
    //
    //     if (!formData.roleId) {
    //         newErrors.roleId = 'Vai trò không được để trống';
    //     }
    //     if (!formData.departmentId) {
    //         newErrors.departmentId = 'Phòng ban không được để trống';
    //     }
    //
    //     if (!formData.password) {
    //         newErrors.password = 'Mật khẩu không được để trống';
    //     }
    //
    //     return newErrors;
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            ...formData,
            status: 1
        });

        setFormData({
            employeeCode: '',
            employeeName: '',
            dateOfBirth: '',
            gender: '',
            citizenId: '',
            address: '',
            email: '',
            password: '',
            phoneNumber: '',
            image: '',
            status: 1,
            positionId: '',
            departmentId: '',
            roleId: ''
        })
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-md-6">
                    <FormInput
                        label="Mã nhân viên"
                        type="text"
                        name="employeeCode"
                        value={formData.employeeCode||""}
                        onChange={handleChange}
                        error={errors.employeeCode}
                    />
                    <FormInput
                        label="Tên nhân viên"
                        type="text"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        error={errors.employeeName}
                    />
                    <div className="form-group">
                        <label>Phòng ban</label>
                        <select
                            name="departmentId"
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">--Chọn phòng ban--</option>
                            {
                                departments.map(department => (
                                    <option key={department.departmentId
                                    } value={department.departmentId
                                    }>
                                        {department.departmentName}
                                    </option>
                                ))
                            }
                        </select>
                        {errors.departmentId && <div className="text-danger">{errors.departmentId}</div>}
                    </div>
                    <div className="form-group">
                        <label>Chức vụ</label>
                        <select
                            name="positionId"
                            value={formData.positionId}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">--Chọn chức vụ--</option>
                            {
                                positions.map(position => (
                                    <option key={position.id} value={position.id}>
                                        {position.positionName}
                                    </option>
                                ))
                            }
                        </select>
                        {errors.positionId && <div className="text-danger">{errors.positionId}</div>}
                    </div>

                    <FormInput
                        label="Ngày sinh"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        error={errors.dateOfBirth}
                    />
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label>Giới tính</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">--Chọn giới tính--</option>
                            <option value={0}>Nam</option>
                            <option value={1}>Nữ</option>
                        </select>
                        {errors.gender && <div className="text-danger">{errors.gender}</div>}
                    </div>


                    <FormInput
                        label="Email"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <FormInput
                        label="Số điện thoại"
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={errors.phoneNumber}
                    />
                    <FormInput
                        label="Số CCCD"
                        type="text"
                        name="citizenId"
                        value={formData.citizenId}
                        onChange={handleChange}
                        error={errors.citizenId}
                    />
                    <div className="form-group">
                        <label>Image</label>
                        <input
                            type="file"
                            name="image"
                            multiple
                            onChange={handleChange}
                            className="form-control"
                            accept=".jpg,.png"
                        />
                        {formData.image.length > 0 && (
                            <ul className="list-group mt-2">
                                {formData.image.map((image, index) => (
                                    <li key={index} className="list-group-item">
                                        {image.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="col-md-12">
                    <FormInput
                        label="Địa chỉ"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                    />
                </div>

                <div className="col-md-12 d-flex">

                    <div className="form-group col-md-6">
                        <div className="form-group">
                            <FormInput
                                label="Mật khẩu"
                                type="text"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label>Vai trò</label>
                        <select
                            name="roleId"
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">--Chọn vai trò--</option>
                            {
                                roles.map((item) => {
                                    return <option key={item.id} value={item.id}>{item.roleCode}</option>;
                                })
                            }
                        </select>
                        {errors.roleId && <div className="text-danger">{errors.roleId}</div>}
                    </div>


                </div>
            </div>
            <button type="submit" className="btn btn-primary">Thêm nhân viên</button>
        </form>
    );
};

export default PersonnelForm;
