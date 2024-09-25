import React from 'react';
import ReactPaginate from "react-paginate";
import TableBodyComponents from "../../../components/TableBodyComponents";
import TableComponents from "../../../components/TableComponents";
import {CSVLink} from "react-csv";

const DepartmentTable = ({ header, row, pageCount, handlePageClick, searchEmployeeId,searchOvertimeDate,handleSearchEmployeeId,handleSearchOvertimeDate }) => (
    <div className="col-8">
        <div className="card">
            <h2 className="text-center">Danh sách làm thêm giờ</h2>
            <div className="card-body">
                <div id="example1_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                    <div className="row">
                        {/*<div className="col-sm-12 col-md-6"></div>*/}
                        <div className="col-sm-12 col-md-6 d-flex justify-content-start">
                            <div id="filter" className="dataTables_filter">
                                <label>Tìm kiếm:
                                    <input type="search" className="form-control form-control-sm"
                                           value={searchEmployeeId}
                                           onChange={handleSearchEmployeeId} placeholder="ID nhân sự"/>
                                </label>
                            </div>
                            <div id="filter" className="dataTables_filter">
                                <label>
                                    <input type="search" className="form-control form-control-sm"
                                           value={searchOvertimeDate}
                                           onChange={handleSearchOvertimeDate} placeholder="Ngày làm thêm"/>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 text-right">
                            <CSVLink
                                data={row.map(item => ({
                                    ID: item.data[0],
                                    NgayTangCa: item.data[1],
                                    GioLam: item.data[2],
                                    HeSo: item.data[3],
                                    TrangThai: item.data[4],
                                    IDNhanSu: item.data[5],
                                }))}
                                headers={[
                                    {label: "ID", key: "ID"},
                                    {label: "Ngày Tăng Ca", key: "NgayTangCa"},
                                    {label: "Giờ Làm", key: "GioLam"},
                                    {label: "Hệ Số", key: "HeSo"},
                                    {label: "Trạng Thái", key: "TrangThai"},
                                    {label: "ID Nhân Sự", key: "IDNhanSu"}
                                ]}
                                filename={"overtime_list.csv"}
                                className="btn btn-success"
                                target="_blank"
                            >
                              <i className="fas fa-file-excel"/>
                            </CSVLink>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <TableComponents headers={header}>
                                <TableBodyComponents rows={row}/>
                            </TableComponents>
                            <ReactPaginate
                                previousLabel={'<<'}
                                nextLabel={'>>'}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default DepartmentTable;