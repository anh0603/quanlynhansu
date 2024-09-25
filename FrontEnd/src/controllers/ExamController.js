import {
  fetchAllExam,
  postCreateExam,
  putEditExam,
  deleteExam,
} from "../services/ExamService";
import { toast } from "react-toastify";

const getExams = async (
  searchExam,
  currentPage,
  perPage,
  setDataTable,
  setTotalPage,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await fetchAllExam();
    if (res) {
      let filteredData = res.filter((item) => item.status === false);
      console.log("Check Data: ", filteredData);
      let formattedData = filteredData.map((item, index) =>
        formatData(item, index)
      );
      if (searchExam) {
        formattedData = formattedData.filter((item) =>
          item.ma_mon.toLowerCase().includes(searchExam.toLowerCase())
        );
      }
      setTotalPage(Math.ceil(formattedData.length / perPage));
      setDataTable(formattedData);
    }
  } catch (error) {
    console.error("Error fetching exams:", error);
  } finally {
    setIsLoading(false);
  }
};

const formatData = (data, index) => {
  const {
    id,
    ma_mon,
    ma_lop,
    thoi_gian,
    link_bai_thi,
    createdAt,
    updatedAt,
    status,
  } = data;
  //   const formattedTime = new Date(thoi_gian * 1000).toLocaleDateString();
  return {
    STT: index + 1,
    id,
    ma_mon,
    ma_lop,
    thoi_gian,
    link_bai_thi: link_bai_thi || "N/A",
    createdAt,
    updatedAt,
    status,
  };
};

const handleCreateExam = async (formData, handleClose, getExams) => {
  try {
    await postCreateExam(
      formData.ma_mon,
      formData.ma_lop,
      new Date(formData.thoi_gian).getTime() / 1000,
      formData.link_bai_thi,
      new Date().toISOString(), // createdAt
      new Date().toISOString() // updatedAt
    );
    toast.success("Thêm mới lịch thi thành công!");
    handleClose();
    getExams();
  } catch (error) {
    toast.error("Đã xảy ra lỗi khi thêm mới lịch thi.");
  }
};

const handleEditExam = async (id, formData, handleClose, getExams) => {
  try {
    await putEditExam(
      id,
      formData.ma_mon,
      formData.ma_lop,
      new Date(formData.thoi_gian).getTime() / 1000,
      formData.link_bai_thi,
      new Date().toISOString()
    );
    toast.success("Chỉnh sửa lịch thi thành công!");
    handleClose();
    getExams();
  } catch (error) {
    toast.error("Đã xảy ra lỗi khi chỉnh sửa lịch thi.");
  }
};

const handleDeleteExam = async (id, getExams) => {
  try {
    await deleteExam(id);
    toast.success("Xóa lịch thi thành công!");
    getExams();
  } catch (error) {
    toast.error("Đã xảy ra lỗi khi xóa lịch thi.");
  }
};

export { getExams, handleCreateExam, handleEditExam, handleDeleteExam };
