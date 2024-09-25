export const getConfigInput = (mode) => [
  {
    label: "Mã học viên",
    placeholder: "Nhập mã học viên",
    disabled: mode,
    type: "text",
  },
  {
    label: "Thời gian bắt đầu",
    disabled: mode,
    type: "date",
  },
  {
    label: "Thời gian kết thúc",
    disabled: mode,
    type: "date",
  },
  {
    label: "Mã môn học",
    placeholder: "Nhập mã môn học",
    disabled: mode,
    type: "text",
  },
  {
    label: "Trạng thái",
    placeholder: "Nhập trạng thái",
    disabled: mode,
    type: "text",
  },
];

export const columns = [
  {
    key: "id",
    label: "STT",
  },

  {
    key: "id_hoc_vien",
    label: "Mã học viên",
  },
  {
    key: "thoi_gian_bat_dau",
    label: "thời gian bắt đầu",
  },
  {
    key: "ngay_ket_thuc",
    label: "thời gian kết thúc",
  },
  {
    key: "trang_thai",
    label: "Trạng thái",
  },
  {
    key: "id_ma_mon",
    label: "Mã môn học",
  },
];
