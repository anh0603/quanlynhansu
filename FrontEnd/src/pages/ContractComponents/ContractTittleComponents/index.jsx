import React, { useState } from "react";
import "../Contract.scss";
import { CSVLink } from "react-csv";
import SearchComponents from "../../../components/SearchComponents";
import ButtonComponents from "../../../components/ButtonComponents";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Papa from "papaparse";

const ContractTitleComponents = ({ contracts, onSearch, onAddContract }) => {
  const [dataExport, setDataExport] = useState([]);
  const [importData, setImportData] = useState([]); 
  const [selectedType, setSelectedType] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const contractTypeMap = {
    fulltime: "Hợp đồng lao động chính thức",
    parttime: "Hợp đồng lao động parttime",
    freelance: "Hợp đồng Freelance",
    probationary: "Hợp đồng thử việc",
    intern: "Hợp đồng thực tập",
  };
  const contractTypeMaps = [
    "Hợp đồng lao động chính thức",
    "Hợp đồng lao động parttime",
    "Hợp đồng Freelance",
    "Hợp đồng thử việc",
    "Hợp đồng thực tập",
  ];
  const contractSalaries = [
    "Dưới 10 triệu",
    "Từ 10 triệu đến 30 triệu",
    "Từ 30 triệu đến 50 triệu",
    "Trên 50 triệu",
  ];

  // Tìm kiếm cập nhật
  const handleSearch = () => {
    const searchValue = searchTerm ? searchTerm.toLowerCase() : "";

    const filteredContracts = contracts.filter((contract) => {
      const employeeCode = contract.employeeCode
        ? contract.employeeCode.toLowerCase()
        : "";
      const contractCategory = contract.contractCategory
        ? (contractTypeMap[contract.contractCategory] || "").toLowerCase()
        : "";
      const salary = contract.salary ? parseFloat(contract.salary) : 0;

      const matchesSearchTerm =
        employeeCode.includes(searchValue) ||
        contractCategory.includes(searchValue) ||
        salary >= minSalary &&
        salary <= maxSalary;

      const matchesContractType =
        selectedType === "" ||
        (contractTypeMaps.includes(selectedType) &&
          contractCategory.includes(selectedType.toLowerCase()));

      const min = minSalary !== "" ? parseFloat(minSalary) : -Infinity;
      const max = maxSalary !== "" ? parseFloat(maxSalary) : Infinity;

      const matchesSalary =
        (minSalary === "" && maxSalary === "") ||
        (salary >= min && salary <= max);

      return matchesSearchTerm && matchesContractType && matchesSalary;
    });

    onSearch(filteredContracts);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  // Hàm xử lý thay đổi giá trị trong dropdown lương
  const handleSalaryChange = (e) => {
    const value = e.target.value;

    // Phân tích giá trị từ dropdown để thiết lập minSalary và maxSalary
    switch (value) {
      case "Dưới 10 triệu":
        setMinSalary(0);
        setMaxSalary(10000000);
        break;
      case "Từ 10 triệu đến 30 triệu":
        setMinSalary(10000000);
        setMaxSalary(30000000);
        break;
      case "Từ 30 triệu đến 50 triệu":
        setMinSalary(30000000);
        setMaxSalary(50000000);
        break;
      case "Trên 50 triệu":
        setMinSalary(50000000);
        setMaxSalary(Infinity);
        break;
      default:
        setMinSalary("");
        setMaxSalary("");
        break;
    }
  };

  // Xử lí click button import file :
  const handleImportClick = () => {
    document.getElementById("import").click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm:ss/dd:MM:yyyy");
    } catch {
      return "";
    }
  };

  // Export file csv theo header :
  const getContractExport = () => {
    return new Promise((resolve) => {
      let result = [];
      if (contracts && contracts.length > 0) {
        result.push([
          "ID",
          "Mã nhân viên",
          "Loại hợp đồng",
          "Mức lương",
          "Ngày bắt đầu",
          "Ngày kết thúc",
          "Trạng thái",
          "Ngày tạo",
          "Ngày cập nhật",
          "Ảnh",
        ]);
        contracts.forEach((item) => {
          let arr = [];
          arr[0] = item.id;
          arr[1] = item.employeeId;
          arr[2] = item.contractType;
          arr[3] = item.salary;
          arr[4] = item.startDate;
          arr[5] = item.endDate;
          arr[6] = item.status ? "Active" : "Inactive";
          arr[7] = formatDate(item.created_at); // Format created_at
          arr[8] = formatDate(item.updated_at); // Format updated_at
          arr[9] = item.files
            ? item.files.map((file) => file.name).join("; ")
            : "";
          result.push(arr);
        });
        setDataExport(result);
      }
      resolve();
    });
  };

  // Hàm chuyển đổi dữ liệu từ file CSV thành định dạng hợp lệ
  const addContractFromFile = async (data, handleAddContract) => {
    const now = new Date();

    // Chuyển đổi từng bản ghi trong dữ liệu CSV
    for (const item of data) {
      const contract = {
        employeeId: item["Mã nhân viên"] || "",
        contractType: item["Loại hợp đồng"] || "",
        salary: item["Mức lương"] || "",
        startDate: format(new Date(item["Ngày bắt đầu"]), "yyyy-MM-dd") || "",
        endDate: format(new Date(item["Ngày kết thúc"]), "yyyy-MM-dd") || "",
        files: [], // Giả sử không có tệp đính kèm từ file CSV
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      try {
        await handleAddContract(contract);
      } catch (error) {
        console.error("Có lỗi xảy ra khi thêm hợp đồng:", error);
      }
    }
  };

  const validateData = (data) => {
    // console.log(data);
    const newErrors = [];
    const employeeIds = contracts.map((contract) => contract.employeeId);

    data.forEach((item, index) => {
      const rowIndex = index + 1; // Số hàng trong dữ liệu nhập

      // Kiểm tra mã nhân viên
      const employeeId = item["Mã nhân viên"]?.trim(); // Sử dụng tên trường đúng
      if (!employeeId) {
        newErrors.push(`Hàng ${rowIndex}: Mã nhân viên không được để trống.`);
      } else if (employeeId.length !== 10) {
        newErrors.push(`Hàng ${rowIndex}: Mã nhân viên phải là 10 ký tự.`);
      } else if (employeeIds.includes(employeeId)) {
        newErrors.push(`Hàng ${rowIndex}: Mã nhân viên đã tồn tại.`);
      }

      // Kiểm tra loại hợp đồng
      const contractType = item["Loại hợp đồng"]?.trim();
      if (!contractType) {
        newErrors.push(`Hàng ${rowIndex}: Loại hợp đồng không được để trống.`);
      }

      // Kiểm tra mức lương
      const salary = Number(
        item["Mức lương"]?.replace(/\./g, "").replace(/,/g, ""),
      );
      if (isNaN(salary) || salary <= 0) {
        newErrors.push(`Hàng ${rowIndex}: Mức lương phải là số dương.`);
      }
      // Kiểm tra trạng thái
      const status = item["Trạng thái"]?.trim();
      if (!status || status.toLowerCase() !== "active") {
        newErrors.push(`Hàng ${rowIndex}: Trạng thái phải là 'Active'`);
      }

      // Kiểm tra ngày bắt đầu
      const startDate = item["Ngày bắt đầu"]?.trim();
      if (!startDate) {
        newErrors.push(`Hàng ${rowIndex}: Ngày bắt đầu không được để trống.`);
      }

      // Kiểm tra ngày kết thúc
      const endDate = item["Ngày kết thúc"]?.trim();
      if (!endDate) {
        newErrors.push(`Hàng ${rowIndex}: Ngày kết thúc không được để trống.`);
      } else if (new Date(startDate) > new Date(endDate)) {
        newErrors.push(
          `Hàng ${rowIndex}: Ngày kết thúc phải sau ngày bắt đầu.`,
        );
      }
    });

    return newErrors;
  };

  // Sử dụng papa để import dữ liệu
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data } = results;
          const validationErrors = validateData(data);
          if (validationErrors.length > 0) {
            validationErrors.forEach((error) => toast.error(error));
          } else {
            await addContractFromFile(data, onAddContract);
            toast.success("Dữ liệu nhập thành công.");
          }
        },
        error: (error) => {
          console.error("Error parsing file:", error);
          toast.error("Có lỗi xảy ra khi xử lý tệp.");
        },
      });
    }
  };

  return (
    <div className="contract-tittle row d-flex justify-content-between align-items-center">
      <div className="col-sm-4">
        <h2>DANH SÁCH HỢP ĐỒNG</h2>
      </div>
      <div className="action-button col-sm-8 d-flex justify-content-end align-items-center">
        <div className="filter-section">
          <select
            id="contractType"
            value={selectedType}
            onChange={handleTypeChange}
            className="filter-select"
          >
            <option value="">Chọn loại hợp đồng</option>
            {contractTypeMaps.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            id="salaryRange"
            value={
              minSalary === 0 && maxSalary === 10000000
                ? "Dưới 10 triệu"
                : minSalary === 10000000 && maxSalary === 30000000
                  ? "Từ 10 triệu đến 30 triệu"
                  : minSalary === 30000000 && maxSalary === 50000000
                    ? "Từ 30 triệu đến 50 triệu"
                    : minSalary === 50000000
                      ? "Trên 50 triệu"
                      : ""
            }
            onChange={handleSalaryChange}
            className="filter-select"
          >
            <option value="">Chọn mức lương</option>
            {contractSalaries.map((salary, index) => (
              <option key={index} value={salary}>
                {salary}
              </option>
            ))}
          </select>
        </div>
        <SearchComponents onSearch={handleSearch} />
        <ButtonComponents
          className="btn btn-success align-items-center"
          onClick={() => document.getElementById("import").click()}
        >
          <i className="fas fa-file-excel"></i>
        </ButtonComponents>
        <input
          id="import"
          type="file"
          hidden
          onChange={() => {
            /* Handle file change logic */
          }}
        />
        <CSVLink
          data={dataExport}
          asyncOnClick={true}
          onClick={() => {
            /* Handle export logic */
          }}
          filename={"List-Contract.csv"}
          className="btn btn-danger align-items-center"
        >
          <i className="fas fa-file-export"></i>
        </CSVLink>
      </div>
    </div>
  );
};

export default ContractTitleComponents;
