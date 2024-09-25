import React, {useCallback, useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {Button} from 'react-bootstrap';
import TableComponents from '../../components/TableComponent';
import SelectDropdown from '../../components/SelectDownButton';
import PagingComponent from '../../components/PagingComponent';
import ModalComponent from '../../components/ModalComponent';
import API from '../../store/Api';
import DeleteComponent from "../../components/DeleteItemComponent";

// Các hằng số khởi tạo
const INITIAL_STATE = {
    dataTable: [], // Dữ liệu bảng
    titleTable: 'SubjectComponent', // Tiêu đề của bảng
    classTable: 'table table-bordered table-hover', // Lớp CSS của bảng
    modalShow: false, // Trạng thái hiển thị modal
    modalProps: {
        show: false,
        action: '',
        formFieldsProp: [
            {name: 'subject_name', type: 'text', label: 'Subject Name', placeholder: 'Enter the subject name'},
            {name: 'training_duration', type: 'text', label: 'Duration', placeholder: 'Enter duration'},
            {
                name: 'training_program_id',
                type: 'select',
                label: 'Program Name',
                placeholder: 'Select a program',
                apiUrl: '/data/status.json', // Cập nhật URL này thành API thực tế của bạn
                defaultOption: {value: '', label: 'Select a program'}
            },
            {
                name: 'status',
                type: 'select',
                label: 'Status',
                placeholder: 'Select status',
                apiUrl: '/data/status.json', // Cập nhật URL này thành API thực tế của bạn
                defaultOption: {value: '', label: 'Select status'}
            }
        ],
        initialIsEdit: false,
        initialIdCurrent: null,
        api: API.SUBJECT
    }
};

// Các cột của bảng
const COLUMNS = ['STT', 'Tên môn học', 'Thời lượng', 'Tên chương trình học', 'Trạng thái', ''];

const SubjectComponentLayout1 = () => {
    const [state, setState] = useState(INITIAL_STATE); // Trạng thái của component
    const [deleteItemId, setDeleteItemId] = useState(null); // ID của mục đang được xóa
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Trạng thái hiển thị modal xác nhận xóa
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const api = API.SUBJECT;

    // Hàm lấy dữ liệu
    const fetchData = useCallback(async (search = '', page = 1) => {
        try {
            const {data} = await axios.get(api, {
                params: {
                    page: page,
                    pageSize: 10,
                    search
                }
            });
            setState(prevState => ({
                ...prevState,
                dataTable: data.content
            }));
            setCurrentPage(data.page);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    }, [api]);
//Search
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleSearch = useCallback(() => {
        fetchData(searchTerm);
    }, [fetchData, searchTerm]);

    useEffect(() => {
        fetchData('', currentPage);
        console.log('Render SubjectComponent');
    }, [fetchData, currentPage]);

    const handlePageChange = useCallback(pageNumber => {
        setCurrentPage(pageNumber);
    }, []);

    // Xử lý lưu dữ liệu
    const handleSave = useCallback(formData => {
        console.log('Đang lưu dữ liệu...');
        console.log('Dữ liệu biểu mẫu:', formData);
        // Thêm logic lưu dữ liệu ở đây
    }, []);

    // Hiển thị modal
    const handleModalShow = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            modalShow: true,
            modalProps: {
                ...prevState.modalProps,
                show: true,
                onHide: () => setState(prevState => ({...prevState, modalShow: false})),
                onSave: handleSave,
                action: 'CREATE',
                initialIsEdit: true,
                initialIdCurrent: null
            }
        }));
    }, [handleSave]);

    // Các thuộc tính của modal
    const modalProps = useMemo(() => ({
        ...state.modalProps,
        show: state.modalShow,
        onHide: () => setState(prevState => ({...prevState, modalShow: false})),
        onSave: handleSave
    }), [state.modalProps, state.modalShow, handleSave]);

    // Xác nhận xóa mục
    const confirmDelete = (item) => {
        setDeleteItemId(item.subject_id);
        setShowConfirmModal(true);
    };

    // Xử lý xác nhận xóa
    const handleDeleteConfirmation = () => {
        fetchData(); // Cập nhật dữ liệu sau khi xóa
    };

    // Mở modal với các cài đặt khác nhau
    const openModal = (action, isEdit, row) => {
        setState(prevState => ({
            ...prevState,
            modalShow: true,
            modalProps: {
                ...prevState.modalProps,
                show: true,
                onHide: () => setState(prevState => ({...prevState, modalShow: false})),
                onSave: fetchData,
                action,
                initialIsEdit: isEdit,
                initialIdCurrent: row.subject_id
            }
        }));
    };

    return (
        <>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Quản lý Môn học</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <button onClick={() => console.log('Home clicked')}>Home</button>
                                </li>
                                <li className="breadcrumb-item active">Quản lý môn học</li>
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
                                    <div className="row mb-4">
                                        <div className="col-md-4 d-flex align-items-center gap-3">
                                            <SelectDropdown
                                                id="programStatus1"
                                                defaultOption={{value: '', label: 'Chọn trạng thái'}}
                                                apiUrl="/data/status.json"
                                                className="form-select rounded-pill border-secondary flex-fill"
                                            />
                                            <SelectDropdown
                                                id="programStatus2"
                                                defaultOption={{value: '', label: 'Chọn chương trình học'}}
                                                apiUrl="/data/status.json"
                                                className="form-select rounded-pill border-secondary flex-fill"
                                            />
                                        </div>
                                        {/* Ô tìm kiếm và nút tìm kiếm */}
                                        <div className="col-md-4 d-flex align-items-center gap-3">
                                            <input
                                                type="text"
                                                className="form-control rounded-pill border-secondary flex-fill"
                                                placeholder="Search..."
                                                aria-label="Search input"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                aria-label="Search"
                                                className="d-flex align-items-center px-3 rounded-pill"
                                                onClick={handleSearch}
                                            >
                                                <i className="bi bi-search"></i>
                                            </Button>
                                        </div>
                                        <div className="col-md-4 d-flex align-items-center justify-content-end">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={handleModalShow}
                                                aria-label="Add new item"
                                                className="d-flex align-items-center px-3 rounded-pill"
                                            >
                                                <i className="bi bi-plus-circle me-2"></i>
                                                Add New
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <TableComponents
                                                cols={COLUMNS}
                                                dataTable={state.dataTable}
                                                classTable={state.classTable}
                                                api={api}
                                                formFieldsProp={state.modalProps.formFieldsProp}
                                                getData={fetchData}
                                                actionDelete={confirmDelete}
                                                useModal={true}
                                                openModal={openModal}
                                                currentPage={currentPage}
                                            />
                                        </div>
                                    </div>
                                    <div className="row justify-content-center mt-3">
                                        <div className="col-auto">
                                            <PagingComponent
                                                totalPage={totalPages}
                                                currentPage={currentPage}
                                                onPageChange={handlePageChange}
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ModalComponent {...modalProps} getData={fetchData}/>
            <DeleteComponent
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={handleDeleteConfirmation}
                deleteItemID={deleteItemId}
                apiDelete={api}
            />
        </>
    );
};

export default SubjectComponentLayout1;
