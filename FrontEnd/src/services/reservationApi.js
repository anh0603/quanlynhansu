// reservationApi.js
import axios from "axios";

const API_URL = "https://66ac93a1f009b9d5c7329ca9.mockapi.io/api/hocvien";

export const reservationApi = {
  getReservationList() {
    return axios.get(API_URL);
  },

  deleteReservation(id) {
    return axios.delete(`${API_URL}/${id}`);
  },
};
