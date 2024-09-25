// src/components/ViewAllowanceModal.js
import { Button, Modal } from 'react-bootstrap';

const AllowanceViewComponents = ({show, handleClose, allowance}) => {

    if (!allowance) return null;

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết phụ cấp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>ID phụ cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        value={allowance.id}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Tên loại phụ cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        value={allowance.allowanceCategory}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Lương phụ cấp</label>
                    <input
                        type="text"
                        className="form-control"
                        value={allowance.allowanceSalary}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Tên chức vụ</label>
                    <input
                        type="text"
                        className="form-control"
                        value={allowance.positionName}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Trạng thái</label>
                    <input
                        type="text"
                        className="form-control"
                        value={allowance.status === 1 ? 'Active' : 'Inactive'}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Ngày tạo</label>
                    <input
                        type="date"
                        className="form-control"
                        value={allowance.createAt ? new Date(allowance.createAt).toISOString().split('T')[0] : ''}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Ngày sửa</label>
                    <input
                        type="date"
                        className="form-control"
                        value={allowance.updateAt ? new Date(allowance.updateAt).toISOString().split('T')[0] : ''}
                        disabled
                    />
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

export default AllowanceViewComponents;
