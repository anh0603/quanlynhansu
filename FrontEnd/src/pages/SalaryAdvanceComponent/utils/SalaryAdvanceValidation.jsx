

export const validateSalaryAdvanceForm = (formValue, salaryAdvance, editingSalaryAdvanceId) => {
    const errors = {};
    if (!formValue.employeeId) {
        errors.employeeId = "ID nhân sự không được bỏ trống.";
    } else if (!/^\d+$/.test(formValue.employeeId)) {
        errors.employeeId = "ID nhân sự phải là số.";
    }
    if (!formValue.money) {
        errors.money = "Số tiền tạm ứng không được bỏ trống.";
    } else if (isNaN(formValue.money) || parseFloat(formValue.money) <= 0) {
        errors.money = "Số tiền tạm ứng phải là số dương.";
    }
    if (!formValue.status) {
        errors.status = "Trạng thái không được bỏ trống.";
    }
    return errors;
};