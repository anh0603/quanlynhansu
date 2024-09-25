// Service methods

import axios from 'axios';

const apiEndpoint = 'http://localhost:9002/hr/qualifications';
const apiEmployee = 'http://localhost:9002/hr/employees/all';
const apiAddQualification = 'http://localhost:9002/hr/qualifications/create';
const apiUpdateQualification = 'http://localhost:9002/hr/qualifications/update';
const apiDeleteQualification = 'http://localhost:9002/hr/qualifications/delete';
const apiFilterQualification = 'http://localhost:9002/hr/qualifications/search';

export const fetchEmployees = async () => {
    try {
        const response = await axios.get(apiEmployee);

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

export const filterQualification = async (statusFilter) => {
    try {
        const response = await axios.get(apiFilterQualification, {
            params: {
                pageNo: statusFilter.pageNo,
                pageSize: statusFilter.pageSize,
                status: statusFilter.status || '',
                keyword: statusFilter.keyword || ''
            }
        });

        const qualificationData = response.data.data?.content || [];

        return {
            data: qualificationData.sort((a, b) => b.status - a.status),
            currentPage: (response.data.data.number || 0) + 1,
            totalPages: response.data.data.totalPages || 1
        };
    } catch (error) {
        console.error('Có lỗi xảy ra khi filter dữ liệu!', error);
        throw error;
    }
};


// Add a new Qualification
export const addQualification = async (newQualification) => {
    try {
        const formData = new FormData();
        formData.append('qualificationDTO', new Blob([JSON.stringify(newQualification)], { type: 'application/json' }));
        formData.append('image', newQualification.image);

        try {
            const response = await axios.post(apiAddQualification, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm bằng cấp!', error);
            throw error;
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi thêm bằng cấp!', error);
        throw error;
    }
};

// Update an existing Qualification
export const updateQualification = async (updatedQualification) => {
    try {
        const formData = new FormData();
        formData.append('qualificationDTO', new Blob([JSON.stringify(updatedQualification)], { type: 'application/json' }));
        formData.append('image', updatedQualification.image);

        try {
            const response = await axios.put(`${apiUpdateQualification}/${updatedQualification.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Có lỗi xảy ra khi cập nhật bằng cấp!', error);
            throw error;
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật bằng cấp!', error);
        throw error;
    }
};

// Mark a Qualification as inactive
export const deleteQualification = async (id) => {
    try {
        const currentQualification = await axios.get(`${apiEndpoint}/${id}`);
        const updateQualification = {
            ...currentQualification.data.data,
            status: 0
        };
        const response = await axios.put(`${apiDeleteQualification}/${id}`, updateQualification);
        return response.data.data;
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật trạng thái bằng cấp!', error);
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