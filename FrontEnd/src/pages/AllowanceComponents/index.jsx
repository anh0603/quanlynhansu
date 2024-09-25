import React, { useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmationComponents from "../../components/ConfirmationComponents";
import PagingComponent from "../../components/PagingComponent";
import TableBodyComponents from "../../components/TableBodyComponents";
import TableComponents from "../../components/TableComponents";
import './Allowance.scss';
import AllowanceEditComponents from "./AllowanceEditComponents";
import AllowanceForm from './AllowanceFormComponents';
import {
    addAllowance,
    deleteAllowance,
    updateAllowance
} from "./AllowanceService/allowanceService";
import AllowanceTitleComponents from "./AllowanceTittleComponents";
import AllowanceViewComponents from "./AllowanceViewComponents";

const AllowanceComponents = () => {
    const [allowance, setAllowance] = useState([]);
    const [filteredAllowance, setFilteredAllowance] = useState([]);
    const [viewModalShow, setViewModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [selectedAllowance, setSelectedAllowance] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const headerAllowance = ['ID', 'Loại phụ cấp', 'Lương phụ cấp', 'Chức vụ', 'Trạng thái', 'Action'];

    const handleSearch = (filtered) => {
        if (filtered.data) {
            setFilteredAllowance(filtered.data);
            setTotalPage(filtered.totalPages);
            setCurrentPage(filtered.currentPage);
        }
    };

    const handleAddAllowance = async (newAllowance) => {
        try {
            const addedAllowance = await addAllowance(newAllowance);
            const updatedAllowance = [...filteredAllowance, addedAllowance].sort((a, b) => b.status - a.status);
            setAllowance(updatedAllowance);
            setFilteredAllowance(updatedAllowance);
            setTotalPage(totalPage);
            setCurrentPage(currentPage);
            toast.success('Thêm phụ cấp thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm phụ cấp!');
        }
    };

    const handleSaveEdit = async (updatedAllowance) => {
        try {
            const savedAllowance = await updateAllowance(updatedAllowance);
            const updatedAllowanceList = filteredAllowance.map(pos =>
                pos.id === savedAllowance.id ? savedAllowance : pos
            ).sort((a, b) => b.status - a.status);
            setAllowance(updatedAllowanceList);
            setFilteredAllowance(updatedAllowanceList);
            setTotalPage(totalPage);
            setEditModalShow(false);
            toast.success('Cập nhật thành công phụ cấp!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật phụ cấp!');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteAllowance(id);
            const updatedAllowanceList = filteredAllowance.map(pos =>
                pos.id === res.id ? res : pos
            ).sort((a, b) => b.status - a.status);
            setAllowance(updatedAllowanceList);
            setFilteredAllowance(updatedAllowanceList);
            setTotalPage(currentPage);
            setDeleteModalShow(false);
            toast.success('Xóa thành công phụ cấp!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa phụ cấp!');
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedAllowance) {
            handleDelete(selectedAllowance.id).then(r => console.log(r));
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleView = (allowance) => {
        setSelectedAllowance(allowance);
        setViewModalShow(true);
    };

    const handleEdit = (allowance) => {
        setSelectedAllowance(allowance);
        setEditModalShow(true);
    };

    const rows = filteredAllowance.map(allowance => ({
        data: [
            allowance.id,
            allowance.allowanceCategory,
            allowance.allowanceSalary,
            allowance.positionName,
            allowance.status ? 'Active' : 'Inactive',
        ],
        actions: [
            {
                className: 'btn-info',
                icon: 'fa-eye',
                onClick: () => handleView(allowance)
            },
            {
                className: 'btn-warning',
                icon: 'fa-pen',
                onClick: () => handleEdit(allowance)
            },
            ...(allowance.status ? [{
                className: 'btn-danger',
                icon: 'fa-trash',
                onClick: () => {
                    setSelectedAllowance(allowance);
                    setDeleteModalShow(true);
                }
            }] : [])
        ]
    }));



    return (
        <Container fluid className="Allowance-list">
            <AllowanceTitleComponents onSearch={handleSearch} currentPage={currentPage} allowance={allowance} />
            <Row className="Allowance-content">
                <Col xs={12} md={4}>
                    <h3>Thêm phụ cấp</h3>
                    <AllowanceForm onSubmit={handleAddAllowance} allowance={allowance} />
                </Col>
                <Col xs={12} md={8}>
                    <TableComponents headers={headerAllowance}>
                        <TableBodyComponents rows={rows} />
                    </TableComponents>
                    <PagingComponent
                        totalPage={totalPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </Col>
            </Row>
            <AllowanceViewComponents
                show={viewModalShow}
                handleClose={() => setViewModalShow(false)}
                allowance={selectedAllowance}
            />
            <AllowanceEditComponents
                show={editModalShow}
                handleClose={() => setEditModalShow(false)}
                allowance={selectedAllowance}
                onSave={handleSaveEdit}
            />
            <ConfirmationComponents
                show={deleteModalShow}
                handleClose={() => setDeleteModalShow(false)}
                onConfirm={handleDeleteConfirm}
                message="Bạn có chắc chắn muốn xóa phụ cấp này?"
            />
        </Container>
    );
};

export default AllowanceComponents;
