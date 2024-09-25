export const validateLiability = (formValue, liability = [], editingLiabilityId) => {
    const errors = {};
    const studentID = liability
        .filter(lia => lia.id !== editingLiabilityId)
        .map(lia => lia.student_Id.toLowerCase());
    if (!formValue.student_Id) {
        errors.student_Id = "Mã học viên không được bỏ trống"
    } else if (studentID.includes(formValue.student_Id.toLowerCase())) {
        errors.student_Id = "Mã học viên đã tồn tại"
    }
    if (!formValue.student_name) {
        errors.student_name = "Tên học viên không được bỏ trống"
    }
    if (!formValue.address) {
        errors.address = "Địa chỉ không được bỏ trống"
    }
    if (!formValue.email) {
        errors.email = "Email không được bỏ trống"
    }
    if (!formValue.phone_Number) {
        errors.phone_Number = "Số điện thoại không được bỏ trống"
    }
    if (!formValue.debt) {
        errors.debt = "Số nợ không được bỏ trống"
    }
    if (!formValue.period_debt) {
        errors.period_debt = "Kì hạn không được bỏ trống"
    }
    if (!formValue.status) {
        errors.status = "Trạng thái phải được chọn"
    }
    if (!formValue.course_id) {
        errors.course_id = "Mã khóa học không được bỏ trống"
    }
    if (!formValue.student_name) {
        errors.student_name = "Tên học viên không được bỏ trống"
    }
    if (!formValue.personnel_id) {
        errors.personnel_id = "Mã nhân viên không được bỏ trống"
    }
    if (!formValue.note) {
        errors.note = "Ghi chú không được bỏ trống"
    }
    if (!formValue.create_date) {
        errors.create_date = "Ngày tạo không được bỏ trống"
    }
    return errors;
}