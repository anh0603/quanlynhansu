import React, {useState} from 'react';
import './Personnel.scss';
import TableComponents from "../../components/TableComponents";
import TableBodyComponents from "../../components/TableBodyComponents";
import PagingComponent from "../../components/PagingComponent";
import ConfirmationComponent from "../../components/ConfirmationComponents";
import PersonnelTitleComponent from "./PersonnelTittleComponents";
import {toast} from 'react-toastify';
import {addPersonnel, deletePersonnel, updatePersonnel} from "./PersonnelService/PersonnelSevice";
import {Col, Container, Row} from "react-bootstrap";
import PersonnelFormComponents from "./PersonnelFormComponents";
import PersonnelViewComponents from "./PersonnelViewComponents";
import PersonnelEditComponent from "./PersonelEditComponents";

const PersonnelComponents = () => {
    const [personnels, setPersonnels] = useState([]);
    const [filteredPersonnels, setFilteredPersonnels] = useState([]);
    const [viewModalShow, setViewModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [selectedPersonnel, setSelectedPersonnel] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [showAddForm, setShowAddForm] = useState(false);

    const headerPersonnel = ['ID', 'Mã nhân viên', 'Họ tên', 'Chức vụ', 'Email', 'Trạng thái', 'Action'];

    const handleSearch = (filtered) => {
        if(filtered.data) {
            setFilteredPersonnels(filtered.data);
            setTotalPage(filtered.totalPages);
            setCurrentPage(filtered.currentPage);
        }
    };

    const handleAddPersonnel = async (newPersonnel) => {
        try {
            const addedPersonnel = await addPersonnel(newPersonnel);
            const updatedPersonnels = [...filteredPersonnels, addedPersonnel].sort((a, b) => b.status - a.status);
            setPersonnels(updatedPersonnels);
            setFilteredPersonnels(updatedPersonnels);
            setTotalPage(totalPage);
            setCurrentPage(currentPage);
            toast.success('Thêm thành công nhân viên');
            setShowAddForm(false);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm nhân viên');
        }
    };

    const handleSaveEdit = async (updatedPersonnel) => {
        try {
            const savedPersonnel = await updatePersonnel(updatedPersonnel);
            const updatedPersonnels = personnels.map(personnel =>
              personnel.id === updatedPersonnel.id ? savedPersonnel : personnel
            ).sort((a, b) => b.status - a.status);
            setPersonnels(updatedPersonnels);
            setFilteredPersonnels(updatedPersonnels);
            setTotalPage(totalPage);
            setEditModalShow(false);
            toast.success('Cập nhật thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật nhân viên!');
        }
    };

    const handleDelete = async (personnelId) => {
        try {
            const personnelToUpdate = personnels.find(personnel => personnel.id === personnelId);
            if (personnelToUpdate) {
                const deletedPersonnel = await deletePersonnel(personnelId, personnelToUpdate);
                const updatedPersonnels = personnels.map(personnel =>
                  personnel.id === personnelId ? deletedPersonnel : personnel
                ).sort((a, b) => b.status - a.status);
                setPersonnels(updatedPersonnels);
                setFilteredPersonnels(updatedPersonnels);
                setTotalPage(totalPage);
                setDeleteModalShow(false);
                toast.success("Xóa thành công nhân viên");
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật thông tin nhân viên!');
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedPersonnel) {
            handleDelete(selectedPersonnel.id);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleView = (personnel) => {
        setSelectedPersonnel(personnel);
        setViewModalShow(true);
    };

    const handleEdit = (personnel) => {
        setSelectedPersonnel(personnel);
        setEditModalShow(true);
    };

    const rows = filteredPersonnels.map(personnel => ({
        data: [
            personnel.id === null ? '' : personnel.id.toString(),
            personnel.employeeCode,
            personnel.employeeName,
            personnel.positionName,
            personnel.email,
            personnel.status ? 'Active' : 'Inactive',
        ],
        actions: [
            {
                className: 'btn-info ',
                icon: 'fa fa-eye',
                onClick: () => handleView(personnel)
            },
            {
                className: 'btn-warning',
                icon: 'fa fa-pen',
                onClick: () => handleEdit(personnel)
            },
            ...(personnel.status ? [{
                className: 'btn-danger',
                icon: 'fa fa-trash',
                onClick: () => {
                    setSelectedPersonnel(personnel);
                    setDeleteModalShow(true);
                }
            }] : [])
        ]
    }));

    return (
      <Container fluid className="personnel-list">
          {!showAddForm ? (
            <>
                <PersonnelTitleComponent onSearch={handleSearch} personnels={personnels} currentPage={currentPage} onAddNewClick={() => setShowAddForm(true)} />
                <Row className="personnel-content">
                    <Col xs={12} md={12}>
                        <TableComponents headers={headerPersonnel}>
                            <TableBodyComponents rows={rows} />
                        </TableComponents>
                        <PagingComponent
                          totalPage={totalPage}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                    </Col>
                </Row>
            </>
          ) : (
            <div>
                <div className="border border-dark rounded-5 mt-3 mb-3 p-5">
                    <h3>Thêm nhân viên mới</h3>
                    <PersonnelFormComponents onSubmit={handleAddPersonnel} personnels={personnels} />
                    <button className="btn btn-secondary mt-3" onClick={() => setShowAddForm(false)}>
                        Quay lại
                    </button>
                </div>
            </div>
          )}
          <PersonnelViewComponents
            show={viewModalShow}
            handleClose={() => setViewModalShow(false)}
            personnel={selectedPersonnel}
          />
          <PersonnelEditComponent
            show={editModalShow}
            handleClose={() => setEditModalShow(false)}
            personnel={selectedPersonnel}
            onSave={handleSaveEdit}
          />
          <ConfirmationComponent
            show={deleteModalShow}
            handleClose={() => setDeleteModalShow(false)}
            onConfirm={handleDeleteConfirm}
            message="Bạn có chắc chắn muốn xóa nhân viên này ?"
          />
      </Container>
    );
};



export default PersonnelComponents;
