import { Table } from "react-bootstrap";
import { studentListByClassIdCols } from "../constants";
import { useGetStudentByClassId } from "../hooks";
import useClassStore from "../useClassStore";

const TableNoActions = () => {
  const dataRow = useClassStore((state) => state.dataRow);
  const { data } = useGetStudentByClassId(dataRow.id);

  return (
    <Table bordered hover>
      <thead>
        <tr>
          {studentListByClassIdCols.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row, rowIndex) => {
          return (
            <tr key={rowIndex}>
              {studentListByClassIdCols.map((column) => {
                return (
                  <td key={column.key}>
                    {column.key === "status" ? (
                      row[column.key] ? (
                        <span className="bg-success text-white rounded px-2 py-1">
                          Đang học
                        </span>
                      ) : (
                        <span className="bg-secondary text-white rounded px-2 py-1">
                          Đã thôi học
                        </span>
                      )
                    ) : (
                      row[column.key]
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TableNoActions;
