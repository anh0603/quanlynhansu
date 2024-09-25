import axios from "./customize-axios";

// Fetch all exams
const fetchAllExam = () => {
  return axios.get("/api/exam");
};

// Create a new exam
const postCreateExam = (ma_mon, ma_lop, thoi_gian, link_bai_thi) => {
  const createdAt = Math.floor(Date.now() / 1000);
  const updatedAt = Math.floor(Date.now() / 1000);
  return axios.post("api/exam", {
    ma_mon,
    ma_lop,
    thoi_gian,
    link_bai_thi,
    createdAt,
    updatedAt,
  });
};

// Update an exam
const putEditExam = (id, ma_mon, ma_lop, thoi_gian, link_bai_thi) => {
  const updatedAt = Math.floor(Date.now() / 1000);
  return axios.put(`api/exam/${id}`, {
    ma_mon,
    ma_lop,
    thoi_gian,
    link_bai_thi,
    updatedAt,
  });
};

// Delete an exam
const deleteExam = (id) => {
  const updatedAt = Math.floor(Date.now() / 1000);
  return axios.put(`api/exam/${id}`, {
    status: true,
    updatedAt,
  });
};

export { fetchAllExam, postCreateExam, putEditExam, deleteExam };
