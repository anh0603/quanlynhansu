

export const validateOvertimeForm = (formValue, overtimes, editingOvertimeId) => {
    const errors = {};
    if (!formValue.employeeId) {
        errors.employeeId = "ID nhân sự không được bỏ trống.";
    } else if (!/^\d+$/.test(formValue.employeeId)) {
        errors.employeeId = "ID nhân sự phải là số.";
    }
    if (!formValue.hours) {
        errors.hours = "Số giờ làm không được bỏ trống.";
    } else if (isNaN(formValue.hours) || parseFloat(formValue.hours) <= 0) {
        errors.hours = "Số giờ làm phải là số dương.";
    }
    if (!formValue.multiplier) {
        errors.multiplier = "Hệ số không được bỏ trống.";
    } else if (isNaN(formValue.multiplier) || parseFloat(formValue.multiplier) <= 0) {
        errors.multiplier = "Hệ số phải là số dương.";
    }
    if (!formValue.status) {
        errors.status = "Trạng thái không được bỏ trống.";
    }
    return errors;
};