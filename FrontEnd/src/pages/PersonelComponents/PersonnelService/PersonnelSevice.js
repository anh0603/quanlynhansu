// Service methods

import axios from 'axios';

const apiEndpoint = 'https://66b080af6a693a95b538f138.mockapi.io/API/Personnels/personnel/personnel';
const apiFetchPersinel ='http://localhost:9002/hr/employees/search';
const fetchRole = 'http://localhost:9002/hr/roles/all';
const apiAddPersonel = 'http://localhost:9002/hr/employees/create';

export const fetchRoles = async () => {
    try {
        const response = await axios.get(fetchRole);

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


export const fetchPersonel = async (statusFilter) => {
    try {
        const response = await axios.get(apiFetchPersinel, {
                params: {
                    pageNo: statusFilter.pageNo,
                    pageSize: statusFilter.pageSize,
                    status: statusFilter.status || '',
                    keyword: statusFilter.keyword || ''
                }
            }
        );

        console.log("response: ", response);

        return {
            data: response.data.data.content.sort((a, b) => b.status - a.status),
            currentPage: (response.data.data.number || 0) + 1,
            totalPages: response.data.data.totalPages || 1
        };

    } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu!", error);
        throw error;
    }
};

export const addPersonnel = async (newPersonnel) => {
    try {

        const formData = new FormData();
        formData.append('employeeDTO', new Blob([JSON.stringify(newPersonnel)], { type: 'application/json' }));
        formData.append('file', newPersonnel.image);

        try {
            const response = await axios.post(apiAddPersonel, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm bằng cấp!', error);
        }
    } catch (error) {
        console.error('Có lỗi xảy ra khi thêm nhân viên!', error);
        throw error;
    }
};

export const updatePersonnel = async (updatedPersonnel) => {
    try {
        const response = await axios.put(`${apiEndpoint}/${updatedPersonnel.id}`, updatedPersonnel);
        return response.data;
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật!', error);
        throw error;
    }
};

export const deletePersonnel = async (personnelId, personnelToUpdate) => {
    try {
        const response = await axios.put(`${apiEndpoint}/${personnelId}`, {
            ...personnelToUpdate,
            status: false
        });
        return response.data;
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật trạng thái nhân viên!', error);
        throw error;
    }
};
