export let employees = [
  {
    employee_id: "EMP001",
    first_name: "عائشة",
    last_name: "خان",
    role: "dentist",
    salary: 8000,
    contact_info: { email: "aisha.khan@dentalflow.com", phone: "555-0101" },
    clinic_ids: ["C01"],
    avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP002",
    first_name: "بندر",
    last_name: "كارتر",
    role: "hygienist",
    salary: 4500,
    contact_info: { email: "ben.carter@dentalflow.com", phone: "555-0102" },
    clinic_ids: ["C01", "C02"],
     avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP003",
    first_name: "فاطمة",
    last_name: "الجميل",
    role: "receptionist",
    salary: 3000,
    contact_info: { email: "fatima.aljamil@dentalflow.com", phone: "555-0103" },
    clinic_ids: ["C01"],
     avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP004",
    first_name: "ديفيد",
    last_name: "تشين",
    role: "admin",
    salary: 6000,
    contact_info: { email: "david.chen@dentalflow.com", phone: "555-0104" },
    clinic_ids: ["C01", "C02"],
     avatar: "https://placehold.co/100x100.png",
  },
];

type Employee = (typeof employees)[0];


export function addEmployee(employee: Employee) {
  employees.push(employee);
}

export function updateEmployee(updatedEmployee: Employee) {
  const index = employees.findIndex(e => e.employee_id === updatedEmployee.employee_id);
  if (index !== -1) {
    employees[index] = updatedEmployee;
  }
}

export function deleteEmployee(employeeId: string) {
  employees = employees.filter(e => e.employee_id !== employeeId);
}

export const clients = [
  {
    client_id: "CLI001",
    first_name: "جون",
    last_name: "دو",
    contact_info: { email: "john.doe@email.com", phone: "555-0201", address: "123 شارع القيقب" },
    last_visit: "2024-05-15",
    treatment_history: [
      { date: "2024-05-15", procedure: "علاج العصب", dentist_id: "EMP001", notes: "اكتمل بنجاح." },
      { date: "2024-01-20", procedure: "تنظيف", dentist_id: "EMP002", notes: "فحص دوري." },
    ],
    payment_details: [
      { payment_id: "PAY001", date: "2024-05-15", amount: 1200, method: "بطاقة ائتمان", status: "paid" },
      { payment_id: "PAY002", date: "2024-01-20", amount: 150, method: "تأمين", status: "paid" },
    ],
  },
  {
    client_id: "CLI002",
    first_name: "جين",
    last_name: "سميث",
    contact_info: { email: "jane.smith@email.com", phone: "555-0202", address: "456 شارع البلوط" },
    last_visit: "2024-06-01",
    treatment_history: [
      { date: "2024-06-01", procedure: "تركيب تاج", dentist_id: "EMP001", notes: "تم وضع تاج مؤقت." },
    ],
    payment_details: [
      { payment_id: "PAY003", date: "2024-06-01", amount: 800, method: "بطاقة ائتمان", status: "pending" },
    ],
  },
];

export const accounting = {
  clinics: [
    {
      clinic_id: "C01",
      name: "عيادة الشارع الرئيسي",
      income: {
        total: 75000,
        by_date: [
          { date: "يناير 2024", amount: 12000, source: "علاجات" },
          { date: "فبراير 2024", amount: 15000, source: "علاجات" },
          { date: "مارس 2024", amount: 13000, source: "علاجات" },
          { date: "أبريل 2024", amount: 18000, source: "علاجات" },
          { date: "مايو 2024", amount: 17000, source: "علاجات" },
        ],
      },
      expenses: {
        total: 25000,
        by_date: [
          { date: "يناير 2024", amount: 5000, category: "رواتب" },
          { date: "فبراير 2024", amount: 5500, category: "مستلزمات" },
          { date: "مارس 2024", amount: 4800, category: "إيجار" },
          { date: "أبريل 2024", amount: 6000, category: "رواتب" },
          { date: "مايو 2024", amount: 3700, category: "خدمات" },
        ],
      },
    },
    {
      clinic_id: "C02",
      name: "عيادة الجانب الغربي",
      income: {
        total: 55000,
        by_date: [
          { date: "يناير 2024", amount: 9000, source: "علاجات" },
          { date: "فبراير 2024", amount: 11000, source: "علاجات" },
          { date: "مارس 2024", amount: 10000, source: "علاجات" },
          { date: "أبريل 2024", amount: 13000, source: "علاجات" },
          { date: "مايو 2024", amount: 12000, source: "علاجات" },
        ],
      },
      expenses: {
        total: 20000,
        by_date: [
          { date: "يناير 2024", amount: 4000, category: "رواتب" },
          { date: "فبراير 2024", amount: 4500, category: "مستلزمات" },
          { date: "مارس 2024", amount: 3800, category: "إيجار" },
          { date: "أبريل 2024", amount: 4200, category: "رواتب" },
          { date: "مايو 2024", amount: 3500, category: "خدمات" },
        ],
      },
    },
  ],
};
