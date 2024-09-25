import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";
import InfoModal from "../DepartmentComponent/ModalDepartment/InfoDepartment";
import {createTimeOff, deleteTimeOff, fetchTimeOff, fetchTimeOffById, updateTimeOff} from "./service/TimeOffService";
import {validateTimeOffForm} from "./utils/TimeOffValidation";
import TimeOffFrom from "./utils/TimeOffFrom";
import TimeOffTable from "./utils/TimeOffTable";
import {formatDateFromInput} from "./utils/Date";


export default function TimeOffComponent() {
    const ITEMS_PER_PAGE = 6;
    const [timeOff, setTimeOff] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({title: '', content: ''});
    const [formValue, setFormValue] = useState({
        timeOffId: "",
        dateStart: "",
        dateEnd: "",
        dayNumber: "",
        status: "",
        createAt: "",
        updateAt: "",
        employeeId: ""
    })
    const [editingTimeOffId, setEditingTimeOffId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = () => {
            fetchTimeOff().then(data => {
                setTimeOff(data);
            }).catch(error => {
                console.error("Error fetching data:", error);
            })
        }
        fetchData();
    }, [])
    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchDayNumber, setSearchDayNumber] = useState('');
    const closeModal = () => setModalOpen(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        let formattedValue = value;
        if (name === "dateStart" || name === "dateEnd") {
            formattedValue = formatDateFromInput(value);
        }
        setFormValue({
            ...formValue, [name]: formattedValue
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateTimeOffForm(formValue, timeOff, editingTimeOffId);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const timeOffData = {
            employeeId: formValue.employeeId,
            dateStart: formValue.dateStart,
            dateEnd: formValue.dateEnd,
            status: formValue.status
        };
        try {
            let res;
            if (isEditing) {
                res = await updateTimeOff(editingTimeOffId, timeOffData);
                setIsEditing(false);
            } else {
                try {
                    res = await createTimeOff(timeOffData);
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.message) {
                        toast.error("Không tìm thấy ID nhân sự trong dữ liệu vui lòng kiểm tra lại ở phòng nhân sự");
                    }
                }

            }
            if (res) {
                const updatedTimeOff = await fetchTimeOff();
                setTimeOff(updatedTimeOff);
                toast.success(isEditing ? "Cập nhật thành công!" : "Thêm mới giờ thành công!")
                setFormValue({
                    timeOffId: "",
                    dateStart: "",
                    dateEnd: "",
                    dayNumber: "",
                    status: "",
                    createAt: "",
                    updateAt: "",
                    employeeId: ""
                });
                setEditingTimeOffId(null);
                setErrors({});
            }
        } catch (error) {
            setErrors(error.response?.data?.errors || {});
        }
    };
    const handleModalInfo = async (item) => {
        const timeOffId = item.data[0];
        const timeOffResponse = await fetchTimeOffById(timeOffId);
        const timeOff = timeOffResponse[0];
        if (timeOff) {
            setModalContent({
                title: 'Thông tin chi tiết nghỉ phép', content: (<div>
                    <div className="form-group">
                        <label htmlFor="timeOffId">ID:</label>
                        <input type="number" id="timeOffId" className="form-control"
                               value={timeOff.timeOffId}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="employeeId">ID nhân sự:</label>
                        <input type="number" id="employeeId" className="form-control"
                               value={timeOff.employeeId}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateStart">Ngày bắt đầu</label>
                        <input type="text" id="dateStart" className="form-control"
                               value={timeOff.dateStart} disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateEnd">Ngày kết thúc</label>
                        <input type="text" id="dateEnd" className="form-control"
                               value={timeOff.dateEnd}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dayNumber">Số ngày nghỉ</label>
                        <input type="text" id="dayNumber" className="form-control"
                               value={timeOff.dayNumber}
                               disabled/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Trạng thái:</label>
                        <input type="text" id="status" className="form-control"
                               value={timeOff.status ? "Có hiệu lực" : "Hết hiệu lực"}
                               disabled/>
                    </div>
                </div>)
            });
            setModalOpen(true);
        }
    };
    const handleUpdateTimeOff = async (item) => {
        const timeOffId = item.data[0];
        const timeOffResponse = await fetchTimeOffById(timeOffId);
        const timeOff = timeOffResponse[0];
        if (timeOff) {
            setFormValue({
                timeOffId: timeOff.timeOffId,
                dateStart: timeOff.dateStart,
                dateEnd: timeOff.dateEnd,
                dayNumber: timeOff.dayNumber,
                status: timeOff.status,
                createAt: timeOff.createAt,
                updateAt: timeOff.updateAt,
                employeeId: timeOff.employeeId
            });
            setEditingTimeOffId(timeOffId);
            setIsEditing(true);
            setErrors({});
        }
    };
    const handleDeleteTimeOff = async (item) => {
        const timeOffId = item.data[0];
        const confirmDelete = window.confirm(`Bán muôn xóa ?`);
        if (confirmDelete) {
            try {
                await deleteTimeOff(timeOffId);
                setTimeOff(timeOff.filter(timeOff => timeOff.id !== timeOffId));
                toast.success("Xóa thành công");
                const updateTimeOff = await fetchTimeOff();
                setTimeOff(updateTimeOff);
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    const handleSearchEmployeeId = (e) => {
        setSearchEmployeeId(e.target.value);
    }
    const handleSearchDayNumber = (e) => {
        setSearchDayNumber(e.target.value);
        console.log(e.target.value)
    }
    const pageCount = Math.ceil(timeOff.length / ITEMS_PER_PAGE);
    const handlePageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };
    const offset = currentPage * ITEMS_PER_PAGE;
    const paginatedOvertimes = timeOff.slice(offset, offset + ITEMS_PER_PAGE);
    const filteredOvertimes = paginatedOvertimes.filter(timeOff => timeOff.employeeId.toString().includes(searchEmployeeId) && timeOff.dayNumber.toString().includes(searchDayNumber.toLowerCase()));


    const header = ["ID", "Ngày bắt đầu", "Ngày kết thúc", "Số ngày", "Trạng thái", "ID nhân sự", "Chức năng"];
    const row = filteredOvertimes.map((timeOff) => ({
        data: [timeOff.timeOffId.toString(), timeOff.dateStart, timeOff.dateEnd, timeOff.dayNumber.toString(), timeOff.status ? (
            <span className="badge badge-primary">Có hiệu lực</span>
        ) : (
            <span className="badge badge-danger">Hết hiệu lực</span>
        ), timeOff.employeeId.toString()],
        actions: [{className: 'btn-info', icon: 'fa-eye', onClick: handleModalInfo}, {
            className: "btn-warning",
            icon: "fa-pen",
            onClick: handleUpdateTimeOff
        }, {className: 'btn-danger', icon: 'fa-trash', onClick: handleDeleteTimeOff}]
    }))
    return (<div>
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1>Quản lý nghỉ phép</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><NavLink to="#">Home</NavLink></li>
                            <li className="breadcrumb-item active">Quản lý nghỉ phép</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    {/* FROM INOUT */}
                    <TimeOffFrom formValue={formValue} handleChange={handleChange} handleSubmit={handleSubmit}
                                 isEditing={isEditing} errors={errors}/>
                    {/* LIST Overtime */}
                    <TimeOffTable header={header} row={row} pageCount={pageCount}
                                  handlePageClick={handlePageClick} searchEmployeeId={searchEmployeeId}
                                  handleSearchEmployeeId={handleSearchEmployeeId}
                                  searchDayNumber={searchDayNumber}
                                  handleSearchDayNumber={handleSearchDayNumber}/>
                </div>
            </div>
        </section>
        <InfoModal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}
                   content={modalContent.content}/>
    </div>)
}
