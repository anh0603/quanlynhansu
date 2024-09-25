import {formatDateToInput} from "./Date";


export const validateTimeOffForm = (formValue, timeOff, editingTimeOffId) => {
    const errors = {};
    if (!formValue.employeeId) {
        errors.employeeId = "ID nhân sự không được bỏ trống.";
    } else if (!/^\d+$/.test(formValue.employeeId)) {
        errors.employeeId = "ID nhân sự phải là số.";
    }
    if (!formValue.dateStart) {
        errors.dateStart = "Ngày bắt đầu không được bỏ trống.";
    } else if (isNaN(Date.parse(formatDateToInput(formValue.dateStart)))) {
        errors.dateStart = "Ngày bắt đầu không hợp lệ.";
    }

    if (!formValue.dateEnd) {
        errors.dateEnd = "Ngày kết thúc không được bỏ trống.";
    } else if (isNaN(Date.parse(formatDateToInput(formValue.dateEnd)))) {
        errors.dateEnd = "Ngày kết thúc không hợp lệ.";
    } else if (new Date(formatDateToInput(formValue.dateEnd)) < new Date(formatDateToInput(formValue.dateStart))) {
        errors.dateEnd = "Ngày kết thúc không được trước ngày bắt đầu.";
    }
    if (!formValue.status) {
        errors.status = "Trạng thái không được bỏ trống.";
    }
    return errors;
};