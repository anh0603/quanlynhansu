import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";
import InfoModal from "../DepartmentComponent/ModalDepartment/InfoDepartment";
import {
    createSalaryAdvance, deleteSalaryAdvance,
    fetchSalaryAdvance,
    fetchSalaryAdvanceById,
    updateSalaryAdvance
} from "./service/SalaryAdvanceService";
import SalaryAdvanceTable from "./utils/SalaryAdvanceTable";
import {validateSalaryAdvanceForm} from "./utils/SalaryAdvanceValidation";
import SalaryAdvanceForm from "./utils/SalaryAdvanceFrom";


export default function SalaryAdvanceComponent() {
    const ITEMS_PER_PAGE = 6;
    const [salaryAdvance, setSalaryAdvance] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({title: '', content: ''});
    const [formValue, setFormValue] = useState({
        salaryAdvanceId: "",
        salaryAdvanceDate: "",
        money: "",
        status: "",
        createAt: "",
        updateAt: "",
        employeeId: ""
    })
    const [editingSalaryAdvanceId, setEditingSalaryAdvanceId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = () => {
            fetchSalaryAdvance().then(data => {
                setSalaryAdvance(data);
            }).catch(error => {
                console.error("Error fetching data:", error);
            })
        }
        fetchData();
    }, [])
    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchSalaryAdvanceDate, setSearchSalaryAdvanceDate] = useState('');
    const closeModal = () => setModalOpen(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValue({
            ...formValue, [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateSalaryAdvanceForm(formValue, salaryAdvance, editingSalaryAdvanceId);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const salaryAdvanceData = {
            employeeId: formValue.employeeId,
            money: formValue.money,
            status: formValue.status,
        };
        try {
            let res;
            if (isEditing) {
                res = await updateSalaryAdvance(editingSalaryAdvanceId, salaryAdvanceData);
                setIsEditing(false);
            } else {
                try{
                    res = await createSalaryAdvance(salaryAdvanceData);
                }catch (error){
                    if(error.response && error.response.data && error.response.data.message){
                        toast.error("Không tìm thấy ID nhân sự trong dữ liệu vui lòng kiểm tra lại ở phòng nhân sự");
                    }
                }

            }
            if (res) {
                const updatedSalaryAdvance = await fetchSalaryAdvance();
                setSalaryAdvance(updatedSalaryAdvance);
                toast.success(isEditing ? "Cập nhật thành công!" : "Thêm mới giờ thành công!")
                setFormValue({
                    salaryAdvanceId:"",
                    salaryAdvanceDate:"",
                    money:"",
                    status:"",
                    createAt:"",
                    updateAt:"",
                    employeeId:""
                });
                setEditingSalaryAdvanceId(null);
                setErrors({});
            }
        } catch (error) {
            setErrors(error.response?.data?.errors || {});
        }
    };
    const handleModalInfo = async (item) => {
        const salaryAdvanceId = item.data[0];
        const salaryAdvanceResponse = await fetchSalaryAdvanceById(salaryAdvanceId);
        const salaryAdvance = salaryAdvanceResponse[0];
        if (salaryAdvance) {
            setModalContent({
                title: 'Thông tin chi tiết tạm ứng lương', content: (<div>
                    <div className="form-group">
                        <label htmlFor="overTimeId">ID:</label>
                        <input type="number" id="salaryAdvanceId" className="form-control"
                               value={salaryAdvance.salaryAdvanceId}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="employeeId">ID nhân sự:</label>
                        <input type="number" id="employeeId" className="form-control"
                               value={salaryAdvance.employeeId}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="salaryAdvanceDate">Ngày tạm ứng</label>
                        <input type="text" id="salaryAdvanceDate" className="form-control"
                               value={salaryAdvance.salaryAdvanceDate} disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="money">Số tiền tạm ứng</label>
                        <input type="text" id="money" className="form-control"
                               value={salaryAdvance.money}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="department_Status">Trạng thái:</label>
                        <input type="text" id="department_Status" className="form-control"
                               value={salaryAdvance.status ? "Đã tạm ứng" : "Chưa tạm ứng"}
                               disabled/>
                    </div>
                </div>)
            });
            setModalOpen(true);
        }
    };
    const handleUpdateSalaryAdvance = async (item) => {
        const salaryAdvanceId = item.data[0];
        const salaryAdvanceResponse = await fetchSalaryAdvanceById(salaryAdvanceId);
        const salaryAdvance = salaryAdvanceResponse[0];
        if (salaryAdvance) {
            setFormValue({
                salaryAdvanceId:salaryAdvance.salaryAdvanceId,
                salaryAdvanceDate:salaryAdvance.salaryAdvanceDate,
                money:salaryAdvance.money,
                status:salaryAdvance.status,
                createAt:salaryAdvance.createAt,
                updateAt:salaryAdvance.updateAt,
                employeeId:salaryAdvance.employeeId
            });
            setEditingSalaryAdvanceId(salaryAdvanceId);
            setIsEditing(true);
            setErrors({});
        }
    };
    const handleDeleteSalaryAdvance = async (item) => {
        const salaryAdvanceId = item.data[0];
        const confirmDelete = window.confirm(`Bán muôn xóa ?`);
        if (confirmDelete) {
            try {
                await deleteSalaryAdvance(salaryAdvanceId);
                setSalaryAdvance(salaryAdvance.filter(overtimes => overtimes.id !== salaryAdvanceId));
                toast.success("Xóa thành công");
                const updateOvertimes = await fetchSalaryAdvance();
                setSalaryAdvance(updateOvertimes);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error("Không thể xóa phòng ban khi còn chức vụ hoạt động");
                } else {
                    toast.error("Có lỗi xảy ra khi xóa phòng ban.");
                }
            }
        }
    }
    const handleSearchEmployeeId = (e) => {
        setSearchEmployeeId(e.target.value);
    }
    const handleSearchSalaryAdvance = (e) => {
        setSearchSalaryAdvanceDate(e.target.value);
    }
    const pageCount = Math.ceil(salaryAdvance.length / ITEMS_PER_PAGE);
    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };
    const offset = currentPage * ITEMS_PER_PAGE;
    const paginatedOvertimes = salaryAdvance.slice(offset, offset + ITEMS_PER_PAGE);
    const filteredOvertimes = paginatedOvertimes.filter(salaryAdvance => salaryAdvance.employeeId.toString().includes(searchEmployeeId) && salaryAdvance.salaryAdvanceDate.toLowerCase().includes(searchSalaryAdvanceDate.toLowerCase()));


    const header = ["ID", "Ngày tạm ứng", "Số tiền tạm ứng","Trạng thái", "ID nhân sự", "Chức năng"];
    const row = filteredOvertimes.map((salaryAdvance) => ({
        data: [salaryAdvance.salaryAdvanceId.toString(), salaryAdvance.salaryAdvanceDate, salaryAdvance.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),salaryAdvance.status ?(
            <span className="badge badge-primary">Đã tạm ứng</span>
        ) : (
            <span className="badge badge-danger">Chưa tạm ứng</span>
        ), salaryAdvance.employeeId.toString()],
        actions: [{className: 'btn-info', icon: 'fa-eye', onClick: handleModalInfo}, {
            className: "btn-warning",
            icon: "fa-pen",
            onClick: handleUpdateSalaryAdvance
        }, {className: 'btn-danger', icon: 'fa-trash', onClick: handleDeleteSalaryAdvance}]
    }))
    return (<div>
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1>Quản lý tạm ứng lương</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><NavLink to="#">Home</NavLink></li>
                            <li className="breadcrumb-item active">Quản lý tạm ứng lương</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    {/* FROM INOUT */}
                    <SalaryAdvanceForm formValue={formValue} handleChange={handleChange} handleSubmit={handleSubmit}
                                  isEditing={isEditing} errors={errors}/>
                    {/* LIST Overtime */}
                    <SalaryAdvanceTable header={header} row={row} pageCount={pageCount}
                                   handlePageClick={handlePageClick} searchEmployeeId={searchEmployeeId}
                                   handleSearchEmployeeId={handleSearchEmployeeId}
                                   searchOvertimeDate={searchSalaryAdvanceDate}
                                   handleSearchOvertimeDate={handleSearchSalaryAdvance}/>
                </div>
            </div>
        </section>
        <InfoModal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}
                   content={modalContent.content}/>
    </div>)
}
