import React, {useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import {add_Liability, delete_Liability, fetch_ListLiability, get_LiabilityById, update_Liability} from "./service/LiabilityService.";
import TableComponents from "../../components/TableComponents";
import TableBodyComponents from "../../components/TableBodyComponents";
import InfoModal from "./ModalLiability/ModalLiability";
import './sass/main.scss'
import ModalInfoLiability from "./Utilities/ModalInfoLiability";
import ButtonComponents from "../../components/ButtonComponents";
import ModalCreateUpdate from "./Utilities/ModalCreateUpdate";
import {toast} from "react-toastify";
import ReactPaginate from "react-paginate";

const LiabilityComponents = () => {
    const ITEMS_PER_PAGE = 7;
    const [liability, setLiability] = useState([]);
    const [modalContent, setModalContent] = useState({title: "", content: ""});
    const [isModalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const closeModal = () => setModalOpen(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch_ListLiability();
                setLiability(data);
            } catch (e) {
                console.log("error", e);
            }

        }
        fetchData();
    }, []);

    const refreshLiabilityList = async () => {
        const updatedList = await fetch_ListLiability();
        setLiability(updatedList);
    }
    const handle_ModalInfo = async (item) => {
        const liabilityId = item.data[0];
        const liability = await get_LiabilityById(liabilityId);
        if (liability) {
            setModalContent({
                title: "Thông tin công nợ cá nhân", content: <ModalInfoLiability liability={liability}/>
            });
            setModalOpen(true);
        }
    };
    const handle_ModalAdd = () => {
        setModalContent({
            title: "Thêm mới công nợ", content: <ModalCreateUpdate isNew={true}
                                                                   onSave={handle_AddNew_Liability}/>
        })
        setModalOpen(true);
    };
    const handle_ModalUpdate = async (item) => {
        const liabilityId = item.data[0];
        const liability = await get_LiabilityById(liabilityId);
        if (liability) {
            setModalContent({
                title: "Cập nhật công nợ cá nhân",
                content: <ModalCreateUpdate isNew={false} liability={liability} isEditing={true}
                                            disabledLiabilityFields={['debt', 'course_id', 'create_date', 'update_date', 'period_debt']}
                                            onSave={handle_Update_Liability}/>
            });
            setModalOpen(true);
        }

    }
    const handle_Update_Liability = async (updatedData) => {
        try {
            const result = await update_Liability(updatedData.id, updatedData);
            if (result) {
                toast.success("Cập nhật công nợ thành công");
                setModalOpen(false);
                const updatedLiability = await fetch_ListLiability();
                setLiability(updatedLiability);
            }
        } catch (e) {
            console.log("Lỗi khi cập nhật công nợ", e);
        }
    };
    const handle_Deleted_Liability = async (item) => {
        const liabilityId = item.data[0];
        const confirmDelete = window.confirm("Bạn muốn xóa công nợ này?")
        if (confirmDelete) {
            try {
                await delete_Liability(liabilityId);
                setLiability(liability.filter(liability => liability.id === item.id));
                toast.success("Xóa công nợ cá nhân thành công")
                const updateLiability = await fetch_ListLiability()
                setLiability(updateLiability);
            } catch (error) {
                console.log("error", error)
            }
        }
    }
    const handle_AddNew_Liability = async (newLiability) => {
        try {
            await add_Liability(newLiability);
            setModalOpen(false);
            await refreshLiabilityList();
            toast.success("Thêm phòng ban thành công");
        } catch (e) {
            console.log("error", e)
        }

    };
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }
    const pageCount = Math.ceil(liability.length / ITEMS_PER_PAGE);
    const handle_PageClick = (event) => {
        const selectedPage = event.selected;
        setCurrentPage(selectedPage);
    };
    const offset = currentPage * ITEMS_PER_PAGE;
    const paginated_Liability = liability.slice(offset, offset + ITEMS_PER_PAGE);
    const filter_Liability = paginated_Liability.filter(liability => liability.student_Id.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
    const header = ["ID", "Mã học viên", "Tên học viên", "Số Tiền Nợ", "Trạng Thái Nợ", "Khóa Học", "Ngày tạo", "Ngày cập nhật", "Chứ năng"]
    const rows = filter_Liability.map((item) => ({
        data: [item.id.toString(), item.student_Id.toString(), item.student_name, item.debt.toString(), item.status, Array.isArray(item.course_id) ? item.course_id.join(',') : item.course_id, item.create_date, item.update_date],
        actions: [{className: 'btn-info', icon: 'fa-eye', onClick: handle_ModalInfo}, {
            className: "btn-warning", icon: "fa-pen", onClick: handle_ModalUpdate
        }, {className: 'btn-danger', icon: 'fa-trash', onClick: handle_Deleted_Liability}]
    }));
    return (<div>
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1>Quản lý công nợ</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><NavLink to="/">Home</NavLink>
                            </li>
                            <li className="breadcrumb-item active">Quản lý công nợ</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <h2 className="text-center">Danh sách công nợ</h2>
                            <div className="card-body">
                                <div className="d-flex justify-content-between my-2">
                                    <ButtonComponents type="button" className="btn-primary "
                                                      onClick={handle_ModalAdd}>Thêm mới</ButtonComponents>
                                    <div id="filter" className="dataTables_filter">
                                        <label htmlFor="search-input" className="search-label">Tìm kiếm:</label>

                                        <input id="search-input" type="search"
                                               className="form-control form-control-sm search-input" value={search}
                                               onChange={handleSearch} placeholder="Mã học viên"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <TableComponents headers={header}>
                                            <TableBodyComponents rows={rows}/>
                                        </TableComponents>
                                        <ReactPaginate
                                            previousLabel={'<<'}
                                            nextLabel={'>>'}
                                            breakLabel={'...'}
                                            pageCount={pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handle_PageClick}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <InfoModal onClose={closeModal} isOpen={isModalOpen}
                   title={modalContent.title} content={modalContent.content}/>
    </div>);
};

export default LiabilityComponents;
