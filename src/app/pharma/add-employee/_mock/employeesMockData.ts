// Mock data for employees
export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "أحمد محمد علي",
    email: "ahmed.mohamed@pharmacy.com",
    phone: "01012345678",
    role: "صيدلي",
    roleId: 1,
    active: true,
    address: "القاهرة، مصر الجديدة",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "فاطمة حسن",
    email: "fatma.hassan@pharmacy.com",
    phone: "01023456789",
    role: "مساعد صيدلي",
    roleId: 2,
    active: true,
    address: "الجيزة، المهندسين",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    name: "محمود عبدالله",
    email: "mahmoud.abdullah@pharmacy.com",
    phone: "01034567890",
    role: "مدير المخزن",
    roleId: 3,
    active: true,
    address: "الإسكندرية، سموحة",
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    name: "نور الدين سعيد",
    email: "nour.saeed@pharmacy.com",
    phone: "01045678901",
    role: "محاسب",
    roleId: 4,
    active: false,
    address: "القاهرة، المعادي",
    createdAt: "2024-01-25",
  },
  {
    id: 5,
    name: "سارة أحمد",
    email: "sara.ahmed@pharmacy.com",
    phone: "01056789012",
    role: "صيدلي",
    roleId: 1,
    active: true,
    address: "القاهرة، التجمع الخامس",
    createdAt: "2024-04-05",
  },
  {
    id: 6,
    name: "خالد محمود",
    email: "khaled.mahmoud@pharmacy.com",
    phone: "01067890123",
    role: "مساعد صيدلي",
    roleId: 2,
    active: true,
    address: "الجيزة، الدقي",
    createdAt: "2024-03-15",
  },
];

// Mock actions
let employees = [...mockEmployees];
let nextId = 7;

export const mockEmployeeActions = {
  getAllEmployees: async (): Promise<{
    success: boolean;
    data: { data: Employee[] };
  }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: { data: [...employees] },
    };
  },

  addEmployee: async (
    data: CreateEmployeeParams
  ): Promise<{
    success: boolean;
    data?: Employee;
    error?: { message: string };
  }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate validation
    if (!data.name || !data.email || !data.phone) {
      return {
        success: false,
        error: { message: "جميع الحقول المطلوبة يجب ملؤها" },
      };
    }

    const newEmployee: Employee = {
      id: nextId++,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "صيدلي", // Default role
      roleId: data.roleId,
      active: data.active ?? true,
      address: data.address || "",
      createdAt: new Date().toISOString().split("T")[0],
    };

    employees.push(newEmployee);

    return {
      success: true,
      data: newEmployee,
    };
  },

  updateEmployee: async (data: {
    employeeId: number;
    payload: UpdateEmployeeParams;
  }): Promise<{
    success: boolean;
    data?: Employee;
    error?: { message: string };
  }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const index = employees.findIndex((emp) => emp.id === data.employeeId);

    if (index === -1) {
      return {
        success: false,
        error: { message: "الموظف غير موجود" },
      };
    }

    employees[index] = {
      ...employees[index],
      ...data.payload,
    };

    return {
      success: true,
      data: employees[index],
    };
  },

  deleteEmployees: async (data: {
    employeesId: number[];
  }): Promise<{ success: boolean; error?: { message: string } }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const initialLength = employees.length;
    employees = employees.filter((emp) => !data.employeesId.includes(emp.id));

    if (employees.length === initialLength) {
      return {
        success: false,
        error: { message: "لم يتم العثور على الموظفين المحددين" },
      };
    }

    return {
      success: true,
    };
  },

  // Reset mock data (useful for testing)
  resetMockData: () => {
    employees = [...mockEmployees];
    nextId = 7;
  },
};
