import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import SearchComponents from "../../components/SearchComponents";
import PagingComponent from "../../components/PagingComponent";
import TableExamComponent from "../../components/TableExamComponent";
import {
  getExams,
  handleCreateExam,
  handleEditExam,
  handleDeleteExam,
} from "../../controllers/ExamController";
import ModalExamComponent from "../../components/ModalExamComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteExamModal from "../../components/DeleteExamModal";

const ExamComponent = () => {
  const cols = [
    "STT",
    "Mã môn học",
    "Mã lớp học",
    "Ngày thi",
    "Link bài thi",
    "Hành Động",
  ];

  const [totalPage, setTotalPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchExam, setSearchExam] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [modalTitle, setModalTitle] = useState("");
  const [modalButtonTitle, setModalButtonTitle] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const perPage = 10;

  useEffect(() => {
    getExams(
      searchExam,
      currentPage,
      perPage,
      setDataTable,
      setTotalPage,
      setIsLoading
    );
  }, [currentPage, searchExam]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (exam) => {
    setSearchExam(exam);
  };

  const handleAdd = () => {
    setModalMode("create");
    setModalTitle("Thêm mới lịch thi");
    setModalButtonTitle("Create");
    setSelectedExam(null);
    setShowModal(true);
  };

  const handleEdit = (exam) => {
    setModalMode("edit");
    setModalTitle("Chỉnh sửa lịch thi");
    setModalButtonTitle("Edit");
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleView = (exam) => {
    setModalMode("view");
    setModalTitle("Xem chi tiết lịch thi");
    setModalButtonTitle("");
    setSelectedExam(exam);
    setShowModal(true);
    console.log("Check exam: ", exam);
  };

  const handleDelete = (exam) => {
    setSelectedExam(exam);
    setShowConfirmModal(true);
    console.log("Check exam: ", exam);
  };

  const confirmDelete = async () => {
    if (selectedExam) {
      await handleDeleteExam(selectedExam.id, () =>
        getExams(
          searchExam,
          currentPage,
          perPage,
          setDataTable,
          setTotalPage,
          setIsLoading
        )
      );
      setSelectedExam(null);
      setShowConfirmModal(false);
    }
  };

  const handleModalAction = async (formData) => {
    if (modalMode === "create") {
      handleCreateExam(
        formData,
        () => setShowModal(false),
        () =>
          getExams(
            searchExam,
            currentPage,
            perPage,
            setDataTable,
            setTotalPage,
            setIsLoading
          )
      );
    } else if (modalMode === "edit") {
      handleEditExam(
        selectedExam.id,
        formData,
        () => setShowModal(false),
        () =>
          getExams(
            searchExam,
            currentPage,
            perPage,
            setDataTable,
            setTotalPage,
            setIsLoading
          )
      );
    }
  };

  const indexOfLastRecord = currentPage * perPage;
  const indexOfFirstRecord = indexOfLastRecord - perPage;
  const currentData = dataTable.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Quản Lý Lịch Thi</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Quản lý lịch thi</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col">
              <div className="card card-primary">
                <div className="card-body">
                  <div
                    style={{
                      fontWeight: "500",
                      fontSize: 18,
                      marginBottom: 8,
                    }}
                  >
                    Danh sách lịch thi
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                    <div className="flex-grow-1">
                      <SearchComponents onSearch={handleSearch} />
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        className="align-items-center"
                        onClick={handleAdd}
                      >
                        <i className="bi bi-plus"></i>
                        Thêm mới
                      </Button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mt-8">
                      <TableExamComponent
                        cols={cols}
                        data={currentData}
                        isLoading={isLoading}
                        onView={(exam) => handleView(exam)}
                        onEdit={(exam) => handleEdit(exam)}
                        onDelete={(id) => handleDelete(id)}
                      />
                    </div>
                  </div>
                  <div className="row justify-content-center mt-3">
                    <div className="col-auto">
                      <PagingComponent
                        totalPage={totalPage}
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
      <ModalExamComponent
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={modalTitle}
        titleButton={modalButtonTitle}
        action={handleModalAction}
        examData={selectedExam || {}}
        mode={modalMode}
      />
      <DeleteExamModal
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        handleConfirm={confirmDelete}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default ExamComponent;
