import {
  BookComponent,
  ContractComponents,
  CourseComponent,
  DecisionComponent,
  DepartmentComponent,
  LiabilityComponents,
  PersonelComponents,
  QualificationComponents,
  ScheduleComponent3,
  SubjectComponent,
  UserComponent,
  AllowanceComponents,
  ClassComponent,
  ExamComponent,
  PositionComponents, TrainningProgramComponent,
} from "../pages";
import OvertimeComponent from "../pages/OvertimeComponent";
import SalaryAdvanceComponent from "../pages/SalaryAdvanceComponent";
import TimeOffComponent from "../pages/TimeOffComponent";

export const routeSideBar = [
  {
    name: "Dashboard",
    icon: "nav-icon fas fa-tachometer-alt",
    component: UserComponent,
    to: "/",
    child: [],
  },

  {
    name: "Form",
    icon: "nav-icon fas fa-edit",
    to: "/form",
    child: [
      {
        name: "List",
        icon: "nav-icon fas fa-tachometer-alt",
        to: "/list",
        component: UserComponent,
      },
    ],
  },
  {
    name: "Personnel",
    icon: "nav-icon fas fa-user-friends ",
    to: "/personal",
    child: [
      {
        name: "Quản lí nhân sự",
        icon: "nav-icon fas fa-solid fa-user",
        to: "/personnelList",
        component: PersonelComponents,
        child: [],
      },
      {
        name: "Quản lí hợp đồng",
        icon: "nav-icon fas fa-file-contract",
        to: "/contracts",
        component: ContractComponents,
        child: [],
      },
      {
        name: "Quản lý phụ cấp",
        icon: "nav-icon fas fa-file-contract",
        to: "/allowances",
        component: AllowanceComponents,
        child: [],
      },
      {
        name: "Quán lý bằng cấp",
        icon: "nav-icon fas fa-file-contract",
        to: "/qualifications",
        component: QualificationComponents,
        child: [],
      },
      {
        name: "Quản lí chức vụ",
        icon: "nav-icon fas fa-file-contract",
        to: "/positions",
        component: PositionComponents,
        child: [],
      },
      {
        name: "Quản lý phòng ban",
        icon: "nav-icon fas fa-building",
        to: "/departments",
        component: DepartmentComponent,
        child: [],
      },
      {
        name: "Khen thưởng - Kỷ luật",
        icon: "nav-icon fas fa-file-contract",
        to: "/decisions",
        component: DecisionComponent,
        child: [],
      },
      {
        name: "Quản lý chấm công",
        icon: "nav-icon fas fa-calendar-check",
        to: "/checkins",
        component: "",
        child: [],
      },
      {
        name: "Quản lý tăng ca",
        icon: "nav-icon fas fa-business-time",
        to: "/overtimes",
        component: OvertimeComponent,
        child: [],
      },
      {
        name: "Quản lý tạm ứng",
        icon: "nav-icon fas fa-credit-card",
        to: "/salaryAdvance",
        component: SalaryAdvanceComponent,
        child: [],
      },
      {
        name: "Quản lý nghỉ phép",
        icon: "nav-icon fas fa-calendar",
        to: "/timeOff",
        component: TimeOffComponent,
        child: [],
      },
    ],
  },

  {
    name: "Education",
    icon: "nav-icon fas fa-book",
    to: "/education",
    child: [
      {
        name: "Quản lý học viên",
        icon: "nav-icon fas fa-user",
        to: "/students",
        component: BookComponent,
      },
      {
        name: "Quản lý môn học",
        icon: "nav-icon fas fa-book",
        to: "/subjects",
        component: SubjectComponent,
      },
      {
        name: "Quản lý lớp",
        icon: "nav-icon fas fa-chalkboard-teacher",
        to: "/classes",
        component: ClassComponent,
      },
      {
        name: "Quản lý bảo lưu",
        icon: "nav-icon fas fa-pause-circle",
        to: "/reservations",
        component: BookComponent,
      },
      {
        name: "Quản lý thành viên lớp",
        icon: "nav-icon fas fa-users",
        to: "/class-members",
        component: BookComponent,
      },
      {
        name: "Quản lý chương trình đào tạo",
        icon: "nav-icon fas fa-cogs",
        to: "/programs",
        component: TrainningProgramComponent,
      },
      {
        name: "Quản lý điểm danh",
        icon: "nav-icon fas fa-calendar-check",
        to: "/attendance",
        component: BookComponent,
      },
      {
        name: "Quản lý khoá học",
        icon: "nav-icon fas fa-clipboard-list",
        component: CourseComponent,
        to: "/courses",
      },
      {
        name: "Quản lý lịch học",
        icon: "nav-icon fas fa-calendar-alt",
        to: "/schedules",
        component: ScheduleComponent3,
      },
      {
        name: "Quản lý lịch thi",
        icon: "nav-icon fas fa-calendar-plus",
        to: "/exams",
        component: ExamComponent,
      },
      {
        name: "Quản lý điểm số",
        icon: "nav-icon fas fa-chart-line",
        to: "/grades",
        component: BookComponent,
      },
    ],
  },
  {
    name: "Sales",
    icon: "nav-icon fas fa-dollar-sign",
    to: "/sale",
    child: [
      {
        name: "Quản lý học phí",
        icon: "nav-icon fas fa-money-bill-wave",
        to: "/tuitionfee",
        // component: TuitionFeeComponent,
      },
      {
        name: "Chến dịch quảng cáo",
        icon: "nav-icon fas fa-money-bill-wave", // Use the appropriate icon for your marketing campaign
        to: "/marketing-campaigns", // Define the route for the new component
        // component: MarketingCampaignComponent, // Add your new component here
      },
    ],
  },
  {
    name: "Liability",
    icon: "nav-icon fas fa-edit",
    to: "/liability",
    child: [
      {
        name: "Quản lí công nợ",
        icon: "nav-icon fas fa-user-friends",
        to: "/liabilityList",
        component: LiabilityComponents,
        child: [],
      },
    ],
  },
];



// export const routeSideBar = [
//     {
//         name: "Dashboard",
//         icon: "nav-icon fas fa-edit",
//         to: "#",
//         child: [],
//     },
//     {
//         name: "Form",
//         icon: "nav-icon fas fa-edit",
//         to: "#",
//         child: [
//             {
//                 name: "List",
//                 icon: "nav-icon fas fa-tachometer-alt",
//                 to: "/list",
//                 component: UserComponent,
//                 child: [],
//             },
//         ],
//     },
//     {
//         name: "Personnel",
//         icon: "nav-icon fas fa-edit",
//         to: "#",
//         child: [
//             {
//                 name: "Personnel-List",
//                 icon: "nav-icon fas fa-user-friends",
//                 to: "/personnelList",
//                 component: PersonelComponents,
//                 child: [],
//             },
//             {
//                 name: "Contract-List",
//                 icon: "nav-icon fas fa-file-contract",
//                 to: "/contracts",
//                 component: ContractComponents,
//                 child: [],
//             },
//             {
//                 name: "Allowance-List",
//                 icon: "nav-icon fas fa-file-contract",
//                 to: "/allowances",
//                 component: BookComponent,
//                 child: [],
//             },
//             {
//                 name: "Qualification-List",
//                 icon: "nav-icon fas fa-file-contract",
//                 to: "/qualifications",
//                 component: QualificationComponents,
//                 child: [],
//             },
//             {
//                 name: "Department-List",
//                 icon: "nav-icon fas fa-file-contract",
//                 to: "/departments",
//                 component: DepartmentComponent,
//                 child: [],
//             },
//             {
//                 name: "Decision-List",
//                 icon: "nav-icon fas fa-file-contract",
//                 to: "/decisions",
//                 component: DecisionComponent,
//                 child: [],
//             },
//         ],
//     },
//     {
//         name: "Education",
//         icon: "nav-icon fas fa-book",
//         to: "#",
//         child: [
//             {
//                 name: "Quản lý học viên",
//                 icon: "nav-icon fas fa-user",
//                 to: "/students",
//                 component: BookComponent,
//             },
//             {
//                 name: "Quản lý môn học",
//                 icon: "nav-icon fas fa-book",
//                 to: "/subjects",
//                 component: SubjectComponent,
//             },
//             {
//                 name: "Quản lý lớp",
//                 icon: "nav-icon fas fa-chalkboard-teacher",
//                 to: "/classes",
//                 component: ClassComponent,
//             },
//             {
//                 name: "Quản lý bảo lưu",
//                 icon: "nav-icon fas fa-pause-circle",
//                 to: "/reservations",
//                 component: ReservationComponent,
//             },
//             {
//                 name: "Quản lý thành viên lớp",
//                 icon: "nav-icon fas fa-users",
//                 to: "/class-members",
//                 component: BookComponent,
//             },
//             {
//                 name: "Quản lý chương trình đào tạo",
//                 icon: "nav-icon fas fa-cogs",
//                 to: "/programs",
//                 component: TrainningProgramComponent,
//             },
//             {
//                 name: "Quản lý điểm danh",
//                 icon: "nav-icon fas fa-calendar-check",
//                 to: "/attendance",
//                 component: BookComponent,
//             },
//             {
//                 name: "Quản lý khoá học",
//                 icon: "nav-icon fas fa-clipboard-list",
//                 to: "/courses",
//                 component: CourseComponent,
//             },
//             {
//                 name: "Quản lý lịch học",
//                 icon: "nav-icon fas fa-calendar-alt",
//                 to: "/schedules",
//                 component: ScheduleComponent3,
//             },
//             {
//                 name: "Quản lý lịch thi",
//                 icon: "nav-icon fas fa-calendar-plus",
//                 to: "/exams",
//                 component: ExamComponent,
//             },
//             {
//                 name: "Quản lý điểm số",
//                 icon: "nav-icon fas fa-chart-line",
//                 to: "/grades",
//                 component: BookComponent,
//             },
//         ],
//     },
//     {
//         name: "Liability",
//         icon: "nav-icon fas fa-edit",
//         to: "#",
//         child: [
//             {
//                 name: "Liability-List",
//                 icon: "nav-icon fas fa-user-friends",
//                 to: "/liabilityList",
//                 component: LiabilityComponents,
//                 child: [],
//             },
//         ],
//     },
// ];

