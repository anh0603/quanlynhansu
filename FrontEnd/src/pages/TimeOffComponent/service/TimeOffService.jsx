    import axios from "axios";

const API = "http://localhost:9002/hr/timeOff";

export const fetchTimeOff = async () => {
    try {
        const response = await axios.get(`${API}/getTimeOff`);
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching !", error);
    }
}
export const fetchTimeOffById = async (id) => {
    try {
        const response = await axios.get(`${API}/getTimeOff/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching !", error);
    }
}
export const createTimeOff = async (newSalaryAdvance) => {
    try {
        const response = await axios.post(`${API}/addTimeOff`, newSalaryAdvance);
        return response.data;
    } catch (error) {
        console.log("There was an error creating!", error.response.data.message);
        throw error;
    }
};
export const updateTimeOff = async (id, updateSalaryAdvance) => {
    try {
        const response = await axios.post(`${API}/updateTimeOff/${id}`, updateSalaryAdvance);
        return response.data;
    } catch (error) {
        console.error("There was an error updating!", error.response.data.message);
    }

};
export const deleteTimeOff = async (id) => {
    try {
        await axios.delete(`${API}/deleteTimeOff/${id}`);
    } catch (error) {
        console.error("There was an error deleting ", error.response.data.message);
        throw error;
    }
};
