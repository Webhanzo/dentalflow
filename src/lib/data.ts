

export let employees = [
  {
    employee_id: "EMP001",
    first_name: "عائشة",
    last_name: "خان",
    role: "dentist",
    salary: 2000,
    contact_info: { email: "aisha.khan@dentalflow.com", phone: "555-0101" },
    clinic_ids: ["C01"],
    avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP002",
    first_name: "بندر",
    last_name: "كارتر",
    role: "hygienist",
    salary: 1200,
    contact_info: { email: "ben.carter@dentalflow.com", phone: "555-0102" },
    clinic_ids: ["C01", "C02"],
     avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP003",
    first_name: "فاطمة",
    last_name: "الجميل",
    role: "receptionist",
    salary: 800,
    contact_info: { email: "fatima.aljamil@dentalflow.com", phone: "555-0103" },
    clinic_ids: ["C01"],
     avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP004",
    first_name: "ديفيد",
    last_name: "تشين",
    role: "admin",
    salary: 1500,
    contact_info: { email: "david.chen@dentalflow.com", phone: "555-0104" },
    clinic_ids: ["C01", "C02"],
     avatar: "https://placehold.co/100x100.png",
  },
];

type Employee = (typeof employees)[0];


export function addEmployee(employee: Employee) {
  employees = [...employees, employee];
  return employees;
}

export function updateEmployee(updatedEmployee: Employee) {
  employees = employees.map(e => e.employee_id === updatedEmployee.employee_id ? updatedEmployee : e);
  return employees;
}

export function deleteEmployee(employeeId: string) {
  employees = employees.filter(e => e.employee_id !== employeeId);
  return employees;
}

export let clients = [
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
      { payment_id: "PAY001", date: "2024-05-15", amount: 350, method: "بطاقة ائتمان", status: "paid" },
      { payment_id: "PAY002", date: "2024-01-20", amount: 50, method: "تأمين", status: "paid" },
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
      { payment_id: "PAY003", date: "2024-06-01", amount: 250, method: "بطاقة ائتمان", status: "pending" },
    ],
  },
];

type Client = (typeof clients)[0];

export function addClient(client: Client) {
  clients = [...clients, client];
  return clients;
}

export function updateClient(updatedClient: Client) {
    clients = clients.map(c => c.client_id === updatedClient.client_id ? updatedClient : c);
    return clients;
}

export function deleteClient(clientId: string) {
    clients = clients.filter(c => c.client_id !== clientId);
    return clients;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type Appointment = {
    appointment_id: string;
    client_id: string;
    dentist_id: string;
    date: string;
    time: string;
    procedure: string;
    status: AppointmentStatus;
};

export let appointments: Appointment[] = [
    {
        appointment_id: 'APP001',
        client_id: 'CLI001',
        dentist_id: 'EMP001',
        date: '2024-07-28',
        time: '10:00',
        procedure: 'فحص دوري',
        status: 'scheduled',
    },
    {
        appointment_id: 'APP002',
        client_id: 'CLI002',
        dentist_id: 'EMP001',
        date: '2024-07-28',
        time: '11:00',
        procedure: 'تنظيف',
        status: 'scheduled',
    },
];


export function addAppointment(appointment: Appointment) {
    appointments = [...appointments, appointment];
    return appointments;
}

export function updateAppointment(appointmentId: string, status: AppointmentStatus) {
    appointments = appointments.map(app => 
        app.appointment_id === appointmentId ? { ...app, status } : app
    );
    return appointments;
}

export type Income = {
    date: string;
    amount: number;
    source: string;
};

export type Expense = {
    date: string;
    amount: number;
    category: string;
};

let accountingData = {
  clinics: [
    {
      clinic_id: "C01",
      name: "عيادة الشارع الرئيسي",
      income: {
        total: 25000,
        by_date: [
          { date: "يناير 2024", amount: 4000, source: "علاجات" },
          { date: "فبراير 2024", amount: 5000, source: "علاجات" },
          { date: "مارس 2024", amount: 4500, source: "علاجات" },
          { date: "أبريل 2024", amount: 6000, source: "علاجات" },
          { date: "مايو 2024", amount: 5500, source: "علاجات" },
        ],
      },
      expenses: {
        total: 10000,
        by_date: [
          { date: "يناير 2024", amount: 1000, category: "إيجار" },
          { date: "فبراير 2024", amount: 1500, category: "مستلزمات" },
          { date: "مارس 2024", amount: 1000, category: "إيجار" },
          { date: "أبريل 2024", amount: 2000, category: "صيانة" },
          { date: "مايو 2024", amount: 1200, category: "خدمات" },
        ],
      },
    },
    {
      clinic_id: "C02",
      name: "عيادة الجانب الغربي",
      income: {
        total: 18000,
        by_date: [
          { date: "يناير 2024", amount: 3000, source: "علاجات" },
          { date: "فبراير 2024", amount: 3500, source: "علاجات" },
          { date: "مارس 2024", amount: 3200, source: "علاجات" },
          { date: "أبريل 2024", amount: 4000, source: "علاجات" },
          { date: "مايو 2024", amount: 4300, source: "علاجات" },
        ],
      },
      expenses: {
        total: 8000,
        by_date: [
          { date: "يناير 2024", amount: 800, category: "إيجار" },
          { date: "فبراير 2024", amount: 1200, category: "مستلزمات" },
          { date: "مارس 2024", amount: 800, category: "إيجار" },
          { date: "أبريل 2024", amount: 1500, category: "صيانة" },
          { date: "مايو 2024", amount: 1000, category: "خدمات" },
        ],
      },
    },
  ],
};

export let accounting = JSON.parse(JSON.stringify(accountingData));

export function addIncome(clinicId: string, income: Income) {
    const clinic = accounting.clinics.find(c => c.clinic_id === clinicId);
    if(clinic) {
        clinic.income.by_date.push(income);
        clinic.income.total += income.amount;
    }
    return JSON.parse(JSON.stringify(accounting));
}

export function addExpense(clinicId: string, expense: Expense) {
    const clinic = accounting.clinics.find(c => c.clinic_id === clinicId);
    if(clinic) {
        clinic.expenses.by_date.push(expense);
        clinic.expenses.total += expense.amount;
    }
    return JSON.parse(JSON.stringify(accounting));
}

    