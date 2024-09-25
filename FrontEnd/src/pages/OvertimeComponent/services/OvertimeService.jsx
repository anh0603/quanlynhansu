    import axios from "axios";

const API = "http://localhost:9002/hr/overtime";

export const fetchOvertimes = async () => {
    try {
        const response = await axios.get(`${API}/getAllOvertime`);
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching the overtimes!", error);
    }
}
export const fetchOvertimeById = async (id) => {
    try {
        const response = await axios.get(`${API}/getOvertimeById/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching the overtimes!", error);
    }
}
export const createOvertime = async (newOvertime) => {
    try {
        const response = await axios.post(`${API}/addOvertime`, newOvertime);
        return response.data;
    } catch (error) {
        console.log("There was an error creating the overtimes!", error.response.data.message);
        throw error;
    }
};
export const updateOvertime = async (id, updateOvertime) => {
    try {
        const response = await axios.post(`${API}/updateOvertime/${id}`, updateOvertime);
        return response.data;
    } catch (error) {
        console.error("There was an error updating the department!", error);
    }

};
export const deleteOvertime = async (id) => {
    try {
        await axios.delete(`${API}/deleteOvertime/${id}`);
    } catch (error) {
        console.error("There was an error deleting ", error.response.data.message);
        throw error;
    }
};
