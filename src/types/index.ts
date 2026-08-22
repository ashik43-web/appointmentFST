export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  address?: string;
  role: 'patient' | 'admin' | 'superadmin' | 'staff';
  created_at?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface DoctorSchedule {
  id: number;
  doctor_id: number;
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  start_time: string;
  end_time: string;
  slot_duration: number;
  max_patients: number;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface Doctor {
  id: number;
  name: string;
  photo: string;
  qualification: string;
  specialization: string;
  department_id: number;
  department_name?: string;
  department_code?: string;
  experience: number;
  gender: 'Male' | 'Female' | 'Other';
  biography: string;
  consultation_fee: number;
  phone?: string;
  email?: string;
  room_number: string;
  status: 'active' | 'inactive';
  schedules?: DoctorSchedule[];
  created_at?: string;
}

export interface Appointment {
  id: number;
  appointment_number: string;
  user_id?: number;
  doctor_id: number;
  doctor_name?: string;
  doctor_photo?: string;
  specialization?: string;
  qualification?: string;
  department_name?: string;
  department_code?: string;
  room_number?: string;
  consultation_fee?: number;
  date: string;
  time: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  patient_age: number;
  patient_gender: 'Male' | 'Female' | 'Other';
  patient_address?: string;
  reason: string;
  notes?: string;
  admin_notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_id?: number;
  payment_method?: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'card';
  transaction_id?: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  amount?: number;
  created_at?: string;
}

export interface Payment {
  id: number;
  appointment_id: number;
  user_id?: number;
  amount: number;
  payment_method: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'card';
  transaction_id?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_date: string;
  verified_by?: string;
  appointment_number?: string;
  patient_name?: string;
  patient_phone?: string;
  appointment_date?: string;
  doctor_name?: string;
  department_name?: string;
}

export interface HospitalInfo {
  id: number;
  hospital_name: string;
  address: string;
  phone: string;
  email: string;
  emergency_phone: string;
  ambulance_phone: string;
  opd_hours: string;
  visiting_hours: string;
  about: string;
  mission: string;
  vision: string;
  facilities: string[];
  services: string[];
  emergency_services: string[];
  updated_at?: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  appointment_id?: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  status: 'unread' | 'read';
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  activeDoctors: number;
  totalDepartments: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  pendingRevenue: number;
  paymentMethods: { payment_method: string; count: number; total: number }[];
  departmentStats: { name: string; appointment_count: number }[];
  recentAppointments: Appointment[];
}
