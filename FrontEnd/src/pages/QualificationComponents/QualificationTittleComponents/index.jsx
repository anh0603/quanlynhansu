import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from "react-csv";
import { toast } from 'react-toastify';
import ButtonComponents from "../../../components/ButtonComponents";
import SearchComponents from "../../../components/SearchComponents";
import '../Qualification.scss';
import { filterQualification, uploadFile } from "../QualificationService/qualificationService";

const QualificationTitleComponents = ({ qualification, onSearch, currentPage }) => {
  const fileInputRef = useRef(null);
  const [filteredQualification, setFilterQualification] = useState({});
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
    filterQualification(statusFilter).then(data => {
      setFilterQualification(data);
    }).catch(error => {
      console.error('Có lỗi xảy ra khi lọc dữ liệu:', error);
    });
  }, [statusFilter]);

  useEffect(() => {
    onSearch(filteredQualification);
  }, [filteredQualification]);


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

  const getQualificationExport = (event, done) => {
    if (qualification && qualification.length > 0) {
      const result = [
        ["Tên bằng cấp", "Tên nhân viên", "Thời hạn", "Trạng thái"]
      ];

      qualification.forEach((item) => {
        result.push([
          item.qualificationName,
          item.employeeName,
          item.expiryDate,
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
    <div className="row position-tittle d-flex justify-content-between align-items-center">
      <div className="col-sm-6">
        <h2>DANH SÁCH BẰNG CẤP</h2>
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
          onClick={getQualificationExport}
          filename={"List-Qualification.csv"}
          className="btn btn-danger align-items-center"
        >
          <i className="fas fa-file-export"></i>
        </CSVLink>
      </div>
    </div>
  );
};

export default QualificationTitleComponents;
