import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import InputComponents from "../../../components/InputComponents";
import { fetchPersons } from "../DecisionServices/decisionServices";

const DecisionFormComponents = ({ onSubmit, decisions }) => {
    const [formData, setFormData] = useState({
        rdCode: "",
        content: "",
        decisionDate: "",
        money: "",
        category: "",
        rdImages: "",
        employeeCode: "",
        createAt: "",
        updateAt: "",
    });

    const [errors, setErrors] = useState({});
    const [persons, setPersons] = useState([]);

    useEffect(() => {
        const now = new Date().toISOString().slice(0, 16);
        setFormData((prevState) => ({
            ...prevState,
            createAt: now,
            updateAt: now,
        }));

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
        if (name === "rdImages") {
            setFormData((prevState) => ({
                ...prevState,
                rdImages: files[0],
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


    const validate = () => {
        const newErrors = {};

        if (!formData.rdCode) {
            newErrors.rdCode = "Mã hợp quyết được để trống";
        } else if (formData.rdCode.length !== 7) {
            newErrors.rdCode = "Mã hợp đồng phải là 7 ký tự";
        } else if (
            decisions.some(
                (decision) => decision.rdCode === formData.rdCode
            )
        ) {
            newErrors.contractCode = "Mã quyết định đã tồn tại";
        }

        if (!formData.content) {
            newErrors.content = "Loại hợp đồng không được để trống";
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

        const money = Number(formData.money.replace(/\./g, ""));
        if (!formData.money || isNaN(money) || money <= 0) {
            newErrors.money = "Mức lương phải là số dương";
        }

        if (!formData.decisionDate) {
            newErrors.decisionDate = "Ngày bắt đầu không được để trống";
        } else if (isNaN(new Date(formData.decisionDate).getTime())) {
            newErrors.decisionDate = "Ngày bắt đầu không hợp lệ";
        }

        return newErrors;
    };


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
        });

        // Reset the form
        setFormData({
            rdCode: "",
            content: "",
            decisionDate: "",
            money: "",
            category: "",
            rdImages: "",
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
                                label="Mã RD"
                                type="text"
                                name="rdCode"
                                value={formData.rdCode}
                                onChange={handleChange}
                                placeholder="ví dụ: KT_0001, KL_0001"
                            />
                            {errors.rdCode && (
                                <div className="text-danger">{errors.rdCode}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <InputComponents
                                label="Nội dung"
                                type="text"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="....."
                            />
                            {errors.content && (
                                <div className="text-danger">{errors.content}</div>
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
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="">-- Loại --</option>
                                <option value="reward">Khen thưởng</option>
                                <option value="discipline">Kỷ luật</option>
                            </select>
                            {errors.category && (
                                <div className="text-danger">{errors.category}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Số tiền</label>
                            <NumericFormat
                                name="money"
                                value={formData.money}
                                onValueChange={({ value }) => setFormData((prevState) => ({
                                    ...prevState,
                                    money: value,
                                }))}
                                thousandSeparator="."
                                decimalSeparator=","
                                className="form-control"
                            />
                            {errors.money && (
                                <div className="text-danger">{errors.money}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <InputComponents
                                label="Ngày quyết định"
                                type="date"
                                name="decisionDate"
                                value={formData.decisionDate}
                                onChange={handleChange}
                            />
                            {errors.decisionDate && (
                                <div className="text-danger">{errors.decisionDate}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                            <InputComponents
                                label="Hồ sơ (.doc, .pdf)"
                                type="file"
                                name="rdImages"
                                onChange={handleChange}
                                accept=".pdf"
                            />
                            {errors.rdImages && (
                                <div className="text-danger">{errors.rdImages}</div>
                            )}
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

export default DecisionFormComponents;
