import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import SearchComponent from '../TrainningProgramComponent/SearchComponent';
import { fetchAllTrainingPrograms } from '../../services/TrainingProgram';
import TableDataComponent from './TableDataComponent';
import ReactPaginate from 'react-paginate';
import ModalFormComponent from './ModalFormComponent';
import { ToastContainer, toast } from 'react-toastify';
import NotificationComponent from '../../components/NotificationComponent';


const TrainningProgramComponent = () => {
    const [dataTable, setDataTable] = useState([]);
    const cols = ['Tên chương trình', 'Khóa học', 'Học phí', 'Thời gian đào tạo', 'Trạng thái', '']
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isShowModal, setIsShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    useEffect(() => {
        //call api
        getAllTrainningProgram(1);
    }, []);
    const getAllTrainningProgram = async (page) => {
        let response = await fetchAllTrainingPrograms(page);
        if (response || response.data) {
            // console.log("DATA" + JSON.stringify(response))
            setDataTable(response);
            setTotalPages(10);

        }
    };
    const handleClose = () => {
        setIsShowModal(false)
        setIsEditMode(false);
    }
    const handleUpdateTable = (data) => {
        if (isEditMode == true) {
            setDataTable(dataTable.map((item) => item.id === data.id ? data : item));
        } else {
            setDataTable([data, ...dataTable]);
        }
    }
    const handleEditProgram = (data) => {
        setIsEditMode(true)
        setEditData(data);
        setIsShowModal(true);
    };
    const handleDeleteProgramSuccess = (id) => {
        // setDataTable(dataTable.filter((item) => item.id !== id));
        getAllTrainningProgram(currentPage);
    };
    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
        getAllTrainningProgram(+event.selected + 1);
    };

    const viewProgram = () => {

    }
    return (
        <>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Quản lý chương trình đào tạo</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Quản lý chương trình đào tạo</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col">
                            <div className="card card-primary">
                                <div className="card-body">
                                    <div className="row align-items-center ">
                                        <div className="col-md-2 d-flex align-items-center justify-content-start">
                                            <Button variant="primary btn-sm" size="lg" onClick={() => setIsShowModal(true)}>
                                                {/* <i className="bi bi-plus-circle"></i> */}Thêm mới
                                            </Button>
                                        </div>
                                        <div className="col-md-10 d-flex align-items-center gap-3 justify-content-end">
                                            <SearchComponent></SearchComponent>
                                        </div>

                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <TableDataComponent headers={cols}
                                                dataTable={dataTable}
                                                handleEditProgram={handleEditProgram}
                                                handleDeleteProgramSuccess={handleDeleteProgramSuccess}

                                            />

                                        </div>
                                    </div>
                                    <div className="row justify-content-center mt-3">
                                        <div className="col-auto">
                                            <ReactPaginate
                                                breakLabel="..."
                                                nextLabel="next >"
                                                onPageChange={handlePageClick}
                                                pageRangeDisplayed={5}
                                                pageCount={totalPages}
                                                previousLabel="< previous"
                                                renderOnZeroPageCount={null}
                                                pageClassName='page-item'
                                                pageLinkClassName='page-link'
                                                previousClassName='page-item'
                                                previousLinkClassName='page-link'
                                                nextClassName='page-item'
                                                nextLinkClassName='page-link'
                                                breakClassName='page-item'
                                                breakLinkClassName='page-link'
                                                containerClassName='pagination'
                                                activeClassName='active'
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="card-footer">

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ModalFormComponent
                show={isShowModal}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
                editData={editData}
                isEditMode={isEditMode}
            />
            <NotificationComponent></NotificationComponent>


        </>
    );
};

export default TrainningProgramComponent;