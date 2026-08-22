import {
  User,
  Department,
  Doctor,
  DoctorSchedule,
  Appointment,
  Payment,
  HospitalInfo,
  NotificationItem,
  ContactMessage,
  AdminStats
} from '../types';

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('msh_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const responseText = await res.text();
  let data: any;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error(
      res.ok
        ? 'The server returned an invalid response.'
        : `Server error (${res.status}). Please try again.`
    );
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Network request failed');
  }
  return data;
}

export const api = {
  // Auth
  async register(data: any): Promise<{ message: string; token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async login(data: any): Promise<{ message: string; token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateProfile(data: any): Promise<{ message: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Hospital Info
  async getHospitalInfo(): Promise<{ hospital: HospitalInfo }> {
    const res = await fetch(`${API_BASE}/hospital`);
    return handleResponse(res);
  },

  async updateHospitalInfo(data: Partial<HospitalInfo>): Promise<{ message: string; hospital: HospitalInfo }> {
    const res = await fetch(`${API_BASE}/hospital`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Departments
  async getDepartments(status?: string): Promise<{ departments: Department[] }> {
    const url = status ? `${API_BASE}/departments?status=${status}` : `${API_BASE}/departments`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getDepartment(id: number): Promise<{ department: Department; doctors: Doctor[] }> {
    const res = await fetch(`${API_BASE}/departments/${id}`);
    return handleResponse(res);
  },

  async createDepartment(data: Partial<Department>): Promise<{ message: string; department: Department }> {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateDepartment(id: number, data: Partial<Department>): Promise<{ message: string; department: Department }> {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteDepartment(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Doctors
  async getDoctors(params?: {
    search?: string;
    department_id?: string | number;
    gender?: string;
    min_exp?: number;
    max_fee?: number;
    day?: string;
    status?: string;
  }): Promise<{ doctors: Doctor[] }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/doctors?${query.toString()}`);
    return handleResponse(res);
  },

  async getDoctor(id: number): Promise<{ doctor: Doctor }> {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    return handleResponse(res);
  },

  async createDoctor(data: Partial<Doctor>): Promise<{ message: string; doctor: Doctor }> {
    const res = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateDoctor(id: number, data: Partial<Doctor>): Promise<{ message: string; doctor: Doctor }> {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteDoctor(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Schedules
  async getSchedules(doctorId?: number): Promise<{ schedules: (DoctorSchedule & { doctor_name?: string; specialization?: string; room_number?: string; department_name?: string })[] }> {
    const url = doctorId ? `${API_BASE}/schedules?doctor_id=${doctorId}` : `${API_BASE}/schedules`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async createSchedule(data: Partial<DoctorSchedule>): Promise<{ message: string; schedule: DoctorSchedule }> {
    const res = await fetch(`${API_BASE}/schedules`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateSchedule(id: number, data: Partial<DoctorSchedule>): Promise<{ message: string; schedule: DoctorSchedule }> {
    const res = await fetch(`${API_BASE}/schedules/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteSchedule(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/schedules/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Appointments
  async getSlots(doctorId: number, date: string): Promise<{
    available: boolean;
    dayName: string;
    message?: string;
    schedule?: DoctorSchedule;
    totalSlots: number;
    bookedCount: number;
    slots: { time: string; isBooked: boolean }[];
  }> {
    const res = await fetch(`${API_BASE}/appointments/slots?doctor_id=${doctorId}&date=${date}`);
    return handleResponse(res);
  },

  async createAppointment(data: any): Promise<{ message: string; appointment: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getAppointments(filters?: any): Promise<{ appointments: Appointment[] }> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
    }
    const res = await fetch(`${API_BASE}/appointments?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getAppointment(id: number): Promise<{ appointment: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateAppointmentStatus(id: number, status: string, admin_notes?: string): Promise<{ message: string; appointment: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, admin_notes })
    });
    return handleResponse(res);
  },

  async cancelAppointment(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async rescheduleAppointment(id: number, date: string, time: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/reschedule`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date, time })
    });
    return handleResponse(res);
  },

  // Payments
  async getPayments(filters?: any): Promise<{ payments: Payment[] }> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
      });
    }
    const res = await fetch(`${API_BASE}/payments?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async verifyPayment(id: number, status: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/payments/${id}/verify`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async submitTrx(appointment_id: number, transaction_id: string, payment_method: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/payments/submit-trx`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ appointment_id, transaction_id, payment_method })
    });
    return handleResponse(res);
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async markNotificationRead(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async markAllNotificationsRead(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Contact
  async submitContact(data: any): Promise<{ message: string; messageId: number }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getContactMessages(): Promise<{ messages: ContactMessage[] }> {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateContactStatus(id: number, status: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/contact/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminStats(): Promise<{ stats: AdminStats }> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateAdminCredentials(data: {
    name?: string;
    currentPassword?: string;
    newEmail?: string;
    newPassword?: string;
    email?: string;
    password?: string;
  }): Promise<{ message: string; user: User; token: string }> {
    const res = await fetch(`${API_BASE}/admin/credentials`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  }
};
