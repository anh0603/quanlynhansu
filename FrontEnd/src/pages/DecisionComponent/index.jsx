import React, { useEffect, useState } from "react";
import "./Decision.scss";
import TableComponents from "../../components/TableComponents";
import TableBodyComponents from "../../components/TableBodyComponents";
import DecisionFormComponents from "./DesicionFormComponents";
import DecisionViewComponents from "./DecisionViewComponents";
import DecisionTittleComponents from "./DecisionTittleComponents";
import DecisionEditComponents from "./DecisionEditComponents";
import PagingComponent from "../../components/PagingComponent";
import ConfirmationComponents from "../../components/ConfirmationComponents";
import { NumericFormat } from "react-number-format";
import {
    createDecision,
    updateDecisionStatus,
    fetchDecisions,
    updateDecisions,
} from "./DecisionServices/decisionServices";
import { toast } from "react-toastify";
import { Col, Container, Row, Spinner } from "react-bootstrap";

const itemsPerPage = 10;

const DecisionComponent = () => {
    const [decisions, setDecisions] = useState([]);
    const [filteredDecisions, setFilteredDecisions] = useState([]);
    const [viewModalShow, setViewModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [selectedDecision, setSelectedDecision] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [emptyMessage, setEmptyMessage] = useState("");

    const decisionTypeMap = {
        reward: "Khen Thưởng",
        discipline: "Kỷ Luật"
    };

    const headerDecision = [
        "Mã quyết định",
        "Mã nhân viên",
        "Loại",
        "Số tiền",
        "Trạng thái",
        "Action",
    ];

    useEffect(() => {
        loadDecision(currentPage);
    }, [currentPage]);

    const loadDecision = async (pageNo) => {
        setIsLoading(true);
        try {
            const decisionsData = await fetchDecisions(pageNo, itemsPerPage);

            // Sắp xếp quyết định theo trạng thái và thời gian cập nhật
            const sortedDecision = decisionsData.content.sort((a, b) => {
                if (a.status === b.status) {
                    return new Date(b.updateAt) - new Date(a.updateAt);
                }
                return b.status - a.status; // true > false
            });

            setDecisions(sortedDecision);
            setFilteredDecisions(sortedDecision);
            setTotalPage(decisionsData.totalPages);
            setCurrentPage(decisionsData.currentPage);
            setEmptyMessage("");

        } catch (error) {
            toast.error("Có lỗi xảy ra khi lấy dữ liệu quyết định!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (filtered) => {
        const sortedFiltered = filtered.sort((a, b) => b.status - a.status);
        setFilteredDecisions(sortedFiltered);
        const totalPages = Math.ceil(sortedFiltered.length / itemsPerPage);
        setTotalPage(totalPages > 0 ? totalPages : 1);
        setCurrentPage(1);
    };

    const handleAddDecision = async (newDecision) => {
        setIsLoading(true);
        try {
            await createDecision(newDecision);
            await loadDecision(currentPage);
            setEditModalShow(false);
            toast.success("Thêm quyết định thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thêm quyết định!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveEdit = async (updateDecision) => {
        setIsLoading(true);
        try {
            await updateDecisions(updateDecision);
            await loadDecision(currentPage);
            setEditModalShow(false);
            toast.success("Cập nhật quyết định thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật quyết định!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (decisionId) => {
        setIsLoading(true);
        try {
            await updateDecisionStatus(decisionId, false);
            await loadDecision(currentPage);
            setDeleteModalShow(false);
            toast.success("Xóa quyết định thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa quyết định!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedDecision) {
            handleDelete(selectedDecision.id);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleView = (decision) => {
        setSelectedDecision(decision);
        setViewModalShow(true);
    };

    const handleEdit = (decision) => {
        setSelectedDecision(decision);
        setEditModalShow(true);
    };

    const rows = filteredDecisions.map((decision) => ({
        data: [
            decision.employeeCode,
            decision.rdCode,
            decisionTypeMap[decision.category],
            <NumericFormat
                value={decision.money}
                displayType={"text"}
                thousandSeparator="."
                decimalSeparator=","
                prefix=""
                renderText={(value) => value}
            />,
            decision.status ? (
                <span className="badge badge-primary">Còn hạn</span>
            ) : (
                <span className="badge badge-danger">Hết hạn</span>
            ),
        ],
        actions: [
            {
                className: "btn-info",
                icon: "fa-eye",
                onClick: () => handleView(decision),
            },
            {
                className: "btn-warning",
                icon: "fa-pen",
                onClick: () => handleEdit(decision),
            },
            ...(decision.status
                ? [
                    {
                        className: "btn-danger",
                        icon: "fa-trash",
                        onClick: () => {
                            setSelectedDecision(decision);
                            setDeleteModalShow(true);
                        },
                    },
                ]
                : []),
        ],
    }));

    return (
        <Container fluid className="decision-list">
            <DecisionTittleComponents
                onSearch={handleSearch}
                decisions={decisions}
                onAddDecision={handleAddDecision}
            />

            <Row className="decision-content">
                <Col xs={12} md={4}>
                    <h3>Thêm quyết định</h3>
                    <DecisionFormComponents onSubmit={handleAddDecision} decisions={decisions} />
                </Col>
                <Col xs={12} md={8}>
                    {isLoading ? (
                        <div className="spinner-container text-primary">
                            <Spinner animation="border" role="status" />
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : decisions.length === 0 ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                            {emptyMessage}
                        </span>
                    ) : (
                        <>
                            <TableComponents headers={headerDecision}>
                                <TableBodyComponents rows={rows} />
                            </TableComponents>
                            <PagingComponent
                                totalPage={totalPage}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </Col>
            </Row>
            <DecisionViewComponents
                show={viewModalShow}
                handleClose={() => setViewModalShow(false)}
                decision={selectedDecision}
            />
            <DecisionEditComponents
                show={editModalShow}
                handleClose={() => setEditModalShow(false)}
                decision={selectedDecision}
                onSave={handleSaveEdit}
            />
            <ConfirmationComponents
                show={deleteModalShow}
                handleClose={() => setDeleteModalShow(false)}
                onConfirm={handleDeleteConfirm}
                message="Bạn có chắc chắn muốn xóa quyết định này?"
            />
        </Container>
    );
};

export default DecisionComponent;
