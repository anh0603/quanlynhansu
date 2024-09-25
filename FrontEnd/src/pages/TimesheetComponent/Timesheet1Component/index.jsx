import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import PagingComponent from "../../../components/PagingComponent";
import Details from "../DetailsComponent/index.jsx";
import Timesheet2 from "../Timesheet2Component";
import TimesheetTable from "../TimesheetTableComponent";
import ExportButton from './ExportButtonComponent';
import ImportButton from "./ImportButtonComponent";

const Timesheet1 = () => {
    const itemsPerPage = 10;

    const [timesheets, setTimesheets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedTimesheet, setSelectedTimesheet] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTimesheets, setFilteredTimesheets] = useState([]);

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                const response = await axios.get('https://66b19f8e1ca8ad33d4f4971e.mockapi.io/api/v1/timesheets');
                const filteredTimesheets = response.data.map(timesheet => ({
                    id: timesheet.id,
                    employee_id: timesheet.employee_id,
                    employee_name: timesheet.employee_name,
                    status: timesheet.status
                }));
                setTimesheets(filteredTimesheets);
                setFilteredTimesheets(filteredTimesheets);
                console.log(filteredTimesheets);
            } catch (err) {
                setError(err.message); // Set error message to state
                console.error("Error fetching timesheets:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimesheets().then(r => console.log("Timesheets fetched!"));
    }, []);



    useEffect(() => {
        // Filter data based on the search term
        const results = timesheets.filter(timesheet =>
            timesheet.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            timesheet.employee_id.toString().includes(searchTerm)
        );
        setFilteredTimesheets(results);
    }, [searchTerm, timesheets]);


    const handleRowClick = async (timesheet) => {
        try {
            const response = await axios.get(`https://66b19f8e1ca8ad33d4f4971e.mockapi.io/api/v1/timesheets/${timesheet.id}`);

            // Extract the required fields from the response
            const { employee_name, date, checkin, checkout_time, note } = response.data;

            // Extract checkinhour and checkouthour from checkin and checkout_time (assuming they are in HH:mm format)
            const checkinHour = checkin ? checkin.split(':')[0] : null;
            const checkoutHour = checkout_time ? checkout_time.split(':')[0] : null;

            const selectedTimesheet = { employee_name, date, checkinHour, checkoutHour, note };

            setSelectedTimesheet(selectedTimesheet);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching timesheet details:", err);
        }
    };



    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleImport = (importedData) => {
        setTimesheets(importedData);
    };

    const handleAddTimesheet = (newTimesheet) => {
        setTimesheets([...timesheets, newTimesheet]);
        setFilteredTimesheets([...filteredTimesheets, newTimesheet]);
    };

    const handleDeleteTimesheet = (id) => {
        setTimesheets(prevTimesheets => prevTimesheets.filter(timesheet => timesheet.id !== id));
        setFilteredTimesheets(prevFilteredTimesheets => prevFilteredTimesheets.filter(timesheet => timesheet.id !== id));
    };

    const headers = ['ID', 'Tên nhân viên', 'Trạng thái', 'Action'];

    // Calculate total pages
    const totalPage = Math.ceil(filteredTimesheets.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTimesheets.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid">
            <div className="card mt-2">
                <div className="card-header d-flex align-items-right">
                    <div className="d-flex align-items-center">
                        <div
                            className="header-icon d-flex align-items-center justify-content-center position-relative mr-3"
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: '10%',
                                background: 'linear-gradient(to bottom, #ff6600 0%, #ff0000 100%)'
                            }}>
                            <i className="fas fa-calendar fa-lg" style={{ color: 'rgb(255, 255, 255)' }} />
                        </div>
                        <div className="header-title">
                            <p className="font-weight-bold mb-0">TIMESHEET</p>
                        </div>
                    </div>
                    <div className="header-button ml-auto d-flex align-items-center ">
                        <div className="header-upload-btn">
                            <ImportButton onImport={handleImport}>
                                <i className="fa fa-upload">Import</i>
                            </ImportButton>
                        </div>
                        <div className="header-download-btn">
                            <ExportButton data={filteredTimesheets} headers={headers} className="btn-danger">
                                <i className="fa fa-upload ">Export</i>&nbsp;
                            </ExportButton>
                        </div>
                    </div>
                </div>
                <div className="card-pre-body d-flex mt-3 justify-content-between">
                    <div className="form-search w-100">
                        <form className="form-inline d-flex justify-content-between w-100">
                            <div className="flex-grow-1">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Employee ID or Name"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="flex-shrink-0 mr-0 justify-content-end">
                                <Timesheet2 onAddTimesheet={handleAddTimesheet}>
                                    <FontAwesomeIcon icon="fas fa-plus">Add</FontAwesomeIcon>
                                </Timesheet2>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="card-body mt-2">
                    <div className="table-responsive table-hover justify-content-center align-items-center" style={{ width: 'auto' }}>
                        <TimesheetTable
                            timesheets={currentItems}
                            setTimesheets={handleDeleteTimesheet}
                            onRowClick={handleRowClick}  // Pass the onRowClick handler
                        />
                    </div>
                </div>
                <div className="timesheet-paging mt-2">
                    <PagingComponent
                        totalPage={totalPage}
                        currentPage={currentPage}
                        onPageChange={paginate}
                    />
                </div>
                <Details timesheet={selectedTimesheet} setTimesheets={setSelectedTimesheet} />  {/* Pass selectedTimesheet to Details */}
            </div>
        </div>
    );
}

export default Timesheet1;