
export type Clinic = {
    clinic_id: string;
    name: string;
};

export type Employee = {
    employee_id: string;
    first_name: string;
    last_name: string;
    role: "dentist" | "hygienist" | "receptionist" | "admin";
    salary: number;
    contact_info: {
        email: string;
        phone: string;
    };
    clinic_ids: string[];
    avatar: string;
};

export type Client = {
    client_id: string;
    first_name: string;
    last_name: string;
    contact_info: {
        email: string;
        phone: string;
        address: string;
    };
    last_visit: string;
    treatment_history: {
        date: string;
        procedure: string;
        dentist_id: string;
        notes: string;
    }[];
    payment_details: {
        payment_id: string;
        date: string;
        amount: number;
        method: string;
        status: "paid" | "pending";
    }[];
    clinic_id: string;
};

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type Appointment = {
    appointment_id: string;
    client_id: string;
    dentist_id: string;
    date: string;
    time: string;
    procedure: string;
    status: AppointmentStatus;
    clinic_id: string;
};

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

export type Accounting = {
    clinic_id: string;
    income: {
        total: number;
        by_date: Income[];
    };
    expenses: {
        total: number;
        by_date: Expense[];
    };
    financials: {
        assets: {
            cash: number;
            accounts_receivable: number;
            equipment: number;
        };
        liabilities: {
            accounts_payable: number;
        };
        equity: {
            owner_investment: number;
        };
    };
};

export type Lab = {
    lab_id: string;
    name: string;
    phone: string;
};

export type LabCaseStatus = 'sent' | 'in_progress' | 'completed' | 'received';
export type LabCase = {
    case_id: string;
    lab_id: string;
    client_name: string;
    date_sent: string;
    date_due: string;
    notes: string;
    status: LabCaseStatus;
    clinic_id: string;
};


let clinics: Clinic[] = [
    { clinic_id: "C01", name: "عيادة الشارع الرئيسي" },
    { clinic_id: "C02", name: "عيادة الجانب الغربي" },
];

let employees: Employee[] = [
  {
    employee_id: "EMP001",
    first_name: "عائشة",
    last_name: "خان",
    role: "dentist",
    salary: 2000,
    contact_info: { email: "aisha.khan@dentalflow.com", phone: "0791234567" },
    clinic_ids: ["C01"],
    avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP002",
    first_name: "بندر",
    last_name: "كارتر",
    role: "hygienist",
    salary: 1200,
    contact_info: { email: "ben.carter@dentalflow.com", phone: "0781234567" },
    clinic_ids: ["C01", "C02"],
     avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP003",
    first_name: "فاطمة",
    last_name: "الجميل",
    role: "receptionist",
    salary: 800,
    contact_info: { email: "fatima.aljamil@dentalflow.com", phone: "0771234567" },
    clinic_ids: ["C01"],
     avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP004",
    first_name: "ديفيد",
    last_name: "تشين",
    role: "admin",
    salary: 1500,
    contact_info: { email: "david.chen@dentalflow.com", phone: "0761234567" },
    clinic_ids: ["C01", "C02"],
     avatar: "https://placehold.co/100x100.png",
  },
];

let clients: Client[] = [
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
    clinic_id: "C01",
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
    clinic_id: "C02"
  },
];

let appointments: Appointment[] = [
    {
        appointment_id: 'APP001',
        client_id: 'CLI001',
        dentist_id: 'EMP001',
        date: '2024-07-28',
        time: '10:00',
        procedure: 'فحص دوري',
        status: 'scheduled',
        clinic_id: 'C01',
    },
    {
        appointment_id: 'APP002',
        client_id: 'CLI002',
        dentist_id: 'EMP001',
        date: '2024-07-28',
        time: '11:00',
        procedure: 'تنظيف',
        status: 'scheduled',
        clinic_id: 'C02',
    },
];

let accounting: Accounting[] = [
    {
      clinic_id: "C01",
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
       financials: {
        assets: {
          cash: 15000,
          accounts_receivable: 0,
          equipment: 5000,
        },
        liabilities: {
          accounts_payable: 500, // For supplies
        },
        equity: {
          owner_investment: 20000,
        }
      }
    },
    {
      clinic_id: "C02",
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
      financials: {
        assets: {
          cash: 10000,
          accounts_receivable: 250,
          equipment: 3000,
        },
        liabilities: {
          accounts_payable: 300,
        },
        equity: {
          owner_investment: 15000,
        }
      }
    },
];

let labs: Lab[] = [
    { lab_id: "LAB01", name: "مختبر الدقة للأسنان", phone: "061234567" },
    { lab_id: "LAB02", name: "مختبر المدينة للتركيبات", phone: "067654321" },
];

let labCases: LabCase[] = [
    { case_id: "CASE001", lab_id: "LAB01", client_name: "جون دو", date_sent: "2024-07-15", date_due: "2024-07-25", status: "in_progress", notes: "طبعة جسر بورسلين للأسنان العلوية.", clinic_id: "C01" },
    { case_id: "CASE002", lab_id: "LAB02", client_name: "جين سميث", date_sent: "2024-07-18", date_due: "2024-07-28", status: "sent", notes: "تاج زركونيوم للسن رقم 14.", clinic_id: "C02"},
];

let masterData = {
    clinics,
    employees,
    clients,
    appointments,
    accounting,
    labs,
    labCases,
};

function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// --- Clinic Management ---
export function getClinics() {
    return deepClone(masterData.clinics);
}

export function addClinic(name: string) {
    const newIdNumber = masterData.clinics.reduce((max, c) => Math.max(max, parseInt(c.clinic_id.replace('C', ''))), 0) + 1;
    const newId = `C${String(newIdNumber).padStart(2, '0')}`;
    const newClinic: Clinic = { clinic_id: newId, name };
    masterData.clinics.push(newClinic);
    // Add default accounting data for the new clinic
    masterData.accounting.push({
        clinic_id: newId,
        income: { total: 0, by_date: [] },
        expenses: { total: 0, by_date: [] },
        financials: {
            assets: { cash: 0, accounts_receivable: 0, equipment: 0 },
            liabilities: { accounts_payable: 0 },
            equity: { owner_investment: 0 },
        }
    });
    return deepClone(masterData.clinics);
}

export function updateClinic(updatedClinic: Clinic) {
    masterData.clinics = masterData.clinics.map(c => c.clinic_id === updatedClinic.clinic_id ? updatedClinic : c);
    return deepClone(masterData.clinics);
}


export function deleteClinic(clinicId: string) {
    masterData.clinics = masterData.clinics.filter(c => c.clinic_id !== clinicId);
    masterData.employees = masterData.employees.map(e => ({
        ...e,
        clinic_ids: e.clinic_ids.filter(id => id !== clinicId),
    }));
    // Note: We don't filter out employees with no clinics, they just become unassigned.
    masterData.clients = masterData.clients.filter(c => c.clinic_id !== clinicId);
    masterData.appointments = masterData.appointments.filter(a => a.clinic_id !== clinicId);
    masterData.accounting = masterData.accounting.filter(acc => acc.clinic_id !== clinicId);
    return deepClone(masterData.clinics);
}

// --- Data Fetching by Clinic ---
export function getDashboardData(clinicId: string) {
    const clinicAccounting = masterData.accounting.find(a => a.clinic_id === clinicId);
    const clinicClients = masterData.clients.filter(c => c.clinic_id === clinicId);
    const clinicAppointments = masterData.appointments.filter(a => a.clinic_id === clinicId);

    return deepClone({
        accounting: clinicAccounting,
        clients: clinicClients,
        appointments: clinicAppointments,
        employees: masterData.employees.filter(e => e.clinic_ids.includes(clinicId)),
    });
}

export function getEmployees(clinicId?: string) {
    if (clinicId) {
        return deepClone(masterData.employees.filter(e => e.clinic_ids.includes(clinicId)));
    }
    return deepClone(masterData.employees);
}

export function getAllClients() {
    return deepClone(masterData.clients);
}

export function getClients(clinicId: string) {
    return deepClone(masterData.clients.filter(c => c.clinic_id === clinicId));
}

export function getAppointments(clinicId: string) {
    return deepClone(masterData.appointments.filter(a => a.clinic_id === clinicId));
}

export function getAccounting(clinicId?: string) {
     if (clinicId) {
        return deepClone(masterData.accounting.find(a => a.clinic_id === clinicId));
    }
    return deepClone(masterData.accounting);
}


// --- Employee Management ---
export function addEmployee(employee: Employee) {
  masterData.employees.push(employee);
  return getEmployees();
}

export function updateEmployee(updatedEmployee: Employee) {
  masterData.employees = masterData.employees.map(e => e.employee_id === updatedEmployee.employee_id ? updatedEmployee : e);
  return getEmployees();
}

export function deleteEmployee(employeeId: string) {
  masterData.employees = masterData.employees.filter(e => e.employee_id !== employeeId);
  return getEmployees();
}

// --- Client Management ---
export function addClient(client: Client) {
  const allClients = masterData.clients;
  const maxId = allClients.reduce((max, c) => {
      const idNum = parseInt(c.client_id.replace('CLI', ''));
      return idNum > max ? idNum : max;
  }, 0);
  const newIdNumber = maxId + 1;
  client.client_id = `CLI${String(newIdNumber).padStart(3, '0')}`;
  
  masterData.clients.push(client);
  return getClients(client.clinic_id);
}

export function updateClient(updatedClient: Client) {
    masterData.clients = masterData.clients.map(c => c.client_id === updatedClient.client_id ? updatedClient : c);
    return getClients(updatedClient.clinic_id);
}

export function deleteClient(clientId: string) {
    const client = masterData.clients.find(c => c.client_id === clientId);
    if(client){
        masterData.clients = masterData.clients.filter(c => c.client_id !== clientId);
        return getClients(client.clinic_id);
    }
    return [];
}


// --- Appointment Management ---
export function addAppointment(appointment: Appointment) {
    masterData.appointments.push(appointment);
    return getAppointments(appointment.clinic_id);
}

export function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    let clinicId = '';
    masterData.appointments = masterData.appointments.map(app => {
        if (app.appointment_id === appointmentId) {
            clinicId = app.clinic_id;
            return { ...app, status };
        }
        return app;
    });
    return getAppointments(clinicId);
}

// --- Accounting Management ---
export function addIncome(clinicId: string, income: Income) {
    const clinicAcc = masterData.accounting.find(c => c.clinic_id === clinicId);
    if(clinicAcc) {
        clinicAcc.income.by_date.push(income);
        clinicAcc.income.total += income.amount;
    }
    return getAccounting(clinicId);
}

export function addExpense(clinicId: string, expense: Expense) {
    const clinicAcc = masterData.accounting.find(c => c.clinic_id === clinicId);
    if(clinicAcc) {
        clinicAcc.expenses.by_date.push(expense);
        clinicAcc.expenses.total += expense.amount;
    }
    return getAccounting(clinicId);
}

// --- Lab Management ---
export function getLabs() {
    return deepClone(masterData.labs);
}

export function addLab(lab: Omit<Lab, 'lab_id'>) {
    const newId = `LAB${String(masterData.labs.length + 1).padStart(2, '0')}`;
    masterData.labs.push({ ...lab, lab_id: newId });
    return deepClone(masterData.labs);
}

export function updateLab(updatedLab: Lab) {
    masterData.labs = masterData.labs.map(l => l.lab_id === updatedLab.lab_id ? updatedLab : l);
    return deepClone(masterData.labs);
}

export function deleteLab(labId: string) {
    masterData.labs = masterData.labs.filter(l => l.lab_id !== labId);
    masterData.labCases = masterData.labCases.filter(c => c.lab_id !== labId);
    return deepClone(masterData.labs);
}

export function getLabCases(clinicId?: string) {
    if (clinicId) {
        return deepClone(masterData.labCases.filter(c => c.clinic_id === clinicId));
    }
    return deepClone(masterData.labCases);
}

export function addLabCase(labCase: Omit<LabCase, 'case_id'>) {
    const newId = `CASE${String(masterData.labCases.length + 1).padStart(3, '0')}`;
    masterData.labCases.push({ ...labCase, case_id: newId });
    return deepClone(masterData.labCases);
}

export function updateLabCase(updatedCase: Omit<LabCase, 'case_id'> | LabCase) {
    if ('case_id' in updatedCase) {
        masterData.labCases = masterData.labCases.map(c => c.case_id === updatedCase.case_id ? updatedCase : c);
    } else {
         const newId = `CASE${String(masterData.labCases.length + 1).padStart(3, '0')}`;
         masterData.labCases.push({ ...updatedCase, case_id: newId });
    }
    return deepClone(masterData.labCases);
}

