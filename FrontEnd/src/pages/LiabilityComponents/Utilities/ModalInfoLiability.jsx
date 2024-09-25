import React, {useState} from "react";
import {studentFields, liabilityFields} from './Field'
import {convertDateToISO} from "./DateLiability";

const ModalInfoLiability = ({liability}) => {

    const renderFields = (fields) => {
        return fields.map((field, index) => {
            let value = liability ? liability[field.id] : "";
            if (field.type === 'date') {
                value = convertDateToISO(value);
            }
            return (
                <div className="form-group title_info" key={index}>
                    <label htmlFor={field.id} className="title_Student">{field.label}</label>
                    <input type={field.type} id={field.id} className="form-control input    "
                           value={value}
                           disabled/>
                </div>
            )
        });
    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="card col-6">
                        <h5 className="info_Student">Thông tin học viên</h5>
                        <div className="list_info_Student">
                            {renderFields(studentFields)}
                        </div>
                    </div>
                    <div className="card col-6">
                        <h5 className="info_Liability">Học phí phải trả</h5>
                        <div className="list_info_Liability">
                            {renderFields(liabilityFields)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ModalInfoLiability;