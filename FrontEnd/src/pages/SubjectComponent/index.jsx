import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import DeleteComponent from "../../components/DeleteItemComponent";
import PagingComponent from "../../components/PagingComponent";
import API from "../../store/Api";
import FormComponentWithValidation from "../../components/FormComponentWithValidation";
import * as Yup from 'yup';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import "./SubjectComponent.scss";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../components/InputComponents";

const INITIAL_STATE = {
    dataTable: [],
    titleTable: "SubjectComponent",
    classTable: "table table-bordered table-hover",
    modalShow: false,
    modalProps: {
        show: false,
        action: "",
        formFieldsProp: [
            {
                name: "subject_name",
                type: "text",
                label: "Tên môn học",
                placeholder: "Nhập tên môn học",
                validation: Yup.string()
                    .matches(/^[a-zA-Z0-9_-]+$/, 'Tên môn học chỉ chứa kí tự, số, dấu gạch dưới và khoảng tắng')
                    .required('Tên môn học là bắt buộc '),
            },
            {
                name: "training_duration",
                type: "number",
                label: "Thời lượng đào tạo",
                placeholder: "Nhập thời lượng đào tạo",
                validation: Yup.number()
                    .typeError('Thời lượng đào tạo phải là một số')
                    .required('Thời lượng đào tạo là bắt buộc')
                    .positive('Thời lượng đào tạo là một số dương')
                    .integer('Thời lượng đào tạo phải là 1 số nguyên'),
            },
            {
                name: "training_program_id",
                type: "select",
                label: "Chương trình đào tạo",
                placeholder: "Chọn 1 chương trình đào tạo",
                apiUrl: "/data/program.json",
                defaultOption: { value: "", label: "Chọn 1 chương trình đào tạo" },
                validation: Yup.string().required('Tên chương trình là bắt buộc '),
            },
            {
                name: "status",
                type: "select",
                label: "Trạng thái",
                placeholder: "Chọn trạng thái",
                apiUrl: "/data/status.json",
                defaultOption: { value: "", label: "Chọn trạng thái" },
                validation: Yup.string().required('Trạng thái là bắt buộc'),
            },
        ],
        initialIsEdit: false,
        initialIdCurrent: null,
        api: API.SUBJECT,
    },
};

const COLUMNS = [
    "STT",
    "Tên môn học",
    "Thời lượng",
    "Tên chương trình học",
    "Trạng thái",
    "",
];

const SubjectComponent = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionModal, setActionModal] = useState("CREATE");
    const [initialIdCurrent, setInitialIdCurrent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [program, setProgram] = useState("");
    const [status, setStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [statusOptions, setStatusOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [formData, setFormData] = useState({
        subject_id: "",
        subject_name: "",
        status: "",
        training_duration: "",
        training_program_id: "",
    });

    const api = API.SUBJECT;

    // Fetch data with optional filters
    const fetchData = useCallback(
        async (search = "", page = 1) => {
            try {
                if (search !== "" || status !== "" || program !== "") page = 1;
                const { data } = await axios.get(api, {
                    params: {
                        page: page,
                        pageSize: 10,
                        search,
                        status,
                        program,
                    },
                });
                setState(prevState => ({
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
        fetchOptions();
    }, [fetchData, currentPage]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    const fetchOptions = useCallback(async () => {
        try {
            const [statusResponse, programResponse] = await Promise.all([
                axios.get("/data/status.json"),
                axios.get("/data/program.json"),
            ]);
            setStatusOptions(statusResponse.data);
            setProgramOptions(programResponse.data);
        } catch (error) {
            console.error("Error fetching options:", error);
        }
    }, []);

    // Hàm xử lý xác nhận xóa
    const confirmDelete = (item) => {
        setDeleteItemId(item.subject_id);
        setShowConfirmModal(true);
    };


    const handleDeleteConfirmation = async () => {
        fetchData();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = actionModal === 'EDIT' ? `${api}/${initialIdCurrent}` : api;
            const method = actionModal === 'EDIT' ? axios.put : axios.post;
            await method(url, formData);
            toast.success(`${actionModal === 'EDIT' ? 'Cập nhật' : 'Thêm mới'} thành công!`);
            fetchData(searchTerm, currentPage);
            setFormData({
                subject_id: "",
                subject_name: "",
                status: "",
                training_duration: "",
                training_program_id: "",
            });
        } catch (error) {
            console.error(`Error ${actionModal.toLowerCase()} item:`, error);
            toast.error(`Failed to ${actionModal.toLowerCase()} item.`);
        }
    };

    useEffect(() => {
        if (actionModal === 'EDIT' || actionModal === 'VIEW') {
            axios.get(`${api}/${initialIdCurrent}`)
                .then(res => setFormData(res.data))
                .catch(err => console.error('Error fetching data:', err));
        }
    }, [actionModal, initialIdCurrent]);

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
                                <li className="breadcrumb-item active">Home</li>
                                <li className="breadcrumb-item active">Quản lý môn học</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <Form onSubmit={handleSubmit}>
                                        <h3 className="text-start mb-4">{actionModal === "EDIT" ? "Cập Nhật" : "Thêm Mới"}</h3>
                                        <Row>
                                            <Col md={6} className='mb-3'>
                                                <Form.Group controlId="subject_name">
                                                    <Form.Label>Tên môn học</Form.Label>
                                                    <Input
                                                        type="text"
                                                        name="subject_name"
                                                        value={formData.subject_name || ''}
                                                        onChange={handleChange}
                                                        placeholder="Nhập tên môn học"
                                                        className="form-control"
                                                        disabled={actionModal === "VIEW"}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className='mb-3'>
                                                <Form.Group controlId="training_duration">
                                                    <Form.Label>Thời lượng</Form.Label>
                                                    <Input
                                                        type="number"
                                                        name="training_duration"
                                                        value={formData.training_duration || ''}
                                                        onChange={handleChange}
                                                        placeholder="Nhập thời lượng"
                                                        className="form-control"
                                                        disabled={actionModal === "VIEW"}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className='mb-3'>
                                                <Form.Group controlId="training_program_id">
                                                    <Form.Label>Chương trình đào tạo</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="training_program_id"
                                                        value={formData.training_program_id || ''}
                                                        onChange={handleChange}
                                                        disabled={actionModal === "VIEW"}
                                                    >
                                                        <option value="">Chọn chương trình đào tạo</option>
                                                        {programOptions.map(option => (
                                                            <option key={option.value} value={option.id}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className='mb-3'>
                                                <Form.Group controlId="status">
                                                    <Form.Label>Trạng thái</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="status"
                                                        value={formData.status || ''}
                                                        onChange={handleChange}
                                                        disabled={actionModal === "VIEW"}
                                                    >
                                                        <option value="">Chọn trạng thái</option>
                                                        {statusOptions.map(option => (
                                                            <option key={option.value} value={option.id}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="d-flex justify-content-center">
                                            <Button variant="secondary" className="me-2" type="button" onClick={() => setState(prev => ({ ...prev, modalShow: false }))}>Huỷ bỏ</Button>
                                            {actionModal === 'VIEW'
                                                ? <Button variant="primary" type="button">Chỉnh sửa</Button>
                                                : <Button variant="primary" type="submit">Lưu lại</Button>
                                            }
                                        </div>
                                        {/*<ToastContainer/> /!* Add ToastContainer here *!/*/}
                                    </Form>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <h3 className="text-start mb-4">Danh sách môn học</h3>
                                    <div className="d-flex mb-4">
                                        {/* Bộ lọc */}
                                        <div className="col-md-3 d-flex align-items-center gap-3">
                                            <Form.Select
                                                id="programStatus2"
                                                aria-label="Program"
                                                className="form-select rounded-pill border-secondary flex-fill"
                                                value={program}
                                                onChange={handleProgramChange}
                                            >
                                                <option value="">
                                                    Chọn chương trình học
                                                </option>
                                                {programOptions.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.id}
                                                        >
                                                            {option.name}
                                                        </option>
                                                    )
                                                )}
                                            </Form.Select>
                                        </div>
                                        <div className="col-md-3 d-flex align-items-center gap-3">
                                            <Form.Select
                                                id="programStatus1"
                                                aria-label="Status"
                                                className="form-select rounded-pill border-secondary flex-fill"
                                                value={status}
                                                onChange={handleStatusChange}
                                            >
                                                <option value="">
                                                    Chọn trạng thái
                                                </option>
                                                {statusOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.id}
                                                    >
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                        <div className="col-md-6 d-flex align-items-center gap-3">
                                            <input
                                                type="text"
                                                className="form-control rounded-pill border-secondary flex-fill"
                                                placeholder="Search..."
                                                aria-label="Search input"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter
                                                        handleSearch(); // Gọi hàm tìm kiếm
                                                    }
                                                }}
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
                                    <Table className={state.classTable}>
                                        <thead>
                                        <tr>
                                            {COLUMNS.map((col, index) => (
                                                <th key={index}>{col}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {state.dataTable.map((item, index) => (
                                            <tr key={item.subject_id}>
                                                <td>{index + 10 * (currentPage - 1) + 1}</td>
                                                <td>{item.subject_name}</td>
                                                <td>{item.training_duration}</td>
                                                <td>
                                                    {programOptions.find(program => program.id === item.training_program_id)?.name || 'N/A'}
                                                </td>
                                                <td className={item.status === 0 ? "text-success": item.status === 1 ? "text-secondary" : ""}>
                                                    {statusOptions.find(status => status.id === item.status)?.name || 'N/A'}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="light"
                                                        className="me-1"
                                                        onClick={() => {
                                                           setFormData(item)
                                                            setInitialIdCurrent(item.subject_id);
                                                           setActionModal('VIEW')
                                                        }}
                                                    >
                                                        <BsEye />
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        className="me-1"
                                                        onClick={() => {
                                                            setFormData(item)
                                                            setInitialIdCurrent(item.subject_id);
                                                            setActionModal('EDIT')
                                                        }}
                                                    >
                                                        <BsPencil />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => confirmDelete(item)}
                                                    >
                                                        <BsTrash/>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
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
            <ToastContainer />
            {/* Modal xác nhận xóa */}
            {/* Modal xác nhận xóa */}
            <DeleteComponent
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={() => fetchData()}
                deleteItemID={deleteItemId}
                apiDelete={api}
            />
        </>
    );
};

export default SubjectComponent;
