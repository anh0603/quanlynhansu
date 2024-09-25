import React, {useEffect, useRef, useState} from 'react';
import '../Personnel.scss';
import {CSVLink} from "react-csv";
import SearchComponents from "../../../components/SearchComponents";
import ButtonComponents from "../../../components/ButtonComponents";
import {fetchPersonel} from "../PersonnelService/PersonnelSevice";
import {toast} from "react-toastify";

const PersonnelTittleComponents = ({personnels = [], onSearch, onAddNewClick, currentPage}) => {
    const fileInputRef = useRef(null);
    const [dataExport, setDataExport] = useState([]);
    const [filteredPersionel, setFilterPersionel] = useState({});
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
        fetchPersonel(statusFilter).then(res => {
            setFilterPersionel(res);
        }).catch(error => {
            console.error('Có lỗi xảy ra khi lọc dữ liệu:', error);
        });
    }, [statusFilter]);

    useEffect(() => {
        onSearch(filteredPersionel);
    }, [filteredPersionel]);

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


    // Format the data for CSV export
    const getPersinelExport = (event, done) => {
        if (personnels && personnels.length > 0) {
            const result = [
                ["Tên bằng cấp", "Tên nhân viên", "Thời hạn", "Trạng thái"]
            ];

            personnels.forEach((item) => {
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


    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // if (file) {
        //     uploadFile(file)
        //         .then(response => {
        //             toast.success('File uploaded successfully');
        //         })
        //         .catch(error => {
        //             toast.error('Failed to upload file');
        //         });
        // } else {
        //     toast.error('No file selected');
        // }
    };


    return (
        <div className="row personnel-tittle d-flex justify-content-between align-items-center">
            <div className="col-sm-4">
                <h2>DANH SÁCH NHÂN VIÊN</h2>
            </div>
            <div className="col-sm-8 d-flex justify-content-end align-items-center">
                <div className="d-flex ms-auto">
                    <select
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
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                    </select>

                    <SearchComponents
                        onSearch={handleSearch}
                        placeholder="Tìm kiếm..."
                        className="me-2"
                    />
                </div>
                <ButtonComponents
                    className='btn btn-success me-2'
                    onClick={onAddNewClick}
                >
                    Thêm mới
                </ButtonComponents>
                <ButtonComponents
                    className='btn btn-danger me-2'
                    onClick={handleImportClick}
                >
                    <i className="fas fa-file-excel"></i>&nbsp;
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
                    onClick={getPersinelExport}
                    filename={"List-personnel.csv"}
                    className="btn btn-primary"
                >
                    <i className="fas fa-file-export"></i>&nbsp;
                </CSVLink>
            </div>
        </div>
    );
};

export default PersonnelTittleComponents;
