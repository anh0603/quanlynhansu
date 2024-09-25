// Service methods

import axios from 'axios';

const apiEndpoint = 'http://localhost:9002/hr/allowances';
const apiFetchPosition = 'http://localhost:9002/hr/positions/all';
const apiAddAllowance = 'http://localhost:9002/hr/allowances/create';
const apiUpdateAllowance = 'http://localhost:9002/hr/allowances/update';
const apiDeleteAllowance = 'http://localhost:9002/hr/allowances/delete';
const apiFilterAllowance = 'http://localhost:9002/hr/allowances/search';

export const fetchPosition = async () => {
    try {
        const response = await axios.get(apiFetchPosition);

        if (response.data.data && Array.isArray(response.data.data)) {
            // Sorting positions based on 'status'; assuming 'true' values are sorted higher
            return response.data.data.sort((a, b) => b.status - a.status);
        } else {
            console.error('Dữ liệu không hợp lệ:', response.data.data);
            return [];
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy dữ liệu!', error);
        throw error;
    }
};

export const filterAllowance = async (statusFilter) => {
    try {
        const response = await axios.get(apiFilterAllowance, {
            params: {
                pageNo: statusFilter.pageNo,
                pageSize: statusFilter.pageSize,
                status: statusFilter.status || '',
                keyword: statusFilter.keyword || ''
            }
        });

        const allowanceData = response.data.data?.content || [];
        const pageData = response.data.data?.page || {};

        return {
            data: allowanceData.sort((a, b) => b.status - a.status),
            currentPage: (pageData.number || 0) + 1,
            totalPages: pageData.totalPages || 1
        };
    } catch (error) {
        console.error('Có lỗi xảy ra khi filter dữ liệu!', error);
        throw error;
    }
};


// Add a new Allowance
export const addAllowance = async (newAllowance) => {
    try {

        try {
            const response = await axios.post(apiAddAllowance, newAllowance);
            return response.data.data;
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm phụ cấp!', error);
            throw error;
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi thêm phụ cấp!', error);
        throw error;
    }
};

// Update Allowance
export const updateAllowance = async (updatedAllowance) => {
    try {

        try {
            const response = await axios.put(`${apiUpdateAllowance}/${updatedAllowance.id}`, updatedAllowance);
            return response.data.data;
        } catch (error) {
            console.error('Có lỗi xảy ra khi cập nhật phụ cấp!', error);
            throw error;
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật phụ cấp!', error);
        throw error;
    }
};

export const deleteAllowance = async (id) => {
    try {
        const currentAllowance = await axios.get(`${apiEndpoint}/${id}`);
        const updateAllowance = {
            ...currentAllowance.data.data,
            status: 0
        };
        const response = await axios.put(`${apiDeleteAllowance}/${id}`, updateAllowance);
        return response.data.data;
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật trạng thái phụ cấp!', error);
        throw error;
    }
};

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${apiEndpoint}/upload/excel`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};