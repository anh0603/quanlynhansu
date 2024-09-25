import React from 'react';
import FormInput from "../../../components/FormInputComponents";

const SalaryAdvanceForm = ({formValue, handleChange, handleSubmit, isEditing, errors}) => (

    <div className="col-4">
        <div className="card">
            <h2 className="text-center">Thông tin tạm ứng</h2>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="ID nhân sự"
                        name="employeeId"
                        disabled={isEditing}
                        value={formValue.employeeId.toString() || ""}
                        onChange={e => handleChange(e)}
                        error={errors?.employeeId}
                    />
                    <FormInput
                        type="number"
                        label="Số tiền tạm ứng"
                        name="money"
                        value={formValue.money.toString() || ""}
                        onChange={e => handleChange(e)}
                        error={errors?.money}
                    />
                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select
                            name="status"
                            value={formValue.status !== undefined ? formValue.status.toString() : ""}
                            onChange={e => handleChange(e)}
                            className="form-control"
                        >
                            <option value="" disabled hidden>Chọn trạng thái</option>
                            <option value="1">Đã tạm ứng</option>
                            <option value="0">Chưa tạm ứng</option>
                        </select>
                        {errors?.status && <div className="text-danger">{errors.status}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </button>
                </form>
            </div>
        </div>
    </div>
);

export default SalaryAdvanceForm;