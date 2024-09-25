import React, { useEffect, useState } from "react";
import "./Contract.scss";
import TableComponents from "../../components/TableComponents";
import TableBodyComponents from "../../components/TableBodyComponents";
import ContractForm from "./ContractFormComponents/index.";
import ContractViewComponents from "./ContractViewComponents";
import ContractEditComponents from "./ContractEditComponents";
import PagingComponent from "../../components/PagingComponent";
import ConfirmationComponents from "../../components/ConfirmationComponents";
import { NumericFormat } from "react-number-format";
import ContractTitleComponents from "./ContractTittleComponents";
import {
  createContract,
  updateContractStatus,
  fetchContracts,
  updateContract,
} from "./ContractService/contractService";
import { toast } from "react-toastify";
import { Col, Container, Row, Spinner } from "react-bootstrap";

const itemsPerPage = 10;

const ContractComponents = () => {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("");


  const contractTypeMap = {
    fulltime: "Hợp đồng lao động chính thức",
    parttime: "Hợp đồng lao động parttime",
    freelance: "Hợp đồng Freelance",
    probationary: "Hợp đồng thử việc",
    intern: "Hợp đồng thực tập",
  };

  const headerContract = [
    // "ID",
    "Mã hợp đồng",
    "Mã nhân viên",
    "Loại hợp đồng",
    "Mức lương",
    // "Ngày bắt đầu",
    // "Ngày kết thúc",
    "Trạng thái",
    "Action",
  ];

  console.log("currentPage: ", currentPage)

  useEffect(() => {
    loadContracts(currentPage).then(r => console.log(r));
  }, [currentPage]);


  const loadContracts = async (pageNo) => {
    console.log("Data tu fe: ", contracts);

    setIsLoading(true);

    try {
      const contractsData = await fetchContracts(pageNo, itemsPerPage);
      

        // Sắp xếp hợp đồng theo yêu cầu: status = true lên trên, status = false xuống dưới, và theo thời gian cập nhật mới nhất
        const sortedContracts = contractsData.content.sort((a, b) => {
          if (a.status === b.status) {
            return new Date(b.updateAt) - new Date(a.updateAt);
          }
          return b.status - a.status; // true > false, nên b.status - a.status sẽ đưa true lên trên
        });
  
        setContracts(sortedContracts);
        setFilteredContracts(sortedContracts);
        setTotalPage(contractsData.totalPages);
        setCurrentPage(contractsData.currentPage);
        setEmptyMessage("");

    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu hợp đồng!");
    } finally {
      setIsLoading(false);
    }
  };
  


  const handleSearch = (filtered) => {
    const sortedFiltered = filtered.sort((a, b) => b.status - a.status);
    setFilteredContracts(sortedFiltered);
    const totalPages = Math.ceil(sortedFiltered.length / itemsPerPage);
    setTotalPage(totalPages > 0 ? totalPages : 1); 
    setCurrentPage(1);
  };
  

  const handleAddContract = async (newContract) => {
    setIsLoading(true);

    try {
        console.log("newContract", newContract);
        await createContract(newContract);
        // Tải lại danh sách hợp đồng từ server và sắp xếp
        await loadContracts();
        setEditModalShow(false);
        toast.success("Thêm hợp đồng thành công!");
    } catch (error) {
        toast.error("Có lỗi xảy ra khi thêm hợp đồng!");
    } finally {
        setIsLoading(false);
    }
};



const handleSaveEdit = async (updatedContract) => {
  setIsLoading(true);

  try {
      await updateContract(updatedContract);  
      // Tải lại danh sách hợp đồng từ server và sắp xếp
      await loadContracts();
      setEditModalShow(false);
      toast.success("Cập nhật thành công hợp đồng!");
  } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật hợp đồng!");
  } finally {
      setIsLoading(false);
  }
};

  

const handleDelete = async (contractId) => {
  setIsLoading(true);
  try {
    await updateContractStatus(contractId, false);
      // Tải lại danh sách hợp đồng từ server và sắp xếp
      await loadContracts();
      setDeleteModalShow(false);
      toast.success("Xóa thành công hợp đồng!");
  } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa hợp đồng!");
  } finally {
      setIsLoading(false);
  }
};


  const handleDeleteConfirm = () => {
    if (selectedContract) {
      handleDelete(selectedContract.id);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleView = (contract) => {
    setSelectedContract(contract);
    console.log(contract);
    setViewModalShow(true);
  };

  const handleEdit = (contract) => {
    console.log(contract);

    setSelectedContract(contract);
    setEditModalShow(true);
  };

  const rows = filteredContracts.map((contract) => ({
      data: [
        // contract.id,
        contract.contractCode,
        contract.employeeCode,
        contractTypeMap[contract.contractCategory],
        <NumericFormat
          value={contract.salary}
          displayType={"text"}
          thousandSeparator="."
          decimalSeparator=","
          prefix=""
          renderText={(value) => value}
        />,
        // formatDate(contract.dateStart),
        // formatDate(contract.dateEnd),
        contract.status ? (
          <span className="badge badge-primary">Còn hạn</span>
        ) : (
          <span className="badge badge-danger">Hết hạn</span>
        ),
      ],
      actions: [
        {
          className: "btn-info",
          icon: "fa-eye",
          onClick: () => handleView(contract),
        },
        {
          className: "btn-warning",
          icon: "fa-pen",
          onClick: () => handleEdit(contract),
        },
        ...(contract.status
          ? [
              {
                className: "btn-danger",
                icon: "fa-trash",
                onClick: () => {
                  setSelectedContract(contract);
                  setDeleteModalShow(true);
                },
              },
            ]
          : []),
      ],
    }));

    console.log("contract render");


   return (
    <Container fluid className="Contract-list">
      <ContractTitleComponents
        onSearch={handleSearch}
        contracts={contracts}
        onAddContract={handleAddContract}
      />
      <Row className="contract-content">
        <Col xs={12} md={4}>
          <h3>Thêm hợp đồng</h3>
          <ContractForm onSubmit={handleAddContract} contracts={contracts} />
        </Col>
        <Col xs={12} md={8}>
          {isLoading ? (
            <div className="spinner-container text-primary">
              <Spinner animation="border" role="status" />
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : contracts.length === 0 ? (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {emptyMessage}
            </span>
          ) : (
            <>
              <TableComponents headers={headerContract}>
                <TableBodyComponents rows={rows} />
              </TableComponents>
              <PagingComponent
                 totalPage={totalPage}
                 currentPage={currentPage}
                 onPageChange={handlePageChange} // Không cho phép thay đổi trang khi đang tải
              />
            </>
          )}
        </Col>
      </Row>
      <ContractViewComponents
        show={viewModalShow}
        handleClose={() => setViewModalShow(false)}
        contract={selectedContract}
      />
      <ContractEditComponents
        show={editModalShow}
        handleClose={() => setEditModalShow(false)}
        contract={selectedContract}
        onSave={handleSaveEdit}
      />
      <ConfirmationComponents
        show={deleteModalShow}
        handleClose={() => setDeleteModalShow(false)}
        onConfirm={handleDeleteConfirm}
        message="Bạn có chắc chắn muốn xóa hợp đồng này?"
      />
    </Container>
  );
};

export default ContractComponents;
