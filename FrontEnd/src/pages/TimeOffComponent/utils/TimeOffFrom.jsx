import React from 'react';
import FormInput from "../../../components/FormInputComponents";
import {formatDateToInput} from "./Date";

const TimeOffForm = ({formValue, handleChange, handleSubmit, isEditing, errors}) => (

    <div className="col-4">
        <div className="card">
            <h2 className="text-center">Thông tin nghỉ phép</h2>
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
                        type="date"
                        label="Ngày bắt đầu"
                        disabled={isEditing}
                        name="dateStart"
                        value={formatDateToInput(formValue.dateStart)}
                        onChange={e => handleChange(e)}
                        error={errors?.dateStart}
                    />
                    <FormInput
                        type="date"
                        label="Ngày bắt kết thúc"
                        name="dateEnd"
                        value={formatDateToInput(formValue.dateEnd)}
                        onChange={e => handleChange(e)}
                        error={errors?.dateEnd}
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
                            <option value="1">Có hiệu lực</option>
                            <option value="0">Hết hiệu lực</option>
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

export default TimeOffForm;