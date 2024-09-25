import React, {useEffect, useState} from "react";
import {NumericFormat} from "react-number-format";
import InputComponents from "../../../components/InputComponents";
import {fetchPersons} from "../ContractService/contractService";

// Component để thêm hợp đồng mới
const ContractForm = ({onSubmit, contracts}) => {
    const [formData, setFormData] = useState({
        contractCode: "",
        contractCategory: "",
        dateStart: "",
        dateEnd: "",
        salary: "",
        contentContract: "",
        employeeCode: "",
        createAt: "",
        updateAt: "",
    });

    const [errors, setErrors] = useState({});
    const [persons, setPersons] = useState([]);

    // useEffect để thiết lập thời gian hiện tại khi form được tải
    useEffect(() => {
        const now = new Date().toISOString().slice(0, 16);
        setFormData((prevState) => ({
            ...prevState,
            createAt: now,
            updateAt: now,
        }));

        // Gọi API để lấy danh sách nhân sự
        const loadPersons = async () => {
            try {
                const personsData = await fetchPersons();
                setPersons(personsData);
            } catch (error) {
                console.error("Có lỗi xảy ra khi lấy danh sách nhân sự!", error);
            }
        };

        loadPersons();
    }, []);

    // Hàm xử lý thay đổi dữ liệu form
    const handleChange = (e) => {
        const {name, value, files} = e.target;
        const now = new Date().toISOString().slice(0, 16);
        if (name === "contentContract") {
            setFormData((prevState) => ({
                ...prevState,
                contentContract: files[0],
                updateAt: now,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
                updateAt: now,
            }));
        }
    };

    // Hàm kiểm tra dữ liệu form
    const validate = () => {
        const newErrors = {};

        if (!formData.contractCode) {
            newErrors.contractCode = "Mã hợp đồng không được để trống";
        } else if (formData.contractCode.length !== 7) {
            newErrors.contractCode = "Mã hợp đồng phải là 7 ký tự";
        } else if (
            contracts.some(
                (contract) => contract.contractCode === formData.contractCode
            )
        ) {
            newErrors.contractCode = "Mã hợp đồng đã tồn tại";
        }

        if (!formData.employeeCode) {
            newErrors.employeeCode = "Mã nhân viên không được để trống";
        } else if (
            !persons.some(
                (person) =>
                    person.employeeCode.trim().toUpperCase() === formData.employeeCode.trim().toUpperCase()
            )
        ) {
            newErrors.employeeCode = "Mã nhân viên không tồn tại trong hệ thống";
        }

        if (!formData.contractCategory) {
            newErrors.contractCategory = "Loại hợp đồng không được để trống";
        }

        const salary = Number(formData.salary.replace(/\./g, ""));
        if (!formData.salary || isNaN(salary) || salary <= 0) {
            newErrors.salary = "Mức lương phải là số dương";
        }

        if (!formData.dateStart) {
            newErrors.dateStart = "Ngày bắt đầu không được để trống";
        } else if (isNaN(new Date(formData.dateStart).getTime())) {
            newErrors.dateStart = "Ngày bắt đầu không hợp lệ";
        }

        if (!formData.dateEnd) {
            newErrors.dateEnd = "Ngày kết thúc không được để trống";
        } else if (isNaN(new Date(formData.dateEnd).getTime())) {
            newErrors.dateEnd = "Ngày kết thúc không hợp lệ";
        } else if (new Date(formData.dateStart) > new Date(formData.dateEnd)) {
            newErrors.dateEnd = "Ngày kết thúc phải sau ngày bắt đầu";
        }

        return newErrors;
    };

    // Hàm xử lý khi form được submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSubmit({
                ...formData,
                status: 1,
            }// You may want to adjust this dynamically based on your needs
        )
        // Reset the form
        setFormData({
            contractCode: "",
            contractCategory: "",
            salary: "",
            dateStart: "",
            dateEnd: "",
            contentContract: "",
            employeeCode: "",
            createAt: "",
            updateAt: "",
        });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <InputComponents
                                label="Mã hợp đồng"
                                type="text"
                                name="contractCode"
                                value={formData.contractCode}
                                onChange={handleChange}
                                placeholder="ví dụ: HD_0001"
                            />
                            {errors.contractCode && (
                                <div className="text-danger">{errors.contractCode}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Mã nhân viên</label>
                            <select
                                name="employeeCode"
                                value={formData.employeeCode}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="">-- Mã nhân viên --</option>
                                {persons.map((person) => (
                                    <option key={person.employeeCode} value={person.employeeCode}>
                                        {person.employeeCode} - {person.employeeName}
                                    </option>
                                ))}
                            </select>
                            {errors.employeeCode && (
                                <div className="text-danger">{errors.employeeCode}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Loại hợp đồng</label>
                            <select
                                name="contractCategory"
                                value={formData.contractCategory}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="">-- Chọn loại hợp đồng --</option>
                                <option value="fulltime">Hợp đồng lao động chính thức</option>
                                <option value="parttime">Hợp đồng lao động parttime</option>
                                <option value="freelance">Hợp đồng Freelance</option>
                                <option value="probationary">Hợp đồng thử việc</option>
                                <option value="intern">Hợp đồng thực tập</option>
                            </select>
                            {errors.contractCategory && (
                                <div className="text-danger">{errors.contractCategory}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Lương</label>
                            <NumericFormat
                                name="salary"
                                value={formData.salary}
                                onValueChange={({value}) => setFormData((prevState) => ({
                                    ...prevState,
                                    salary: value,
                                }))}
                                thousandSeparator="."
                                decimalSeparator=","
                                className="form-control"
                            />
                            {errors.salary && (
                                <div className="text-danger">{errors.salary}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Ngày bắt đầu</label>
                            <InputComponents
                                type="date"
                                name="dateStart"
                                value={formData.dateStart}
                                onChange={handleChange}
                            />
                            {errors.dateStart && (
                                <div className="text-danger">{errors.dateStart}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Ngày kết thúc</label>
                            <InputComponents
                                type="date"
                                name="dateEnd"
                                value={formData.dateEnd}
                                onChange={handleChange}
                            />
                            {errors.dateEnd && (
                                <div className="text-danger">{errors.dateEnd}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <InputComponents
                                label="Hồ sơ hợp đồng (.doc, .pdf)"
                                type="file"
                                name="contentContract"
                                onChange={handleChange}
                                accept=".pdf"
                            />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <button type="submit" className="btn btn-primary">
                            Thêm hợp đồng
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ContractForm;
