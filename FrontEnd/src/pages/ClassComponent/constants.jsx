export const getConfigInput = (mode) => [
  {
    label: "Tên chương trình đào tạo",
    placeholder: "Nhập tên chương trình đào tạo",
    type: "text",
    name: "trProgramName",
  },
  {
    label: "Tên lớp",
    placeholder: "Nhập tên lớp",
    type: "text",
    name: "name",
  },
  {
    label: "Sĩ số",
    placeholder: "Nhập sĩ số",
    disabled: mode,
    type: "text",
    name: "size",
  },
  {
    label: "Ngày bắt đầu",
    placeholder: "",
    disabled: mode,
    type: "date",
    name: "startDate",
  },
  {
    label: "Ngày kết thúc",
    placeholder: "",
    type: "date",
    name: "endDate",
  },
];

// export const columns = [
//   {
//     key: "ma_lop",
//     label: "Mã lớp",
//   },
//   {
//     key: "ma_ctdt",
//     label: "Mã chương trình đào tạo",
//   },
//   {
//     key: "ten_lop",
//     label: "Tên lớp",
//   },
//   {
//     key: "si_so",
//     label: "Sĩ số",
//   },
//   {
//     key: "ngay_bat_dau",
//     label: "Ngày bắt đầu",
//   },
//   {
//     key: "ngay_ket_thuc",
//     label: "Ngày kết thúc",
//   },
// ];

export const classListTableCols = [
  {
    key: "trProgramName",
    label: "Tên chương trình đào tạo",
  },
  {
    key: "name",
    label: "Tên lớp",
  },
  {
    key: "size",
    label: "Sĩ số",
  },
  {
    key: "startDate",
    label: "Ngày bắt đầu",
  },
  {
    key: "endDate",
    label: "Ngày kết thúc",
  },
];

export const studentListByClassIdCols = [
  {
    key: "name",
    label: "Tên học viên",
  },
  {
    key: "status",
    label: "Trạng thái",
  },
];
