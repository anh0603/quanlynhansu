import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from "react-csv";
import { toast } from 'react-toastify';
import ButtonComponents from "../../../components/ButtonComponents";
import SearchComponents from "../../../components/SearchComponents";
import '../Allowance.scss';
import { filterAllowance, uploadFile } from "../AllowanceService/allowanceService";

const AllowanceTitleComponents = ({ allowance, onSearch, currentPage }) => {
  const fileInputRef = useRef(null);
  const [filteredAllowance, setFilterAllowance] = useState({});
  const [dataExport, setDataExport] = useState([]);
  const [statusFilter, setStatusFilter] = useState({
    pageNo: 1,
    pageSize: 10,
    status: null,
    keyword: null
  });

  useEffect(() => {
    setStatusFilter(prev => ({
      ...prev,
      pageNo: currentPage
    }));
  }, [currentPage]);

  useEffect(() => {
    filterAllowance(statusFilter).then(data => {
      setFilterAllowance(data);
    }).catch(error => {
      console.error('Có lỗi xảy ra khi lọc dữ liệu:', error);
    });
  }, [statusFilter]);

  useEffect(() => {
    onSearch(filteredAllowance);
  }, [filteredAllowance]);


  const handleSearch = (searchTerm) => {
    setStatusFilter(prev => ({
      ...prev,
      keyword: searchTerm
    }));
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      uploadFile(file)
        .then(response => {
          toast.success('File uploaded successfully');
        })
        .catch(error => {
          toast.error('Failed to upload file');
        });
    } else {
      toast.error('No file selected');
    }
  };

  const getAllowanceExport = (event, done) => {
    if (filteredAllowance.data && filteredAllowance.data.length > 0) {
      const result = [
        ["ID", "Loại phụ cấp", "Lương phụ cấp", "Tên chức vụ", "Trạng thái"]
      ];

      filteredAllowance.data.forEach((item) => {
        result.push([
          item.id,
          item.allowanceCategory,
          item.allowanceSalary,
          item.positionName,
          item.status === 1 ? 'Còn hạn' : 'Hết hạn'
        ]);
      });

      setDataExport(result);
      done();
    } else {
      toast.error("Không có dữ liệu để xuất");
    }
  };

  return (
    <div className="row allowance-tittle d-flex justify-content-between align-items-center">
      <div className="col-sm-6">
        <h2>DANH SÁCH PHỤ CẤP</h2>
      </div>
      <div className="action-button col-sm-6 d-flex justify-content-end align-items-center">
        <select
          style={{ width: "130px", padding: "8px" }}
          className="form-select form-select-sm"
          value={statusFilter.status || ''}
          onChange={(e) => {
            setStatusFilter((prev) => ({
              ...prev,
              status: e.target.value
            }));
          }}
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <SearchComponents onSearch={handleSearch} />

        <ButtonComponents
          className="btn btn-success align-items-center"
          onClick={handleImportClick}
        >
          <i className="fas fa-file-excel"></i>
        </ButtonComponents>

        <input
          type="file"
          id="import"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
        />

        <CSVLink
          data={dataExport}
          asyncOnClick={true}
          onClick={getAllowanceExport}
          filename={"List-Allowance.csv"}
          className="btn btn-danger align-items-center"
        >
          <i className="fas fa-file-export"></i>
        </CSVLink>
      </div>
    </div>
  );
};

export default AllowanceTitleComponents;
