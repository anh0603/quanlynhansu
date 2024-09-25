// Service methods

import axios from 'axios';

const coreApi = 'http://localhost:9002/hr/positions';
const apiFetchDepartment = 'http://localhost:9002/hr/department/getAllDepartment';
const apiFetchPosition = 'http://localhost:9002/hr/positions/search';
const apiUpdatePosition = 'http://localhost:9002/hr/positions/update';
const apiAddPosition = 'http://localhost:9002/hr/positions/create';
const apiDeletePosition = 'http://localhost:9002/hr/positions/delete';
const apiFetchAllPosition = 'http://localhost:9002/hr/positions/all';

export const fetchDepartment = async () => {
    try {
        const response = await axios.get(apiFetchDepartment);
        console.log(response.data.data);
        // Sorting positions based on 'status'; assuming 'true' values are sorted higher
        return response.data.data.sort((a, b) => b.status - a.status);
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy dữ liệu!', error);
        throw error;
    }
}

export const fetchAllPosition = async () => {
    try {
        const response = await axios.get(apiFetchAllPosition);
        console.log(response.data.data);
        // Sorting positions based on 'status'; assuming 'true' values are sorted higher
        return response.data.data.sort((a, b) => b.status - a.status);
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy dữ liệu!', error);
        throw error;
    }
}

export const fetchPosition = async (statusFilter) => {
    try {
        const response = await axios.get(apiFetchPosition,{
            params: {
                pageNo: statusFilter.pageNo,
                pageSize: statusFilter.pageSize,
                status: statusFilter.status || '',
                keyword: statusFilter.keyword || ''
            }
        });
        const positionData = response.data.data?.content || [];

        return {
            data: positionData.sort((a, b) => b.status - a.status),
            currentPage: response.data.data.number + 1,
            totalPages: response.data.data.totalPages
        };
    } catch (error) {
        console.error('Có lỗi xảy ra khi lấy dữ liệu!', error);
        throw error;
    }
};

// Add a new position
export const addPosition = async (newPosition) => {
    try {
        console.log(newPosition);
        const response = await axios.post(apiAddPosition, newPosition);
        return response.data.data;
    } catch (error) {
        console.error('Có lỗi xảy ra khi thêm chức vụ!', error);
        throw error;
    }
};

// Update an existing position
export const updatePosition = async (updatedPosition) => {
    try {
        const response = await axios.put(`${apiUpdatePosition}/${updatedPosition.id}`, updatedPosition);
        return response.data.data;
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật hợp đồng!', error);
        throw error;
    }
};

// Mark a position as inactive
export const deletePosition = async (id) => {
    try {
        // Fetch current data to maintain other fields
        const currentPosition = await axios.get(`${coreApi}/${id}`);
        const updatePosition = {
            ...currentPosition.data,
            status: false
        };
        const response = await axios.put(`${apiDeletePosition}/${id}`, updatePosition);
        return response.data;
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật trạng thái hợp đồng!', error);
        throw error;
    }
};

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${coreApi}/upload/excel`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};