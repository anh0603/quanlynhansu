import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
//import {useModal,actionEdit,row,openModal,row}  from "../../components/TableComponent";
import TableComponents from '../../components/TableComponent';
// import SelectDropdown from '../../components/SelectDownButton';
import DeleteComponent from "../../components/DeleteItemComponent";
import FormComponent from "../../components/FormComponent";
import PagingComponent from "../../components/PagingComponent";
import API from "../../store/Api";

// Hằng số định nghĩa trạng thái khởi tạo và các cột của bảng
const INITIAL_STATE = {
    dataTable: [], // Dữ liệu bảng
    titleTable: "CourseComponent", // Tiêu đề của bảng
    classTable: "table table-bordered table-hover", // Lớp CSS của bảng
    modalShow: false, // Trạng thái hiển thị modal
    modalProps: {
        show: false,
        action: "",
        formFieldsProp: [
            {
                name: "nam_khoa_hoc",
                type: "text",
                label: "Năm khóa học",
                placeholder: "Nhập năm khóa học",
            },
        ],
        initialIsEdit: false,
        initialIdCurrent: null,
        api: API.COURSE,
    },
};

// Các cột của bảng
const COLUMNS = [
    "STT",
    "Năm khóa học",
    "",
];

const CourseComponent = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionModal, setActionModal] = useState("CREATE");
    const [initialIdCurrent, setInitialIdCurrent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [program, setProgram] = useState("");
    const [status, setStatus] = useState("");
    const [dataForm, setDataForm] = useState({
        ma_khoa_hoc: "",
        nam_khoa_hoc: "",
    });

    const api = API.COURSE;

    // Fetch data with optional filters
    const fetchData = useCallback(
        async (search = "", page = 1) => {
            try {
                console.log("RENDER with", {
                    page: page,
                    pageSize: 10,
                    search,
                    status,
                    program,
                });
                const { data } = await axios.get(api, {
                    params: {
                        page: page,
                        pageSize: 10,
                        search,
                        status,
                        program,
                    },
                });
                setState((prevState) => ({
                    ...prevState,
                    dataTable: data.content,
                }));
                setCurrentPage(data.page);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        [api, status, program]
    );


    //Search
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleSearch = useCallback(() => {
        fetchData(searchTerm);
    }, [fetchData, searchTerm]);

    const handleProgramChange = useCallback((event) => {
        setProgram(event.target.value);
    }, []);

    const handleStatusChange = useCallback((event) => {
        setStatus(event.target.value);
    }, []);
    

    useEffect(() => {
        fetchData("", currentPage);
        console.log("Render CourseComponent");
    }, [fetchData, currentPage]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);
    
    // Hàm xử lý xác nhận xóa
    const confirmDelete = (item) => {
        setDeleteItemId(item.ma_khoa_hoc);
        setShowConfirmModal(true);
    };

    // Hàm xử lý xác nhận xóa và cập nhật dữ liệu
    const handleDeleteConfirmation = () => {
        fetchData();
    };

    return (
        <>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Quản lý khóa học</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <button
                                        onClick={() =>
                                            console.log("Home clicked")
                                        }
                                    >
                                        Home
                                    </button>
                                </li>
                                <li className="breadcrumb-item active">
                                Quản lý khóa học
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        {/* Card cho Form Component */}
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <FormComponent
                                        title={
                                            actionModal === "EDIT"
                                                ? "Cập Nhật"
                                                : actionModal === "CREATE"
                                                ? "Thêm Mới"
                                                : "Chi tiết"
                                        }
                                        fields={state.modalProps.formFieldsProp}
                                        getData={fetchData}
                                        action={actionModal}
                                        idCurrent={initialIdCurrent}
                                        onClose={() => {
                                            // Refresh page by fetching data again
                                            fetchData(searchTerm, currentPage);
                                            setInitialIdCurrent(null); // Reset current ID if needed
                                            setActionModal("CREATE"); // Reset action if needed
                                        }}
                                        api={api}
                                        dataForm={dataForm}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card cho các bộ lọc, ô tìm kiếm và nút thêm mới */}
                        <div className="col-md-9">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row mb-4">
                                        {/* Bộ lọc */}
                                        <div className="col-md-2 d-flex align-items-center gap-3">
                                        </div>
                                        <div className="col-md-6 d-flex align-items-center gap-3">
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
                                                size="m"
                                                aria-label="Search"
                                                className="d-flex align-items-center px-3 rounded-pill"
                                                onClick={handleSearch}
                                            >
                                                <i className="bi bi-search"></i>
                                            </Button>
                                        </div>
                                        {/*/!* Nút thêm mới *!/*/}
                                        <div className="col-md-3 d-flex align-items-center justify-content-end">
                                           <Button
                                                variant="primary"
                                                size="m"
                                                onClick={setShowConfirmModal}
                                                aria-label="Add new item"
                                                className="d-flex align-items-center px-3 rounded-pill"
                                           >
                                               <i className="bi bi-plus-circle me-2"></i>
                                               Thêm mới
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Bảng dữ liệu */}
                                    <TableComponents
                                        cols={COLUMNS}
                                        dataTable={state.dataTable}
                                        classTable={state.classTable}
                                        api={api}
                                        formFieldsProp={
                                            state.modalProps.formFieldsProp
                                        }
                                        getData={fetchData}
                                        actionView={(khoa_hoc) => {
                                            setInitialIdCurrent(
                                                khoa_hoc.ma_khoa_hoc
                                            );
                                            setActionModal("VIEW");
                                            setDataForm(khoa_hoc);
                                        }}
                                        actionEdit={(khoa_hoc) => {
                                            setInitialIdCurrent(
                                                khoa_hoc.ma_khoa_hoc
                                            );
                                            setActionModal("EDIT");
                                            setDataForm(khoa_hoc);
                                        }}
                                        actionDelete={confirmDelete}
                                        useModal={false}
                                        currentPage={currentPage}
                                    />

                                    {/* Phân trang */}
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal xác nhận xóa */}
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

export default CourseComponent;
