import React, { useEffect, useState } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import { Button, Col, Modal, ModalBody, Row } from 'react-bootstrap';
import { createProgram, updateProgram } from '../../services/TrainingProgram';
import { toast } from 'react-toastify';

const ModalFormComponent = ({ show, handleClose, handleUpdateTable, isEditMode, editData }) => {
    const [programName, setProgramName] = useState('');
    const [course, setCourse] = useState('');
    const [fee, setFee] = useState('');
    const [duration, setDuration] = useState('');
    const [status, setStatus] = useState(true);
    useEffect(() => {
        if (editData && isEditMode) {
            setProgramName(editData.programName);
            setCourse(editData.courseName);
            setFee(editData.fee);
            setDuration(editData.timeTrainning);
            setStatus(editData.status);
        }
    }, [editData, isEditMode]);
    const validate = () => {
        const errors = [];
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (!programName) {
            errors.push('Tên chương trình đào tạo không được để trống');
        } else if (specialCharRegex.test(programName)) {
            errors.push('Tên chương trình đào tạo không được chứa ký tự đặc biệt');
        }

        if (!course) {
            errors.push('Khóa học không được để trống');
        } else if (specialCharRegex.test(course)) {
            errors.push('Khóa học không được chứa ký tự đặc biệt');
        }

        if (!fee) {
            errors.push('Học phí không được để trống');
        } else if (isNaN(fee)) {
            errors.push('Học phí phải là một số');
        }

        if (!duration) {
            errors.push('Thời gian đào tạo không được để trống');
        } else if (specialCharRegex.test(duration)) {
            errors.push('Thời gian đào tạo không được chứa ký tự đặc biệt');
        }

        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return false;
        }

        return true;
    };

    const handleSaveChanges = async () => {

        if (validate()) {
            if (isEditMode) {


                let response = await updateProgram(editData.id, programName, course, parseFloat(fee), duration, status);
                if (response) {
                    handleClose();
                    setProgramName('');
                    setCourse('');
                    setFee('');
                    setDuration('');
                    toast.success("Cập nhật dữ liệu thành công !");
                    handleUpdateTable({ id: editData.id, programName: programName, courseName: course, fee: fee, timeTrainning: duration, status: status });
                } else {
                    toast.error("Lỗi cập nhật")
                }
            } else {

                let response = await createProgram(programName, course, parseFloat(fee), duration);
                if (response && response.id) {
                    handleClose();
                    setProgramName('')
                    setCourse('');
                    setFee('')
                    setDuration('');
                    setStatus(true)
                    toast.success("Thêm dữ liệu thành công !");
                    handleUpdateTable({ programName: programName, courseName: course, fee: fee, timeTrainning: duration, status: status });
                } else {
                    toast.error("Lỗi cập nhật");
                }
            }
        }
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>

            <div className="card card-primary">
                <div className="card-header">
                    <h2 className="card-title" id="modalLabel">{isEditMode ? 'Cập nhật' : 'Thêm mới'}</h2>
                </div>
                <ModalBody>
                    <Row>
                        <Col md={6}>
                            <InputField
                                label="Tên chương trình đào tạo"
                                value={programName}
                                onChange={setProgramName}
                                placeholder="Nhập tên chương trình đào tạo"
                            />
                        </Col>
                        <Col md={6}>
                            <SelectField
                                label="Khóa học"
                                value={course}
                                onChange={setCourse}
                                options={[
                                    { label: '2021', value: 2021 },
                                    { label: '2022', value: 2022 },
                                    { label: '2023', value: 2023 },
                                    { label: '2024', value: 2024 },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <InputField
                                label="Học phí"
                                value={fee}
                                onChange={setFee}
                                placeholder="Học phí"
                            />
                        </Col>
                        <Col md={6}>
                            <InputField
                                label="Thời gian đào tạo"
                                value={duration}
                                onChange={setDuration}
                                placeholder="Thời gian đào tạo"
                            />
                        </Col>
                    </Row>
                    {isEditMode && (
                        <Row>
                            <Col md={6}>
                                <SelectField
                                    label="Trạng thái"
                                    value={status}
                                    onChange={setStatus}
                                    options={[
                                        { label: 'Hoạt động', value: true },
                                        { label: 'Tạm dừng', value: false },
                                    ]}
                                />
                            </Col>
                        </Row>
                    )}
                </ModalBody>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </div>


        </Modal>
    );
};

export default ModalFormComponent;
