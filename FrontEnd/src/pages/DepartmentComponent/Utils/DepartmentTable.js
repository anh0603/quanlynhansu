import React from 'react';
import ReactPaginate from "react-paginate";
import TableBodyComponents from "../../../components/TableBodyComponents";
import TableComponents from "../../../components/TableComponents";

const DepartmentTable = ({ header, row, pageCount, handlePageClick, search, handleSearch }) => (
    <div className="col-6">
        <div className="card">
            <h2 className="text-center">Danh sách phòng ban</h2>
            <div className="card-body">
                <div id="example1_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                    <div className="row">
                        <div className="col-sm-12 col-md-6"></div>
                        <div className="col-sm-12 col-md-6">
                            <div id="filter" className="dataTables_filter">
                                <label>Search:
                                    <input type="search" className="form-control form-control-sm" value={search} onChange={handleSearch} placeholder="Tên phòng ban" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <TableComponents headers={header}>
                                <TableBodyComponents rows={row} />
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