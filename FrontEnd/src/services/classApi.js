import axios from "axios";
import API from "../store/Api";

export const classApi = {
  getClassList() {
    return axios.get("https://66ac7831f009b9d5c73229a5.mockapi.io/classes");
  },
  getStudentByIdClass(id) {
    return axios.get(
      `https://66ac7831f009b9d5c73229a5.mockapi.io/students/${id}`
    );
  },
};
