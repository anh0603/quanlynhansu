import axios from "axios";

const apiContract = "http://localhost:9002/hr/contracts";
const apiEmployees = "http://localhost:9002/hr/employees";
const apiContractCreated = "http://localhost:9002/hr/contracts/create";

// Lấy danh sách hợp đồng
export const fetchContracts = async (pageNo, pageSize) => {
  try {
    const response = await axios.get(apiContract, {
      params: {
        page: pageNo,
        size: pageSize
      }
    });
    console.log("Data tu be: ", response.data);
    if (response.data && response.data.data) {
      const contracts = response.data.data.content;

      // Sắp xếp hợp đồng
      const sortedContracts = Array.isArray(contracts) ? contracts.sort((a, b) => {
        if (b.status === a.status) {
          return new Date(b.updateAt) - new Date(a.updateAt);
        }
        return b.status - a.status;
      }) : [];

      return {
        content: sortedContracts,
        totalPages: response.data.data.totalPages,
        currentPage: response.data.data.number + 1
      };
    } else {
      throw new Error("Dữ liệu không hợp lệ từ server");
    }
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy dữ liệu hợp đồng!", error);
    throw error;
  }
};

// Lấy danh sách nhân sự
export const fetchPersons = async () => {
  try {
    const response = await axios.get(apiEmployees);
    if (response?.data?.code === 200 && response?.data?.data?.content) {
      return response.data.data.content;
    } else {
      console.error("Dữ liệu không hợp lệ:", response.data);
      throw new Error("Không thể lấy danh sách nhân sự");
    }
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy danh sách nhân sự!", error);
    throw new Error("Không thể lấy danh sách nhân sự");
  }
};


// Thêm mới hợp đồng
export const createContract = async (newContract) =>
{
  try {
    console.log(newContract);
    const formData = new FormData();
    formData.append('contractDTO', new Blob([JSON.stringify(newContract)], {type: 'application/json'}));
    formData.append('contentContract', newContract.contentContract);

    const response = await axios.post(apiContractCreated, formData);

    return response.data.content;
  }
  catch (error) {
    handleError(error, "Có lỗi xảy ra khi thêm hợp đồng!");
  }
}

// Cập nhật hợp đồng

export const updateContract = async (updatedContract) => {
  try {
    const formData = new FormData();

    // Thêm đối tượng JSON vào formData
    formData.append('contractDTO', new Blob([JSON.stringify(updatedContract)], { type: 'application/json' }));

    // Nếu có file được chọn
    if (updatedContract.contentContract && updatedContract.contentContract.length > 0) {
      formData.append('contentContract', updatedContract.contentContract[0]);
    }

    const response = await axios.put(`${apiContract}/${updatedContract.id}`, formData);

    return response.data.content;
  } catch (error) {
    handleError(error, "Có lỗi xảy ra khi cập nhật hợp đồng!");
  }
};

// Cập nhật trạng thái hợp đồng (status = false)
export const updateContractStatus = async (contractId, status) => {
  try {
    const response = await axios.put(`${apiContract}/delete/${contractId}`, { status });
    return response.data;
  } catch (error) {
    handleError(error, "Có lỗi xảy ra khi cập nhật trạng thái hợp đồng!");
  }
};

// Tìm kiếm hợp đồng
export const handleSearch = async (searchParams, pageNo = 0, pageSize = 10) => {
  try {
    const queryString = new URLSearchParams({ ...searchParams, pageNo, pageSize }).toString();
    const url = `${apiContract}/search?${queryString}`;

    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.data) {
      return {
        content: response.data.data.contracts,
        totalPages: response.data.data.totalPages,
        totalElements: response.data.data.totalElements
      };
    } else {
      throw new Error("Dữ liệu không hợp lệ từ server");
    }
  } catch (error) {
    handleError(error, 'Có lỗi xảy ra khi tìm kiếm!');
  }
};

// Upload file
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${apiContract}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};


// Xử lý lỗi chung
const handleError = (error, defaultMessage) => {
  if (error.response) {
    console.error(defaultMessage, error.response.data);
    throw new Error(`Lỗi từ máy chủ: ${error.response.data.message}`);
  } else if (error.request) {
    console.error("Không nhận được phản hồi từ máy chủ", error.request);
    throw new Error("Không nhận được phản hồi từ máy chủ");
  } else {
    console.error("Lỗi cấu hình yêu cầu", error.message);
    throw new Error(`Lỗi cấu hình yêu cầu: ${error.message}`);
  }
};
