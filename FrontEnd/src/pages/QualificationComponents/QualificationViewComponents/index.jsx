// src/components/ViewQualificationModal.js
import {Button, Modal} from 'react-bootstrap';

const QualificationViewComponents = ({show, handleClose, qualification}) => {

    if (!qualification) return null;

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết bằng cấp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>ID bằng cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        value={qualification.id}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Tên bằng cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        value={qualification.qualificationName}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Tên nhân viên</label>
                    <input
                        type="text"
                        className="form-control"
                        value={qualification.employeeName}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Thời hạn</label>
                    <input
                        type="date"
                        className="form-control"
                        value={qualification.expiryDate ? new Date(qualification.expiryDate).toISOString().split('T')[0] : ''}
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label>Hình ảnh</label>
                    {qualification.image ? (
                        <div className="mt-2">
                            <img
                                src={`http://localhost:9002${qualification.image}`}
                                alt="Ảnh bằng cấp"
                                className="img-thumbnail mb-2"
                                style={{width: '100px', height: '100px'}}
                            />
                        </div>

                    ) : (
                        <p>Chưa có hình ảnh</p>
                    )}
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default QualificationViewComponents;
