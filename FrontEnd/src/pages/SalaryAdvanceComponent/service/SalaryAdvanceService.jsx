    import axios from "axios";

const API = "http://localhost:9002/hr/salaryAdvances";

export const fetchSalaryAdvance = async () => {
    try {
        const response = await axios.get(`${API}/getAllSalaryAdvance`);
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching !", error);
    }
}
    export const fetchSalaryAdvances = async (page = 0, size = 6) => {
        try {
            const response = await axios.get(`${API}/getAllSalaryAdvances`, {
                params: {page, size}
            });
            return response.data.data;
        } catch (error) {
            console.error("There was an error fetching salary advances!", error);
            throw error;
        }
    }
export const fetchSalaryAdvanceById = async (id) => {
    try {
        const response = await axios.get(`${API}/getSalaryAdvances/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching !", error);
    }
}
export const createSalaryAdvance = async (newSalaryAdvance) => {
    try {
        const response = await axios.post(`${API}/addSalaryAdvance`, newSalaryAdvance);
        return response.data;
    } catch (error) {
        console.log("There was an error creating!", error.response.data.message);
        throw error;
    }
};
export const updateSalaryAdvance = async (id, updateSalaryAdvance) => {
    try {
        const response = await axios.post(`${API}/updateSalaryAdvance/${id}`, updateSalaryAdvance);
        return response.data;
    } catch (error) {
        console.error("There was an error updating!", error.response.data.message);
    }

};
export const deleteSalaryAdvance = async (id) => {
    try {
        await axios.delete(`${API}/deleteSalaryAdvance/${id}`);
    } catch (error) {
        console.error("There was an error deleting ", error.response.data.message);
        throw error;
    }
};
