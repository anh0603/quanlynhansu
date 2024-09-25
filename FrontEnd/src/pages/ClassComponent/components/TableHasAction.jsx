import { Button, Table } from "react-bootstrap";
import { classListTableCols } from "../constants";
import { useGetClassList } from "../hooks";
import useClassStore from "../useClassStore";

const TableHasAction = () => {
  const setShowModalView = useClassStore((state) => state.setShowModalView);
  const setDataRow = useClassStore((state) => state.setDataRow);
  const setModeModal = useClassStore((state) => state.setModeModal);
  const setShowModalCommon = useClassStore((state) => state.setShowModalCommon);

  const { data } = useGetClassList();

  const handleView = (row) => {
    setShowModalView(true);
    setDataRow(row);
  };

  const handleEdit = (row) => {
    setModeModal(true);
    setShowModalCommon(true);
    setDataRow(row);
  };

  return (
    <Table bordered hover>
      <thead>
        <tr>
          {classListTableCols.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data?.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {classListTableCols.map((column) => (
              <td key={column.key}>{row[column.key]}</td>
            ))}
            <td>
              <Button
                variant="light"
                className="me-2"
                onClick={() => handleView(row)}
              >
                View
              </Button>
              <Button
                variant="primary"
                className="me-2"
                onClick={() => handleEdit(row)}
              >
                Edit
              </Button>

              <Button variant="danger">Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableHasAction;
