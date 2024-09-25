//
import axios from "axios";

const API_LIABILITY = "https://66b2f5cb7fba54a5b7eaec0b.mockapi.io/list_debt";
const API_OPTION = "https://66b2f5cb7fba54a5b7eaec0b.mockapi.io/options";

export const fetch_ListLiability = async () => {
    try {
        const response = await axios.get(API_LIABILITY);
        return response.data;
    } catch (e) {
        console.log("error", e);
    }
}
export const get_LiabilityById = async (id) => {
    try {
        const response = await axios.get(`${API_LIABILITY}/${id}`);
        return response.data;
    } catch (e) {
        console.log("error", e);
    }
}
export const add_Liability = async (newLiability) => {
    try {
        const response = await axios.post(API_LIABILITY, newLiability);
        return response.data;

    } catch (error) {
        console.log("error", error);
    }
}
export const update_Liability = async (id, update_Liability) => {
    try {
        const response = await axios.put(`${API_LIABILITY}/${id}`, update_Liability);
        return response.data;
    } catch (err) {
        console.log("error", err);
    }
}
export const delete_Liability = async (id) => {
    try {
        await axios.delete(`${API_LIABILITY}/${id}`);
    } catch (e) {
        console.log("error", e);
    }
}

export const fetch_option_Liability = async () => {
    try {
        const response = await axios.get(API_OPTION);
        return response.data;
    } catch (error) {
        console.log("error",error)
    }
}