import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import DeleteComponent from "../../components/DeleteItemComponent";
import PagingComponent from "../../components/PagingComponent";
import Input from "../../components/InputComponents";
import { BsEye, BsPencil, BsTrash, BsPlus } from "react-icons/bs";
import "./StudentComponent.scss";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";

const MOCKAPI_URL = "https://66b437f79f9169621ea21d35.mockapi.io/students";

const INITIAL_STATE = {
    dataTable: [],
    titleTable: "StudentComponent",
    classTable: "table table-bordered table-hover",
    modalShow: false,
    modalProps: {
        show: false,
        action: "",
        formFieldsProp: [
            {
                name: "student_name",
                type: "text",
                label: "Họ Tên",
                placeholder: "Nhập họ tên học viên",
                validation: Yup.string()
                    .matches(/^[a-zA-Z]+$/, "Student Name can only contain letters")
                    .required("Student Name is required"),
            },
            {
                name: "email",
                type: "text",
                label: "Email",
                placeholder: "Nhập vào email học viên",
                validation: Yup.string()
                    .email("Invalid email format")
                    .required("Email is required"),
            },
            {
                name: "call_number",
                type: "number",
                label: "Số điện thoại",
                placeholder: "Nhập số điện thoại",
                validation: Yup.number()
                    .typeError("call_number must be a number")
                    .required("call_number is required")
                    .positive("call_number must be a positive number")
                    .integer("call_number must be an integer"),
            },
            {
                name: "status",
                type: "select",
                label: "Trạng thái",
                placeholder: "Chọn trạng thái",
                apiUrl: "/data/status.json",
                defaultOption: { value: "", label: "Chọn trạng thái" },
                validation: Yup.string().required("Status is required"),
            },
        ],
        initialIsEdit: false,
        initialIdCurrent: null,
        api: MOCKAPI_URL,
    },
};

const COLUMNS = ["STT", "Họ tên", "Email", "Số điện thoại", "Trạng thái", "Thao tác"];

const StudentComponent = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionModal, setActionModal] = useState("CREATE");
    const [initialIdCurrent, setInitialIdCurrent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        student_name: "",
        email: "",
        call_number: "",
        status: "",
    });

    const api = MOCKAPI_URL;

    const fetchData = useCallback(
        async (search = "", page = 1) => {
            try {
                console.log("kfgnfgdkjnngffjndg");
                const { data } = await axios.get(`${api}?search=${search}&page=${page}&limit=5`);
                setState((prevState) => ({
                    ...prevState,
                    dataTable: data,
                }));
                // setCurrentPage(data.page);
                // setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch data.");
            }
        },
        []
    );

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleSearch = useCallback(() => {
        fetchData(searchTerm, currentPage);
    }, [fetchData,searchTerm, currentPage]);

    // const handleStatusChange = useCallback((event) => {
    //     setStatus(event.target.value);
    // }, []);

    useEffect(() => {
        // console.log("fggdfgfgdf")
        fetchData(searchTerm, currentPage);
        fetchOptions();
    }, []);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    const fetchOptions = useCallback(async () => {
        try {
            const { data } = await axios.get("/data/status.json");
            setStatusOptions(data);
        } catch (error) {
            console.error("Error fetching options:", error);
        }
    }, []);

    const confirmDelete = (item) => {
        setDeleteItemId(item.id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirmation = async () => {

            fetchData(searchTerm, currentPage);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = actionModal === "EDIT" ? `${api}/${initialIdCurrent}` : api;
            const method = actionModal === "EDIT" ? axios.put : axios.post;
            await method(url, formData);
            toast.success(`${actionModal === "EDIT" ? "Updated" : "Added"} successfully!`);
            fetchData(searchTerm, currentPage);
            setFormData({
                id: "",
                student_name: "",
                email: "",
                call_number: "",
                status: "",
            });
        } catch (error) {
            console.error(`Error ${actionModal.toLowerCase()} item:`, error);
            toast.error(`Failed to ${actionModal.toLowerCase()} item.`);
        }
    };

    useEffect(() => {
        if (actionModal === "EDIT" || actionModal === "VIEW") {
            axios
                .get(`${api}/${initialIdCurrent}`)
                .then((res) => setFormData(res.data))
                .catch((err) => console.error("Error fetching data:", err));
        }
    }, [actionModal, initialIdCurrent]);

    return (
        <>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Quản lý học viên</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item active">Home</li>
                                <li className="breadcrumb-item active">Quản lý học viên</li>
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
                                        <h3 className="text-start mb-4">
                                            {actionModal === "EDIT" ? "Cập Nhật" : "Thêm Mới"}
                                        </h3>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="student_name">
                                                    <Form.Label>Tên học viên</Form.Label>
                                                    <Input
                                                        type="text"
                                                        name="student_name"
                                                        value={formData.student_name || ""}
                                                        onChange={handleChange}
                                                        placeholder="Nhập tên học viên"
                                                        className="form-control"
                                                        disabled={actionModal === "VIEW"}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="email">
                                                    <Form.Label>Email</Form.Label>
                                                    <Input
                                                        type="text"
                                                        name="email"
                                                        value={formData.email || ""}
                                                        onChange={handleChange}
                                                        placeholder="Email"
                                                        className="form-control"
                                                        disabled={actionModal === "VIEW"}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="call_number">
                                                    <Form.Label>Số điện thoại</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="call_number"
                                                        value={formData.call_number || ""}
                                                        onChange={handleChange}
                                                        placeholder="Số điện thoại"
                                                        disabled={actionModal === "VIEW"}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group controlId="status">
                                                    <Form.Label>Trạng thái</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="status"
                                                        value={formData.status || ""}
                                                        onChange={handleChange}
                                                        disabled={actionModal === "VIEW"}
                                                    >
                                                        <option value="">Chọn trạng thái</option>
                                                        {statusOptions.map((option) => (
                                                            <option key={option.value} value={option.id}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="d-flex justify-content-center">
                                            <Button
                                                variant="secondary"
                                                className="me-2"
                                                type="button"
                                                onClick={() => setState((prev) => ({ ...prev, modalShow: false }))}
                                            >
                                                Huỷ bỏ
                                            </Button>
                                            {actionModal === "VIEW" ? (
                                                <Button variant="primary" type="button" onClick={() => setActionModal("EDIT")}>
                                                    Chỉnh sửa
                                                </Button>
                                            ) : (
                                                <Button variant="primary" type="submit">
                                                    Lưu lại
                                                </Button>
                                            )}
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex mb-4">

                                        <div className="col-md-6 d-flex align-items-center gap-3">
                                            <input
                                                type="text"
                                                className="form-control rounded-pill border-secondary flex-fill"
                                                placeholder="Search..."
                                                aria-label="Search input"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault();
                                                        handleSearch();
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
                                            <tr key={item.id}>
                                                <td>{index + 10 * (currentPage - 1) + 1}</td>
                                                <td>{item.student_name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.call_number}</td>
                                                <td className={
                                                    item.status === 0
                                                        ? "text-success"
                                                        : item.status === 1
                                                            ? "text-secondary"
                                                            : ""
                                                }>
                                                    {statusOptions.find(status => status.id === item.status)?.name || "N/A"}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="light"
                                                        className="me-1"
                                                        onClick={() => {
                                                            setFormData(item);
                                                            setInitialIdCurrent(item.id);
                                                            setActionModal("VIEW");
                                                        }}
                                                    >
                                                        <BsEye />
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        className="me-1"
                                                        onClick={() => {
                                                            setFormData(item);
                                                            setInitialIdCurrent(item.id);
                                                            setActionModal("EDIT");
                                                        }}
                                                    >
                                                        <BsPencil />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => confirmDelete(item)}
                                                    >
                                                        <BsTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
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

export default StudentComponent;
