import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Timesheet1 from './Timesheet1Component/index.jsx';

const TimesheetComponent = ({show, handleClose, contract, onSave}) => {

    const [timesheets, setTimesheets] = useState([]);
    const [showTimesheet, setShowTimesheet] = useState(false);


    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="font-weight-bold mx-2 my-5">TIMESHEET</h2>
            </div>

            <div>
                <Timesheet1/>
            </div>
        </>
    )
}
export default TimesheetComponent;
