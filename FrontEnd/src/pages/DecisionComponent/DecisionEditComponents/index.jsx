import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import InputComponents from "../../../components/InputComponents";
import ButtonComponents from "../../../components/ButtonComponents";
import moment from 'moment';

const convertStatusToNumber = (status) => (status ? 1 : 0);

const DecisionEditComponents = ({ show, handleClose, decision, onSave }) => {
    const [formData, setFormData] = useState({
        id: "",
        rdCode: "",
        content: "",
        decisionDate: "",
        money: "",
        category: "",
        rdImages: "",
        employeeCode: "",
        status: 1,
        updateAt: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (decision) {
            setFormData({
                id: decision.id || "",
                rdCode: decision.rdCode || "",
                content: decision.content || "",
                decisionDate: decision.decisionDate ? moment(decision.decisionDate).format('YYYY-MM-DD') : "",
                money: decision.money || "",
                category: decision.category || "",
                rdImages: decision.rdImages || "",
                employeeCode: decision.employeeCode || "",
                updateAt: decision.updateAt || "",
                status: decision.status ? 1 : 0,
            });
        }
    }, [decision]);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        if (type === "file") {
            const fileNames = Array.from(files).map(file => file.name);
            setFormData(prevState => ({
                ...prevState,
                [name]: fileNames.join(", "),
            }));
        } else if (name === "status") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value === "true" ? 1 : 0,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        const errors = validateFormEdit();

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
        } else {
            const updateDecision = {
                ...formData,
                content: formData.content,
                money: formData.money,
                decisionDate: formData.decisionDate,
                category: formData.category,
                rdImages: formData.rdImages,
                status: convertStatusToNumber(formData.status),
                updateAt: new Date().toISOString(),
            };

            onSave(updateDecision);
            handleClose();
            setErrors({});
        }
    };

    const validateFormEdit = () => {
        const newErrors = {};

        if (!formData.content) {
            newErrors.content = "Nội dung không được để trống";
        }
        if (!formData.money || parseFloat(formData.money) <= 0) {
            newErrors.money = "Mức tiền hợp lệ";
        }
        if (!formData.decisionDate) {
            newErrors.decisionDate = "Ngày đề xuất không được để trống";
        }

        return newErrors;
    };
    // Determine the list of file names from the contentContract
    const contentList = formData.rdImages
        ? formData.rdImages.split(", ").map(fileName => fileName)
        : [];


    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            dialogClassName="custom-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa quyết định </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <InputComponents
                                    label="Mã quyết định"
                                    type="text"
                                    name="rdCode"
                                    value={formData.rdCode}
                                    onChange={handleChange}
                                    placeholder=""
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <InputComponents
                                    label="Mã nhân viên"
                                    type="text"
                                    name="employeeCode"
                                    value={formData.employeeCode}
                                    onChange={handleChange}
                                    placeholder=""
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <InputComponents
                                    label="Nội dung"
                                    type="text"
                                    onChange={handleChange}
                                    name="content"
                                    value={formData.content}
                                    placeholder=""
                                />
                                {errors.content && (
                                    <div className="text-danger">{errors.content}</div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Loại quyết định</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="reward">Khen thưởng</option>
                                    <option value="discipline">Kỷ luật</option>
                                </select>
                                {errors.category && (
                                    <div className="text-danger">{errors.category}</div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Mức tiền</label>
                                <NumericFormat
                                    className="form-control"
                                    name="money"
                                    value={formData.money}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    onValueChange={(values) => {
                                        const {value} = values;
                                        setFormData(prevState => ({
                                            ...prevState,
                                            money: parseFloat(value),
                                        }));
                                    }}
                                />
                                {errors.money && (
                                    <div className="text-danger">{errors.money}</div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <InputComponents
                                    label="Ngày quyết định"
                                    type="date"
                                    name="decisionDate"
                                    value={formData.decisionDate}
                                    onChange={handleChange}
                                    placeholder=""
                                />
                                {errors.decisionDate && (
                                    <div className="text-danger">{errors.decisionDate}</div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select
                                    name="status"
                                    value={formData.status === 1 ? "true" : "false"}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Disable</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="form-group">
                                <label>{contentList.length > 0 ? `Có ${contentList.length} hồ sơ` : "Không có hồ sơ"}</label>
                                {contentList.length > 0 && (
                                    <ul className="list-group mt-2">
                                        {contentList.map((file, index) => (
                                            <li key={index} className="list-group-item">
                                                {file}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <InputComponents
                                    label="Hồ sơ hợp đồng (.doc, .pdf)"
                                    type="file"
                                    name="rdImages"
                                    onChange={handleChange}
                                    multiple
                                    accept=".doc,.pdf"
                                />
                            </div>
                        </div>


                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <ButtonComponents
                    className="custom-button btn btn-danger"
                    variant="secondary"
                    onClick={handleClose}
                >
                    Đóng
                </ButtonComponents>
                <ButtonComponents
                    className="custom-button btn btn-success"
                    variant="primary"
                    onClick={handleSave}
                >
                    Lưu thay đổi
                </ButtonComponents>
            </Modal.Footer>
        </Modal>
    );
};

export default DecisionEditComponents;
