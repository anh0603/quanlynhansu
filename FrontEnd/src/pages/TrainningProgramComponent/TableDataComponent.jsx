import React, { useState } from 'react';
import { deleteProgram } from '../../services/TrainingProgram';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmComponent from './ConfirmComponent';
import DataTableDetailComponent from './TableDataDetailComponent';
const TableDataComponent = ({ headers, dataTable, handleEditProgram, handleDeleteProgramSuccess }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState();
    const [showDetail, setShowDetail] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const handleShowConfirm = (data) => {
        setSelectedProgram(data);
        setShowConfirm(true);
    };
    const handleViewClick = (data) => {
        setSelectedData(data);
        setShowDetail(true);
    };
    const handleCloseDetail = () => setShowDetail(false);
    const handleCloseConfirm = () => {
        setSelectedProgram(null);
        setShowConfirm(false);
    };
    const handleDelete = () => {
        if (selectedProgram) {
            deleteProgram(selectedProgram.id)
                .then(() => {
                    toast.success('Xóa thành công');
                    handleDeleteProgramSuccess(selectedProgram.id); // Call success handler
                    handleCloseConfirm();
                })
                .catch((error) => {
                    toast.error(`Lỗi khi xóa: ${error.message}`);
                    handleCloseConfirm();
                });
        }
    };

    return (
        <>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr className="text-truncate text-center">
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataTable.map((data, index) => (
                        <tr key={`program-${data.id}`} className="text-truncate text-center">
                            <td>{data.programName}</td>
                            <td>{data.courseName}</td>
                            <td>{data.fee}</td>
                            <td>{data.timeTrainning}</td>
                            <td>{data.status ? (<span className="badge badge-primary">Đang hoạt động</span>) : (<span className="badge badge-danger">Tạm dừng</span>)}</td>
                            <td>
                                <button className='me-2 btn btn-light' onClick={() => handleViewClick(data)} >View</button>
                                <button
                                    className='me-2 btn btn-primary'
                                    onClick={() => handleEditProgram(data)}
                                >
                                    Edit
                                </button>
                                <button className='btn btn-danger' onClick={() => handleShowConfirm(data)}>Delete</button>

                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
            <ConfirmComponent
                show={showConfirm}
                onHide={handleCloseConfirm}
                handleDelete={handleDelete}
            />
            <DataTableDetailComponent
                show={showDetail}
                handleClose={handleCloseDetail}
                data={selectedData}
            />
        </>
    );
};

export default TableDataComponent;