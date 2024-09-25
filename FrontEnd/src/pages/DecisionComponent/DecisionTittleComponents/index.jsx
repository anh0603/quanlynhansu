import React, { useState } from "react";
import "../Decision.scss";
import { CSVLink } from "react-csv";
import SearchComponents from "../../../components/SearchComponents";
import ButtonComponents from "../../../components/ButtonComponents";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Papa from "papaparse";

const DecisionTittleComponents = ({ decisions, onSearch, onAddDecision }) => {
    const [dataExport, setDataExport] = useState([]);
    const [importData, setImportData] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const decisionTypeMap = {
        reward: "Khen thưởng",
        discipline: "Kỷ luật"
    };
    const decisionTypeMaps = [
        "Khen thưởng",
        "Kỷ luật"
    ];
    const decisionMoneys = [
        "Dưới 10 triệu",
        "Từ 10 triệu đến 30 triệu",
        "Từ 30 triệu đến 50 triệu",
        "Trên 50 triệu",
    ];

    // Tìm kiếm cập nhật
    const handleSearch = () => {
        const searchValue = searchTerm ? searchTerm.toLowerCase() : "";

        const filteredContracts = decisions.filter((decision) => {
            const employeeCode = decision.employeeCode
                ? decision.employeeCode.toLowerCase()
                : "";
            const category = decision.category
                ? (decisionTypeMap[decision.contractCategory] || "").toLowerCase()
                : "";
            const money = decision.money ? parseFloat(decision.money) : 0;

            const matchesSearchTerm =
                employeeCode.includes(searchValue) ||
                category.includes(searchValue) ||
                money >= minSalary &&
                money <= maxSalary;

            const matchesDecisionType =
                selectedType === "" ||
                (decisionTypeMaps.includes(selectedType) &&
                    category.includes(selectedType.toLowerCase()));

            const min = minSalary !== "" ? parseFloat(minSalary) : -Infinity;
            const max = maxSalary !== "" ? parseFloat(maxSalary) : Infinity;

            const matchesSalary =
                (minSalary === "" && maxSalary === "") ||
                (money >= min && money <= max);

            return matchesSearchTerm && matchesDecisionType && matchesSalary;
        });

        onSearch(filteredContracts);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    // Hàm xử lý thay đổi giá trị trong dropdown money
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
            if (decisions && decisions.length > 0) {
                result.push([
                    "ID",
                    "Mã nhân viên",
                    "Mã quyết định",
                    "Nội dung",
                    "Mức tiền",
                    "Ngày quyết định",

                    "Trạng thái",
                    "Ngày tạo",
                    "Ngày cập nhật",
                    "Ảnh"

                ]);
                decisions.forEach((item) => {
                    let arr = [];
                    arr[0] = item.id;
                    arr[1] = item.employeeCode;
                    arr[2] = item.rdCode;
                    arr[3] = item.content;
                    arr[4] = item.money;
                    arr[5] = formatDate(item.rdDate); // Format rdDate
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
    const addDecisionFromFile = async (data, handleAddDecision) => {
        const now = new Date();

        // Chuyển đổi từng bản ghi trong dữ liệu CSV
        for (const item of data) {
            const decision = {
                employeeCode: item["Mã nhân viên"] || "",
                rdCode: item["Mã quyết định"] || "",
                money: item["Mức tiền"] || "",
                decisionDate: format(new Date(item["Ngày quyết định"]), "yyyy-MM-dd") || "",
                content: item["Nội dung"] || "",
                status: item["Trạng thái"] === "Active", // Chuyển trạng thái từ "Active" hoặc "Inactive" sang boolean
                files: [], // Giả sử không có tệp đính kèm từ file CSV
                created_at: now.toISOString(),
                updated_at: now.toISOString(),
            };

            try {
                await handleAddDecision(decision);
            } catch (error) {
                console.error("Có lỗi xảy ra khi thêm hợp đồng:", error);
            }
        }
    };

    const validateData = (data) => {
        // console.log(data);
        const newErrors = [];
        const employeeCodes = decisions.map((desicion) => desicion.employeeCode);

        data.forEach((item, index) => {
            const rowIndex = index + 1; // Số hàng trong dữ liệu nhập

            // Kiểm tra mã nhân viên
            const employeeCode = item["Mã nhân viên"]?.trim(); // Sử dụng tên trường đúng
            if (!employeeCode) {
                newErrors.push(`Hàng ${rowIndex}: Mã nhân viên không được để trống.`);
            } else if (employeeCode.length !== 10) {
                newErrors.push(`Hàng ${rowIndex}: Mã nhân viên phải là 10 ký tự.`);
            } else if (employeeCodes.includes(employeeCode)) {
                newErrors.push(`Hàng ${rowIndex}: Mã nhân viên đã tồn tại.`);
            }

            // Kiểm tra loại hợp đồng
            const category = item["Loại hợp đồng"]?.trim();
            if (!category) {
                newErrors.push(`Hàng ${rowIndex}: Loại hợp đồng không được để trống.`);
            }

            // Kiểm tra mức tiền
            const money = Number(
                item["Mức lương"]?.replace(/\./g, "").replace(/,/g, ""),
            );
            if (isNaN(money) || money <= 0) {
                newErrors.push(`Hàng ${rowIndex}: Mức lương phải là số dương.`);
            }

            // Kiểm tra trạng thái
            const status = item["Trạng thái"]?.trim();
            if (!status || status.toLowerCase() !== "active") {
                newErrors.push(`Hàng ${rowIndex}: Trạng thái phải là 'Active'`);
            }

            // Kiểm tra ngày quyết định
            const decisionDate = item["Ngày bắt đầu"]?.trim();
            if (!decisionDate) {
                newErrors.push(`Hàng ${rowIndex}: Ngày bắt đầu không được để trống.`);
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
                        await addDecisionFromFile(data, onAddDecision);
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
        <div className="decision-tittle row d-flex justify-content-between align-items-center">
            <div className="col-sm-4">
                <h2>DANH SÁCH QUYẾT ĐỊNH</h2>
            </div>
            <div className="action-button col-sm-8 d-flex justify-content-end align-items-center">
                <div className="filter-section">
                    <select
                        id="category"
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="filter-select"
                    >
                        <option value="">Chọn loại quyết định</option>
                        {decisionTypeMaps.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    <select
                        id="money"
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
                        <option value="">Mức tiền</option>
                        {decisionMoneys.map((salary, index) => (
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

export default DecisionTittleComponents;
