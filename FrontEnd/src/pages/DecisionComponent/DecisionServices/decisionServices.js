import axios from "axios";

const apiDecisions = "http://localhost:9002/hr/reward-disciplines";
const apiEmployees = "http://localhost:9002/hr/employees";
const apiDecisionCreated = "http://localhost:9002/hr/reward-disciplines/create";

// Lấy danh sách hợp đồng
export const fetchDecisions = async (pageNo, pageSize) => {
    try {
        const response = await axios.get(apiDecisions, {
            params: {
                page: pageNo,
                size: pageSize
            }
        });
        console.log("Data tu be: ", response.data);
        if (response.data && response.data.data) {
            const decisions = response.data.data.content;

            // Sắp xếp hợp đồng
            const sortedDecisions = Array.isArray(decisions) ? decisions.sort((a, b) => {
                if (b.status === a.status) {
                    return new Date(b.updateAt) - new Date(a.updateAt);
                }
                return b.status - a.status;
            }) : [];

            return {
                content: sortedDecisions,
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

// Lấy danh sách nhân viên
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


// Thêm mới quyết định
export const createDecision = async (newDecision) =>
{
    try {
        console.log(newDecision);
        const formData = new FormData();

        formData.append('decisionDTO', new Blob([JSON.stringify(newDecision)], {type: 'application/json'}));
        formData.append('rdImages', newDecision.rdImages);


        const response = await axios.post(apiDecisionCreated, formData);

        return response.data.content;
    }
    catch (error) {
        handleError(error, "Có lỗi xảy ra khi thêm hợp đồng!");
    }
}

// Cập nhật hợp đồng
export const updateDecisions = async (updateDecision) => {
    try {
        const formData = new FormData();

        // Thêm đối tượng JSON vào formData
        formData.append('decisionDTO', new Blob([JSON.stringify(updateDecision)], { type: 'application/json' }));

        // Nếu có file được chọn
        if (updateDecision.rdImages && updateDecision.rdImages.length > 0) {
            formData.append('rdImages', updateDecision.rdImages[0]);
        }

        const response = await axios.put(`${apiDecisions}/${updateDecision.id}`, formData);

        return response.data.content;
    } catch (error) {
        handleError(error, "Có lỗi xảy ra khi cập nhật hợp đồng!");
    }
};

// Cập nhật trạng thái hợp đồng (status = false)
export const updateDecisionStatus = async (decisionId, status) => {
    try {
        const response = await axios.put(`${apiDecisions}/delete/${decisionId}`, { status });
        return response.data;
    } catch (error) {
        handleError(error, "Có lỗi xảy ra khi cập nhật trạng thái hợp đồng!");
    }
};

// Tìm kiếm hợp đồng
export const handleSearch = async (searchParams, pageNo = 0, pageSize = 10) => {
    try {
        const queryString = new URLSearchParams({ ...searchParams, pageNo, pageSize }).toString();
        const url = `${apiDecisions}/search?${queryString}`;

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

    return axios.post(`${apiDecisions}/upload`, formData, {
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
