import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import InputComponents from "../../../components/InputComponents";
import ButtonComponents from "../../../components/ButtonComponents";
import moment from 'moment';

const decisionsTypeMap = {
    reward: "Khen Thưởng",
    discipline: "Kỷ luật",
};

const DecisionViewComponents = ({ show, handleClose, decision, baseUrl }) => {
    const decisionList = useMemo(() => {
        return decision && decision.rdImages ? decision.rdImages.split(',') : [];
    }, [decision]);

    const handleOpenFile = (filePath) => {
        window.open(`${baseUrl}${filePath}`, '_blank');
    };

    if (!decision) return null;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết quyết định</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <InputComponents
                                label="ID"
                                type="text"
                                name="id"
                                value={decision.id}
                                disabled
                            />
                        </div>
                        <div className="col-md-6">
                            <InputComponents
                                label="Mã nhân viên"
                                type="text"
                                name="employeeCode"
                                value={decision.employeeCode}
                                disabled
                            />
                        </div>
                        <div className="col-md-6">
                            <InputComponents
                                label="Mã quyết định"
                                type="text"
                                name="rdCode"
                                value={decision.rdCode}
                                disabled
                            />
                        </div>
                        <div className="col-md-6">
                            <InputComponents
                                label="Loại quyết định"
                                type="text"
                                name="category"
                                value={decisionsTypeMap[decision.category] || "Không xác định"}
                                disabled
                            />
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Mức tiền</label>
                                <NumericFormat
                                    value={decision.money}
                                    displayType={"text"}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix=""
                                    className="form-control"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <InputComponents
                                label="Ngày quyết định"
                                type="text"
                                name="decisionDate"
                                value={decision.decisionDate ? moment(decision.decisionDate).format('YYYY-MM-DD') : ""}
                                disabled
                            />
                        </div>

                        <div className="col-md-6">
                            <InputComponents
                                label="Ngày tạo"
                                type="text"
                                name="createAt"
                                value={decision.createAt ? moment(decision.createAt).format('YYYY-MM-DD, h:mm:ss a') : ""}
                                disabled
                            />
                        </div>
                        <div className="col-md-6">
                            <InputComponents
                                label="Ngày cập nhật"
                                type="text"
                                name="updateAt"
                                value={decision.updateAt ? moment(decision.updateAt).format('YYYY-MM-DD, h:mm:ss a') : ""}
                                disabled
                            />
                        </div>
                        <div className="col-md-6">
                            <InputComponents
                                label="Trạng thái"
                                type="text"
                                name="status"
                                value={decision.status ? "Còn hạn" : "Hết hạn"}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            {decisionList.length === 1
                                ? `Có 1 hồ sơ:`
                                : `Có ${decisionList.length} hồ sơ`}
                        </label>
                        {decisionList.length > 0 ? (
                            decisionList.length === 1 ? (
                                <div className="mt-2">
                                    <button
                                        className="btn btn-primary mr-2"
                                        onClick={() => handleOpenFile(decisionList[0])}>
                                        Xem chi tiết
                                    </button>
                                </div>
                            ) : (
                                <ul className="list-group mt-2">
                                    {decisionList.map((desc, index) => (
                                        <li key={index} className="list-group-item">
                                            <a
                                                href={`${baseUrl}${desc}`}
                                                download={desc}
                                            >
                                                {desc}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )
                        ) : (
                            <p>Chưa có hồ sơ hợp đồng</p>
                        )}
                    </div>

                </div>
            </Modal.Body>

            <Modal.Footer>
                <ButtonComponents variant="secondary" onClick={handleClose}>
                    Đóng
                </ButtonComponents>
            </Modal.Footer>
        </Modal>
    );
};

export default DecisionViewComponents;
