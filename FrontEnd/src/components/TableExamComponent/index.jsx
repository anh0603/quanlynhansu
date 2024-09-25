import React from "react";
import { Table, Spinner, Button } from "react-bootstrap";

const TableExamComponent = ({
  data = [],
  cols = [],
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp * 1000);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  return (
    <div>
      <Table bordered hover>
        <thead>
          <tr style={{ textAlign: "center" }}>
            {cols.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={cols.length} style={{ textAlign: "center" }}>
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ textAlign: "center" }}>
                <td>{row.STT}</td>
                <td>{row.ma_mon}</td>
                <td>{row.ma_lop}</td>
                <td>{formatDate(row.thoi_gian)}</td>
                <td>{row.link_bai_thi}</td>
                <td>
                  <Button
                    variant="light"
                    size="sm"
                    className="me-2"
                    onClick={() => onView(row)}
                  >
                    View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TableExamComponent;
