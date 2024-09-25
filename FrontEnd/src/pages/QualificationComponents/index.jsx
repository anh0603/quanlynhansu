import { format } from 'date-fns';
import React, { useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmationComponents from "../../components/ConfirmationComponents";
import PagingComponent from "../../components/PagingComponent";
import TableBodyComponents from "../../components/TableBodyComponents";
import TableComponents from "../../components/TableComponents";
import './Qualification.scss';
import QualificationEditComponents from "./QualificationEditComponents";
import QualificationForm from './QualificationFormComponents';
import {
  addQualification,
  deleteQualification,
  updateQualification
} from "./QualificationService/qualificationService";
import QualificationTitleComponents from "./QualificationTittleComponents";
import QualificationViewComponents from "./QualificationViewComponents";

const itemsPerPage = 10;

const QualificationComponents = () => {
  const [qualification, setQualification] = useState([]);
  const [filteredQualification, setFilteredQualification] = useState([]);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const headerQualification = ['ID', 'Tên bằng cấp', 'Tên nhân viên', 'Thời hạn', 'Trạng thái', 'Action'];

  const handleSearch = (filtered) => {
    if (filtered.data) {
      setFilteredQualification(filtered.data);
      setTotalPage(filtered.totalPages);
      setCurrentPage(filtered.currentPage);
    }
  };

  const handleAddQualification = async (newQualification) => {
    try {
      const addedQualification = await addQualification(newQualification);
      const updatedQualification = [...qualification, addedQualification];
      setQualification(updatedQualification);
      setFilteredQualification(updatedQualification);
      setTotalPage(Math.ceil(updatedQualification.length / itemsPerPage));
      setCurrentPage(Math.ceil(updatedQualification.length / itemsPerPage));
      toast.success('Thêm bằng cấp thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm bằng cấp!');
    }
  };

  const handleSaveEdit = async (updatedQualification) => {
    try {
      const savedQualification = await updateQualification(updatedQualification);
      const updatedQualificationList = qualification.map(pos =>
        pos.id === savedQualification.id ? savedQualification : pos
      );
      setQualification(updatedQualificationList);
      setFilteredQualification(updatedQualificationList);
      setTotalPage(Math.ceil(updatedQualificationList.length / itemsPerPage));
      setEditModalShow(false);
      toast.success('Cập nhật thành công bằng cấp!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật bằng cấp!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQualification(id);
      const updatedQualificationList = qualification.filter(pos => pos.id !== id);
      setQualification(updatedQualificationList);
      setFilteredQualification(updatedQualificationList);
      setTotalPage(Math.ceil(updatedQualificationList.length / itemsPerPage));
      setDeleteModalShow(false);
      toast.success('Xóa thành công bằng cấp!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa bằng cấp!');
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedQualification) {
      handleDelete(selectedQualification.id).then(r => console.log(r));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '';
  };

  const handleView = (qualification) => {
    setSelectedQualification(qualification);
    setViewModalShow(true);
  };

  const handleEdit = (qualification) => {
    setSelectedQualification(qualification);
    setEditModalShow(true);
  };

  const rows = filteredQualification.map(qualification => ({
    data: [
      qualification.id,
      qualification.qualificationName,
      qualification.employeeName,
      formatDate(qualification.expiryDate),
      qualification.status ? 'Active' : 'Inactive',
    ],
    actions: [
      {
        className: 'btn-info',
        icon: 'fa-eye',
        onClick: () => handleView(qualification)
      },
      {
        className: 'btn-warning',
        icon: 'fa-pen',
        onClick: () => handleEdit(qualification)
      },
      ...(qualification.status ? [{
        className: 'btn-danger',
        icon: 'fa-trash',
        onClick: () => {
          setSelectedQualification(qualification);
          setDeleteModalShow(true);
        }
      }] : [])
    ]
  }));

  

  return (
    <Container fluid className="Qualification-list">
      <QualificationTitleComponents onSearch={handleSearch} currentPage={currentPage} qualification={qualification} />
      <Row className="Qualification-content">
        <Col xs={12} md={4}>
          <h3>Thêm Bằng Cấp</h3>
          <QualificationForm onSubmit={handleAddQualification} qualification={qualification} />
        </Col>
        <Col xs={12} md={8}>
          <TableComponents headers={headerQualification}>
            <TableBodyComponents rows={rows} />
          </TableComponents>
          <PagingComponent
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>
      <QualificationViewComponents
        show={viewModalShow}
        handleClose={() => setViewModalShow(false)}
        qualification={selectedQualification}
      />
      <QualificationEditComponents
        show={editModalShow}
        handleClose={() => setEditModalShow(false)}
        qualification={selectedQualification}
        onSave={handleSaveEdit}
      />
      <ConfirmationComponents
        show={deleteModalShow}
        handleClose={() => setDeleteModalShow(false)}
        onConfirm={handleDeleteConfirm}
        message="Bạn có chắc chắn muốn xóa bằng cấp này?"
      />
    </Container>
  );
};

export default QualificationComponents;
