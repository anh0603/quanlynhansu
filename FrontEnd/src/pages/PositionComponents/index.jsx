// src/components/PositionComponents.js
import React, {useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import ConfirmationComponents from "../../components/ConfirmationComponents";
import PagingComponent from "../../components/PagingComponent";
import TableBodyComponents from "../../components/TableBodyComponents";
import TableComponents from "../../components/TableComponents";
import './Position.scss';
import PositionEditComponents from "./PositionEditComponents";
import PositionForm from "./PositionFormComponents";
import {addPosition, deletePosition, updatePosition} from "./PositionService/positionService";
import PositionTitleComponents from "./PositionTittleComponents";
import PositionViewComponents from "./PositionViewComponents";

const itemsPerPage = 10;

const PositionComponents = () => {
    const [position, setPosition] = useState([]);
    const [filteredPosition, setFilteredPosition] = useState([]);
    const [viewModalShow, setViewModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const headerPosition = ['ID', 'Chức vụ', 'Phòng Ban', 'Trạng thái', 'Actions'];

    const handleSearch = (filtered) => {
        if (filtered.data) {
            setFilteredPosition(filtered.data);
            setTotalPage(filtered.totalPages);
            setCurrentPage(filtered.currentPage);
        }
    };

    const handleAddPosition = async (newPosition) => {
        try {
            const addedPosition = await addPosition(newPosition);
            const updatedPosition = [...filteredPosition, addedPosition].sort((a, b) => b.status - a.status);
            setPosition(updatedPosition);
            setFilteredPosition(updatedPosition);
            setTotalPage(Math.ceil(updatedPosition.length / itemsPerPage));
            setCurrentPage(currentPage);
            toast.success('Thêm chức vụ thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm chức vụ!');
        }
    };

    const handleSaveEdit = async (updatedPosition) => {
        try {
            const savedPosition = await updatePosition(updatedPosition);
            const updatedPositionList = filteredPosition.map(pos =>
                pos.id === savedPosition.id ? savedPosition : pos
            ).sort((a, b) => b.status - a.status);
            setPosition(updatedPositionList);
            setFilteredPosition(updatedPositionList);
            setTotalPage(totalPage);
            setEditModalShow(false);
            toast.success('Cập nhật thành công chức vụ!');
        } catch (error) {
            toast.error('Có lỗi khi cập nhật chức vụ!');
        }
    };

    const handleDelete = async (id) => {
        try {
            const deletedPosition = await deletePosition(id);
            const updatedPosition = filteredPosition.map(pos =>
                pos.id === deletedPosition.id ? deletedPosition : pos
            ).sort((a, b) => b.status - a.status);
            setPosition(updatedPosition);
            setFilteredPosition(updatedPosition);
            setTotalPage(Math.ceil(updatedPosition.length / itemsPerPage));
            setDeleteModalShow(false);
            toast.success('Xóa thành công hợp đồng!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa hợp đồng!');
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedPosition) {
            handleDelete(selectedPosition.id).then(r => console.log(r));
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleView = (position) => {
        setSelectedPosition(position);
        setViewModalShow(true);
    };

    const handleEdit = (position) => {
        setSelectedPosition(position);
        setEditModalShow(true);
    };

    const rows = filteredPosition.map(position => ({
        data: [
            position.id, // ID should match the property name in your JSON
            position.positionName, // Use correct property name
            position.departmentName,
            position.status ? 'Active' : 'Inactive',
        ],
        actions: [
            {
                className: 'btn-info',
                icon: 'fa-eye',
                onClick: () => handleView(position)
            },
            {
                className: 'btn-warning',
                icon: 'fa-pen',
                onClick: () => handleEdit(position)
            },
            ...(position.status ? [{
                className: 'btn-danger',
                icon: 'fa-trash',
                onClick: () => {
                    setSelectedPosition(position);
                    setDeleteModalShow(true);
                }
            }] : [])
        ]
    }));

    return (
        <Container fluid className="Position-list">
            <PositionTitleComponents onSearch={handleSearch} currentPage={currentPage} position={position}/>
            <Row className="Position-content">
                <Col xs={12} md={4}>
                    <h3>Thêm Chức Vụ</h3>
                    <PositionForm onSubmit={handleAddPosition}/>
                </Col>
                <Col xs={12} md={8}>
                    <TableComponents headers={headerPosition}>
                        <TableBodyComponents rows={rows}/>
                    </TableComponents>
                    <PagingComponent
                        totalPage={totalPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </Col>
            </Row>
            <PositionViewComponents
                show={viewModalShow}
                handleClose={() => setViewModalShow(false)}
                position={selectedPosition}
            />
            <PositionEditComponents
                show={editModalShow}
                handleClose={() => setEditModalShow(false)}
                position={selectedPosition}
                onSave={handleSaveEdit}
            />
            <ConfirmationComponents
                show={deleteModalShow}
                handleClose={() => setDeleteModalShow(false)}
                onConfirm={handleDeleteConfirm}
                message="Bạn có chắc chắn muốn xóa chức vụ này?"
            />
        </Container>
    );
};

export default PositionComponents;