import React from "react";
import { Modal } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import InputComponents from "../../../components/InputComponents";
import ButtonComponents from "../../../components/ButtonComponents";
import moment from 'moment';

const contractTypeMap = {
  fulltime: "Hợp đồng lao động chính thức",
  parttime: "Hợp đồng lao động parttime",
  freelance: "Hợp đồng Freelance",
  probationary: "Hợp đồng thử việc",
  intern: "Hợp đồng thực tập",
};
 // Format lại Time : Star,end,create_at, update_at
// contract.dateEnd ? moment(contract.dateEnd).format('YYYY-MM-DD, h:mm:ss a') : ""
// 
const ContractViewComponents = ({ show, handleClose, contract }) => {
  if (!contract) return null;

  // Xử lý contract.description là chuỗi
  const contentList = contract.contentContract ? contract.contentContract.split(',') : [];

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết hợp đồng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <InputComponents
                  label="ID"
                  type="text"
                  name="id"
                  value={contract.id}
                  disabled
              />
            </div>
            <div className="col-md-6">
              <InputComponents
                  label="Mã nhân viên"
                  type="text"
                  name="employeeCode"
                  value={contract.employeeCode}
                  disabled
              />
            </div>
            <div className="col-md-6">
              <InputComponents
                  label="Mã hợp đồng"
                  type="text"
                  name="contractId"
                  value={contract.contractCode}
                  disabled
              />
            </div>
            <div className="col-md-6">
              <InputComponents
                  label="Loại hợp đồng"
                  type="text"
                  name="contractType"
                  value={
                      contractTypeMap[contract.contractCategory] || "Không xác định"
                  }
                  disabled
              />
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Mức lương</label>
                <NumericFormat
                    value={contract.salary}
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
                  label="Ngày bắt đầu"
                  type="text"
                  name="startDate"
                  value={contract.dateStart ? moment(contract.dateStart).format('YYYY-MM-DD') : ""}
                  disabled
              />
            </div>
            <div className="col-md-6">
              <InputComponents
                  label="Ngày kết thúc"
                  type="text"
                  name="endDate"
                  value={contract.dateEnd ? moment(contract.dateEnd).format('YYYY-MM-DD') : ""}
                  disabled
              />
            </div>
            <div className="col-md-6">
              <InputComponents
                  label="Ngày tạo"
                  type="text"
                  name="created_at"
                  value={contract.createAt ? moment(contract.createAt).format('YYYY-MM-DD, h:mm:ss a') : ""}
                  disabled
              />
            </div>
            <div className="col-md-6">
              <InputComponents
                  label="Ngày cập nhật"
                  type="text"
                  name="updated_at"
                  value={contract.updateAt ? moment(contract.updateAt).format('YYYY-MM-DD, h:mm:ss a') : ""}
                  disabled
              />
            </div>
            <div className="col-md-6">
              <InputComponents
                  label="Trạng thái"
                  type="text"
                  name="status"
                  value={contract.status ? "Còn hạn" : "Hết hạn"}
                  disabled
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              {contentList.length === 1
                  ? `Có 1 hồ sơ:`
                  : `Có ${contentList.length} hồ sơ`}
            </label>
            {contentList.length > 0 ? (
                contentList.length === 1 ? (
                    <div className="mt-2">
                      <button
                          className="btn btn-primary mr-2"
                          onClick={() => window.open(`http://localhost:9002${contentList[0]}`, '_blank')}>
                        Xem chi tiết
                      </button>
                    </div>
                ) : (
                    <ul className="list-group mt-2">
                      {contentList.map((desc, index) => (
                          <li key={index} className="list-group-item">
                            <a
                                href={`http://localhost:9002${desc}`}
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

export default ContractViewComponents;
