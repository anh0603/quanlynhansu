import React ,{useState} from 'react';
import "../TimesheetTableComponent/CheckinButtonComponent/index.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

const Details =({timesheets, selectedTimesheet, setSelectedTimesheet} ) =>{

    const [showData, setShowData] = useState(false);

    return (
        <div className="container-fluid">
            <div className="card mt-5">
                <div className="card-header d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <div
                            className="header-icon d-flex align-items-center justify-content-center position-relative mr-3"

                        >
                            <i className="fas fa-clock fa-lg" style={{color: '#ffffff'}}/>
                        </div>
                        <div className="header-title">
                            <p className="font-weight-bold mb-0">DETAIL</p>
                        </div>
                    </div>

                </div>
                <div className="card-body mt-2">
                    {/*<p><strong>Employee Name:</strong> {selectedTimesheet.employee_name}</p>*/}
                    {/*<p><strong>Date:</strong> {selectedTimesheet.date}</p>*/}
                    {/*<p><strong>Check-in Time:</strong> {selectedTimesheet.checkin}</p>*/}
                    {/*<p><strong>Checkout Time:</strong> {selectedTimesheet.checkout_time}</p>*/}
                    {/*<p><strong>Note:</strong> {selectedTimesheet.note}</p>*/}
                </div>
            </div>
        </div>
    )
}
export default Details;