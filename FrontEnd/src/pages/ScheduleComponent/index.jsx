import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import TableComponents from "../../components/TableComponent";
// import SelectDropdown from '../../components/SelectDownButton';
import DeleteComponent from "../../components/DeleteItemComponent";
import FormComponent from "../../components/FormComponent";
import PagingComponent from "../../components/PagingComponent";
import API from "../../store/Api";

// Hằng số định nghĩa trạng thái khởi tạo và các cột của bảng
const INITIAL_STATE = {
    dataTable: [], // Dữ liệu bảng
    titleTable: "ScheduleComponent", // Tiêu đề của bảng
    classTable: "table table-bordered table-hover", // Lớp CSS của bảng
    modalShow: false, // Trạng thái hiển thị modal
    modalProps: {
        show: false,
        action: "",
        formFieldsProp: [
            {
                name: "ma_mon_hoc",
                type: "text",
                label: "Môn Học",
                placeholder: "Nhập tên môn học...",
            },
            {
                name: "phong_hoc",
                type: "text",
                label: "Phòng Học",
                placeholder: "Nhập Phòng Học",
            },
            {
                name: "thoi_gian_bat_dau",
                type: "date",
                label: "Thời Gian Bắt Đầu",
            },

            {
                name: "thoi_gian_ket_thuc",
                type: "date",
                label: "Thời Gian Kết Thúc",
            },
            {
                name: "ma_lop",
                type: "select",
                label: "Mã Lớp",
                placeholder: "Chọn Mã Lớp",
                apiUrl: "/data/IDClass.json", // Cập nhật URL này với API endpoint thực tế của bạn
                defaultOption: { value: "", label: "Chọn Mã Lớp" },
            },
            {
                name: "id_nhan_su",
                type: "select",
                label: "Giảng Viên",
                placeholder: "Chọn Giảng Viên",
                apiUrl: "/data/lecturers.json", // Cập nhật URL này với API endpoint thực tế của bạn
                defaultOption: { value: "", label: "Chọn Giảng Viên" },
            },
        ],
        initialIsEdit: false,
        initialIdCurrent: null,
        api: API.SCHEDULE,
    },
};

// Các cột của bảng
const COLUMNS = [
    "STT",
    "Tên môn học",
    "Phòng Học",
    "Thời Gian Bắt Đầu",
    "Thời Gian Kết Thúc",
    "Mã Lớp",
    "Giảng Viên",
    "",
];

const ScheduleComponent = () => {
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
        ma_mon_hoc: "",
        phong_hoc: "",
        thoi_gian_bat_dau: "",
        thoi_gian_ket_thuc: "",
        ma_lop: "",
        id_nhan_su: "",
    });
    const api = API.SCHEDULE;
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
                console.log(
                    api +
                        {
                            params: {
                                page: page,
                                pageSize: 10,
                                search,
                                status,
                                program,
                            },
                        }
                );
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
                console.log(data);
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

    // const handleProgramChange = useCallback((event) => {
    //     setProgram(event.target.value);
    // }, []);

    // const handleStatusChange = useCallback((event) => {
    //     setStatus(event.target.value);
    // }, []);

    useEffect(() => {
        fetchData("", currentPage);
        console.log("Render SubjectComponent");
    }, [fetchData, currentPage]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    // useEffect(() => {
    //     // fetchData('', currentPage);
    //     fetchOptions();
    // }, []);
    const [statusOptions, setStatusOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    // Fetch options for filters
    // const fetchOptions = useCallback(async () => {
    //     try {
    //         const [statusResponse, programResponse] = await Promise.all([
    //             axios.get("/data/status.json"),
    //             axios.get("/data/program.json"),
    //         ]);
    //         setStatusOptions(statusResponse.data);
    //         setProgramOptions(programResponse.data);
    //     } catch (error) {
    //         console.error("Error fetching options:", error);
    //     }
    // }, []);
    // Hàm xử lý xác nhận xóa
    const confirmDelete = (item) => {
        setDeleteItemId(item.subject_id);
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
                            <h1>Quản lý Lịch Học</h1>
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
                                    Quản lý Lịch Học
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
                        <div className="col-md-4">
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
                        <div className="col-md-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row mb-4">
                                        {/* Bộ lọc*/}

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
                                                size="sm"
                                                aria-label="Search"
                                                className="d-flex align-items-center px-3 rounded-pill"
                                                onClick={handleSearch}
                                            >
                                                <i className="bi bi-search"></i>
                                            </Button>
                                        </div>
                                        {/* /!* Nút thêm mới *!/*/}
                                        {/*<div className="col-md-4 d-flex align-items-center justify-content-end">*/}
                                        {/*    <Button*/}
                                        {/*        variant="primary"*/}
                                        {/*        size="sm"*/}
                                        {/*        onClick={handleModalShow}*/}
                                        {/*        aria-label="Add new item"*/}
                                        {/*        className="d-flex align-items-center px-3 rounded-pill"*/}
                                        {/*    >*/}
                                        {/*        <i className="bi bi-plus-circle me-2"></i>*/}
                                        {/*        Add New*/}
                                        {/*    </Button>*/}
                                        {/*</div> */}
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
                                        actionView={(schedule) => {
                                            setInitialIdCurrent(
                                                schedule.ma_mon_hoc
                                            );
                                            setActionModal("VIEW");
                                            setDataForm(schedule);
                                        }}
                                        actionEdit={(schedule) => {
                                            setInitialIdCurrent(
                                                schedule.ma_mon_hoc
                                            );
                                            setActionModal("EDIT");
                                            setDataForm(schedule);
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

export default ScheduleComponent;
