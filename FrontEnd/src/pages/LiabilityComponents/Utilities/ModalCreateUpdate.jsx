import React, {useEffect, useState} from "react";
import {liabilityFields, liabilityFields_CreateUpdate, studentFields} from "./Field";
import Button from "react-bootstrap/Button";
import {fetch_option_Liability} from "../service/LiabilityService.";
import {convertDateToISO, formatDate} from "./DateLiability";
import {toast} from "react-toastify";
import {validateLiability} from "./Validation";


const ModalCreateUpdate = ({liability, isNew, isEditing, onSave, disabledLiabilityFields = []}) => {
    const [statusOptions, setStatusOptions] = useState([]);
    const [formValue, setFormValue] = useState({
        student_Id: '',
        student_name: '',
        address: '',
        email: '',
        phone_Number: '',
        debt: '',
        period_debt: '',
        status: '',
        course_id: '',
        personnel_id: '',
        note: '',
        create_date: '',
        update_date: ''
    })
    const [errors, setErrors] = useState({});
    useEffect(() => {
        const get_Status = async () => {
            const options = await fetch_option_Liability();
            setStatusOptions(options || []);
        };
        get_Status();

        if (!isNew && liability) {
            const createDateISO = convertDateToISO(liability.create_date);
            const updateDateISO = convertDateToISO(liability.update_date);
            setFormValue({
                ...liability,
                create_date: createDateISO,
                update_date: updateDateISO,
            });
        } else if (isNew) {
            setFormValue({
                student_Id: '',
                student_name: '',
                address: '',
                email: '',
                phone_Number: '',
                debt: '',
                period_debt: '',
                status: '',
                course_id: '',
                personnel_id: '',
                note: '',
                create_date: '',
                update_date: ''
            });
        }
    }, [liability, isNew]);
    const handleChange = (e) => {
        const {id, value} = e.target;
        if (id === 'debt') {
            const numericValue = parseFloat(value.replace(/,/g, '')) || 0;
            setFormValue((prev) => ({...prev, [id]: numericValue}));
        } else {
            setFormValue((prev) => ({...prev, [id]: value}));
        }
    };
    const formatCurrency = (value) => {
        if (typeof value !== 'number') return value;
        return value.toLocaleString('vi-VN');
    };
    const handleUpdateDebt = () => {
        const currentDebt = parseFloat(formValue.debt);
        const payment = window.prompt("Nhập số tiền đã đóng:");

        if (payment !== null && payment.trim() !== "" && !isNaN(payment)) {
            const newDebt = currentDebt - parseFloat(payment);

            if (newDebt >= 0) {
                setFormValue((prev) => ({...prev, debt: newDebt}));
            } else {
                toast.warning("Số tiền đóng vượt quá số tiền nợ.");
            }
        } else if (payment !== null) {
            toast.error("Vui lòng nhập một số hợp lệ.");
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationsError = validateLiability(formValue, liability, isEditing);
        if (Object.keys(validationsError).length > 0) {
            setErrors(validationsError);
            return;
        }
        const nowDay = new Date().toISOString();
        const nowFormat = formatDate(nowDay);
        let createDateISO;
        let updateDateISO;
        if (isEditing) {
            createDateISO = formatDate(formValue.create_date);
            updateDateISO = nowFormat;
        } else {
            createDateISO = formatDate(formValue.create_date);
            updateDateISO = createDateISO
        }
        const formattedLiability = {
            ...formValue,
            create_date: createDateISO,
            update_date: updateDateISO,
        };

        if (onSave) {
            onSave(formattedLiability);
        }
    }
    const renderFields = (fields, disableFields, disabledFieldIds = []) => {
        return fields.map((field, index) => {
            const isDisabled = disableFields || disabledFieldIds.includes(field.id);
            const error = errors[field.id];
            return (
                <div className="form-group title_info" key={index}>
                    <label htmlFor={field.id} className="title_Student">{field.label}</label>
                    {field.id === 'debt' ? (
                        <>
                            <input
                                type="text"
                                id={field.id}
                                className="form-control"
                                value={formatCurrency(formValue.debt || "")}
                                onChange={handleChange}
                                disabled={isDisabled}
                            />
                            {isEditing && (
                                <button type="button" className="btn btn-warning " onClick={handleUpdateDebt}>
                                    <i className="bi bi-wallet2"></i>
                                </button>
                            )}
                        </>
                    ) : field.type === 'select' ? (
                        <select
                            id={field.id}
                            className="form-control"
                            value={formValue[field.id] || ""}
                            onChange={handleChange}
                            disabled={isDisabled}
                        >
                            <option value="">Chọn trạng thái</option>
                            {
                                statusOptions.map((option, index) => {
                                    return <option key={index} value={option.name}>
                                        {option.name}
                                    </option>
                                })
                            }
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            id={field.id}
                            className="form-control"
                            value={formValue[field.id] || ""}
                            onChange={handleChange}
                            disabled={isDisabled}
                        />
                    )}
                    {error && <div className="text-danger">{error}</div>}
                </div>
            )
        });
    }
    return (
        <>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="card col-6">
                            <h5 className="info_Student">Thông tin học viên</h5>
                            <div className="list_info_Student">
                                {renderFields(studentFields, isEditing)}
                            </div>
                        </div>
                        <div className="card col-6">
                            <h5 className="info_Liability">Học phí phải trả</h5>
                            <div className="list_info_Liability">
                                {renderFields(liabilityFields_CreateUpdate, false, disabledLiabilityFields)}
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="btn-primary">{isNew ? 'Thêm mới' : 'Cập nhật'}</Button>
                </form>
            </div>
        </>
    )
}
export default ModalCreateUpdate;

