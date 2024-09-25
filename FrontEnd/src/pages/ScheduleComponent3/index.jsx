import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Row, Table } from "react-bootstrap";
// import SelectDropdown from '../../components/SelectDownButton';
import DeleteComponent from "../../components/DeleteItemComponent";
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
    const [action, setAction] = useState("CREATE"); //CREATE, EDIT, VIEW
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

    useEffect(() => {
        fetchData("", currentPage);
        console.log("Render SubjectComponent");
    }, [fetchData, currentPage]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    const [statusOptions, setStatusOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);

    // Hàm xử lý xác nhận xóa
    const confirmDelete = (item) => {
        setDeleteItemId(item.id);
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
                            {/* Card Form */}
                            <Card>
                                {/* fill all data in fomrData */}
                                <Card.Body>
                                    {console.log(JSON.stringify(dataForm))}
                                    {console.log(action)}
                                    <Row>
                                        <Row>
                                            <div className="col-6"></div>
                                            <div className="col-6"></div>
                                        </Row>
                                    </Row>
                                    <Row className="">
                                        <Button
                                            variant="light"
                                            className="ms-3"
                                        >
                                            Huy bo
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="ms-3"
                                        >
                                            {action === "CREATE"
                                                ? "Them moi"
                                                : action === "VIEW"
                                                ? "Chinh sua"
                                                : "Cap nhat"}
                                        </Button>
                                    </Row>
                                    {/* <Form>

                                </Form> */}
                                    <div></div>
                                </Card.Body>
                            </Card>
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
                                    </div>

                                    {/* Bảng dữ liệu */}
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                {COLUMNS.map((col) => (
                                                    <th key={col}>{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {state.dataTable.map(
                                                (item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {item.ma_mon_hoc}
                                                        </td>
                                                        <td>
                                                            {item.phong_hoc}
                                                        </td>
                                                        <td>
                                                            {
                                                                item.thoi_gian_bat_dau
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                item.thoi_gian_ket_thuc
                                                            }
                                                        </td>
                                                        <td>{item.ma_lop}</td>
                                                        <td>
                                                            {item.id_nhan_su}
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="light"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => {
                                                                    setDataForm(
                                                                        item
                                                                    );
                                                                    setAction(
                                                                        "VIEW"
                                                                    );
                                                                }}
                                                            >
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => {
                                                                    setDataForm(
                                                                        item
                                                                    );
                                                                    setAction(
                                                                        "EDIT"
                                                                    );
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setDataForm(
                                                                        item
                                                                    );
                                                                    confirmDelete(
                                                                        item
                                                                    );
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </Table>
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
