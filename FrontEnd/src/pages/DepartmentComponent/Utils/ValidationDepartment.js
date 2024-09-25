

export const validateDepartmentForm = (formValue, departments, editingDepartmentId) => {
    const errors = {};
    const departmentNames = departments
        .filter(dep => dep.id !== editingDepartmentId)
        .map((dep) => dep.departmentName.toLowerCase());

    if (!formValue.departmentName) {
        errors.departmentName = "Tên phòng ban không được bỏ trống.";
    } else if (!editingDepartmentId && departmentNames.includes(formValue.departmentName?.toLowerCase())) {
        errors.departmentName = "Tên phòng ban đã tồn tại.";
    }
    if (!formValue.description) {
        errors.description = "Mô tả không được bỏ trống.";
    }
    if (!formValue.status) {
        errors.status = "Trạng thái không được bỏ trống.";
    }
    return errors;
};