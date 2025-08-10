export const employees = [
  {
    employee_id: "EMP001",
    first_name: "Aisha",
    last_name: "Khan",
    role: "dentist",
    contact_info: { email: "aisha.khan@dentalflow.com", phone: "555-0101" },
    clinic_ids: ["C01"],
    avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP002",
    first_name: "Ben",
    last_name: "Carter",
    role: "hygienist",
    contact_info: { email: "ben.carter@dentalflow.com", phone: "555-0102" },
    clinic_ids: ["C01", "C02"],
     avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP003",
    first_name: "Fatima",
    last_name: "Al-Jamil",
    role: "receptionist",
    contact_info: { email: "fatima.aljamil@dentalflow.com", phone: "555-0103" },
    clinic_ids: ["C01"],
     avatar: "https://placehold.co/100x100.png",
  },
  {
    employee_id: "EMP004",
    first_name: "David",
    last_name: "Chen",
    role: "admin",
    contact_info: { email: "david.chen@dentalflow.com", phone: "555-0104" },
    clinic_ids: ["C01", "C02"],
     avatar: "https://placehold.co/100x100.png",
  },
];

export const clients = [
  {
    client_id: "CLI001",
    first_name: "John",
    last_name: "Doe",
    contact_info: { email: "john.doe@email.com", phone: "555-0201", address: "123 Maple St" },
    last_visit: "2024-05-15",
    treatment_history: [
      { date: "2024-05-15", procedure: "Root Canal", dentist_id: "EMP001", notes: "Completed successfully." },
      { date: "2024-01-20", procedure: "Cleaning", dentist_id: "EMP002", notes: "Regular check-up." },
    ],
    payment_details: [
      { payment_id: "PAY001", date: "2024-05-15", amount: 1200, method: "Credit Card", status: "paid" },
      { payment_id: "PAY002", date: "2024-01-20", amount: 150, method: "Insurance", status: "paid" },
    ],
  },
  {
    client_id: "CLI002",
    first_name: "Jane",
    last_name: "Smith",
    contact_info: { email: "jane.smith@email.com", phone: "555-0202", address: "456 Oak Ave" },
    last_visit: "2024-06-01",
    treatment_history: [
      { date: "2024-06-01", procedure: "Crown Fitting", dentist_id: "EMP001", notes: "Temporary crown placed." },
    ],
    payment_details: [
      { payment_id: "PAY003", date: "2024-06-01", amount: 800, method: "Credit Card", status: "pending" },
    ],
  },
];

export const accounting = {
  clinics: [
    {
      clinic_id: "C01",
      name: "Main St Dental",
      income: {
        total: 75000,
        by_date: [
          { date: "2024-01", amount: 12000, source: "Treatments" },
          { date: "2024-02", amount: 15000, source: "Treatments" },
          { date: "2024-03", amount: 13000, source: "Treatments" },
          { date: "2024-04", amount: 18000, source: "Treatments" },
          { date: "2024-05", amount: 17000, source: "Treatments" },
        ],
      },
      expenses: {
        total: 25000,
        by_date: [
          { date: "2024-01", amount: 5000, category: "Salaries" },
          { date: "2024-02", amount: 5500, category: "Supplies" },
          { date: "2024-03", amount: 4800, category: "Rent" },
          { date: "2024-04", amount: 6000, category: "Salaries" },
          { date: "2024-05", amount: 3700, category: "Utilities" },
        ],
      },
    },
    {
      clinic_id: "C02",
      name: "Westside Dental",
      income: {
        total: 55000,
        by_date: [
          { date: "2024-01", amount: 9000, source: "Treatments" },
          { date: "2024-02", amount: 11000, source: "Treatments" },
          { date: "2024-03", amount: 10000, source: "Treatments" },
          { date: "2024-04", amount: 13000, source: "Treatments" },
          { date: "2024-05", amount: 12000, source: "Treatments" },
        ],
      },
      expenses: {
        total: 20000,
        by_date: [
          { date: "2024-01", amount: 4000, category: "Salaries" },
          { date: "2024-02", amount: 4500, category: "Supplies" },
          { date: "2024-03", amount: 3800, category: "Rent" },
          { date: "2024-04", amount: 4200, category: "Salaries" },
          { date: "2024-05", amount: 3500, category: "Utilities" },
        ],
      },
    },
  ],
};
