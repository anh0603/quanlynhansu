import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";
import InfoModal from "../DepartmentComponent/ModalDepartment/InfoDepartment";
import OvertimeFrom from "./utils/OvertimeFrom";
import OvertimeTable from "./utils/OvertimeTable";
import {
    createOvertime, deleteOvertime, fetchOvertimeById, fetchOvertimes, updateOvertime
} from "./services/OvertimeService";
import {validateOvertimeForm} from "./utils/ValidationOvertime";


export default function OvertimeComponent() {
    const ITEMS_PER_PAGE = 6;
    const [overtimes, setOvertimes] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({title: '', content: ''});
    const [formValue, setFormValue] = useState({
        overTimeId: "",
        overtimeDate: "",
        hours: "",
        multiplier: "",
        status: "",
        createAt: "",
        updateAt: "",
        employeeId: "",
    })
    const [editingOvertimesId, setEditingOvertimesId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = () => {
            fetchOvertimes().then(data => {
                setOvertimes(data);
            }).catch(error => {
                console.error("Error fetching data:", error);
            })
        }
        fetchData();
    }, [])
    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchOvertimeDate, setSearchOvertimeDate] = useState('');
    const closeModal = () => setModalOpen(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValue({
            ...formValue, [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateOvertimeForm(formValue, overtimes, editingOvertimesId);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const overtimeData = {
            employeeId: formValue.employeeId,
            hours: formValue.hours,
            multiplier: formValue.multiplier,
            status: formValue.status,
        };
        try {
            let res;
            if (isEditing) {
                res = await updateOvertime(editingOvertimesId, overtimeData);
                setIsEditing(false);
            } else {
                try{
                    res = await createOvertime(overtimeData);
                }catch (error){
                   if(error.response && error.response.data && error.response.data.message){
                       toast.error("Không tìm thấy ID nhân sự trong dữ liệu vui lòng kiểm tra lại ở phòng nhân sự");
                   }
                }

            }
            if (res) {
                const updatedOvertimes = await fetchOvertimes();
                setOvertimes(updatedOvertimes);
                toast.success(isEditing ? "Cập nhật giờ làm thêm thành công!" : "Thêm mới giờ làm thêm thành công!")
                setFormValue({
                    hours: "",
                    multiplier: "",
                    status: "",
                    overtimeDate: "",
                    updateAt: "",
                    employeeId: "",
                    overTimeId: "",
                    createAt: "",
                });
                setEditingOvertimesId(null);
                setErrors({});
            }
        } catch (error) {
            setErrors(error.response?.data?.errors || {});
        }
    };
    const handleModalInfo = async (item) => {
        const overtimeId = item.data[0];
        const OvertimeResponse = await fetchOvertimeById(overtimeId);
        const overtimes = OvertimeResponse[0];
        if (overtimes) {
            setModalContent({
                title: 'Thông tin chi tiết làm thêm giờ', content: (<div>
                    <div className="form-group">
                        <label htmlFor="overTimeId">ID:</label>
                        <input type="number" id="overTimeId" className="form-control"
                               value={overtimes.overTimeId}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="employeeId">ID nhân sự:</label>
                        <input type="number" id="overTimeId" className="form-control"
                               value={overtimes.employeeId}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="overtimeDate">Ngày làm thêm</label>
                        <input type="text" id="overtimeDate" className="form-control"
                               value={overtimes.overtimeDate} disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="hours">Số giờ làm được</label>
                        <input type="text" id="hours" className="form-control"
                               value={overtimes.hours}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="multiplier">Hệ số</label>
                        <input type="text" id="multiplier" className="form-control"
                               value={overtimes.multiplier}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="department_Status">Trạng thái:</label>
                        <input type="text" id="department_Status" className="form-control"
                               value={overtimes.status ? "Có hiệu lực" : "Vô hiệu lực"}
                               disabled/>
                    </div>
                </div>)
            });
            setModalOpen(true);
        }
    };
    const handleUpdateOvertimes = async (item) => {
        const overtimeId = item.data[0];
        const overtimeResponse = await fetchOvertimeById(overtimeId);
        const overtime = overtimeResponse[0];
        if (overtime) {
            setFormValue({
                employeeId: overtime.employeeId,
                hours: overtime.hours,
                status: overtime.status,
                multiplier: overtime.multiplier,
                overtimeDate: overtime.overtimeDate,
                updateAt: overtime.updateAt,
                overTimeId: overtime.overTimeId,
                createAt: overtime.createAt,
            });
            setEditingOvertimesId(overtimeId);
            setIsEditing(true);
            setErrors({});
        }
    };
    const handleDeleteOvertimes = async (item) => {
        const overtimeId = item.data[0];
        const confirmDelete = window.confirm(`Bán muôn xóa phòng ban này khong?`);
        if (confirmDelete) {
            try {
                await deleteOvertime(overtimeId);
                setOvertimes(overtimes.filter(overtimes => overtimes.id !== overtimeId));
                toast.success("Xóa phòng ban thành công");
                const updateOvertimes = await fetchOvertimes();
                setOvertimes(updateOvertimes);
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
    const handleSearchOvertimeDate = (e) => {
        setSearchOvertimeDate(e.target.value);
    }
    const pageCount = Math.ceil(overtimes.length / ITEMS_PER_PAGE);
    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };
    const offset = currentPage * ITEMS_PER_PAGE;
    const paginatedOvertimes = overtimes.slice(offset, offset + ITEMS_PER_PAGE);
    const filteredOvertimes = paginatedOvertimes.filter(overtimes => overtimes.employeeId.toString().includes(searchEmployeeId) && overtimes.overtimeDate.toLowerCase().includes(searchOvertimeDate.toLowerCase()));


    const header = ["ID", "Ngày tăng ca", "Giờ làm", "Hệ số", "Trạng thái", "ID nhân sự", "Chức năng"];
    const row = filteredOvertimes.map((overtimes) => ({
        data: [overtimes.overTimeId.toString(), overtimes.overtimeDate, overtimes.hours.toString(), overtimes.multiplier.toString(), overtimes.status ?(
            <span className="badge badge-primary">Có hiệu lực</span>
        ) : (
            <span className="badge badge-danger">Vô hiệu lực</span>
        ), overtimes.employeeId.toString()],
        actions: [{className: 'btn-info', icon: 'fa-eye', onClick: handleModalInfo}, {
            className: "btn-warning",
            icon: "fa-pen",
            onClick: handleUpdateOvertimes
        }, {className: 'btn-danger', icon: 'fa-trash', onClick: handleDeleteOvertimes}]
    }))
    return (<div>
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1>Quản lý làm thêm giờ</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><NavLink to="#">Home</NavLink></li>
                            <li className="breadcrumb-item active">Quản lý làm thêm giờ</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    {/* FROM INOUT */}
                    <OvertimeFrom formValue={formValue} handleChange={handleChange} handleSubmit={handleSubmit}
                                  isEditing={isEditing} errors={errors}/>
                    {/* LIST Overtime */}
                    <OvertimeTable header={header} row={row} pageCount={pageCount}
                                   handlePageClick={handlePageClick} searchEmployeeId={searchEmployeeId}
                                   handleSearchEmployeeId={handleSearchEmployeeId}
                                   searchOvertimeDate={searchOvertimeDate}
                                   handleSearchOvertimeDate={handleSearchOvertimeDate}/>
                </div>
            </div>
        </section>
        <InfoModal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}
                   content={modalContent.content}/>
    </div>)
}
