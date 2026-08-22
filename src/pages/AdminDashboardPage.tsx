import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHospital } from '../context/HospitalContext';
import { api } from '../services/api';
import {
  AdminStats,
  Appointment,
  Doctor,
  Department,
  DoctorSchedule,
  Payment,
  ContactMessage,
  HospitalInfo
} from '../types';
import { AppointmentReceiptModal } from '../components/AppointmentReceiptModal';
import {
  ShieldCheck,
  Users,
  Calendar,
  DollarSign,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CreditCard,
  Phone,
  Mail,
  Clock,
  RotateCcw,
  MessageSquare,
  FileText,
  Save,
  ChevronRight,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  ShieldAlert,
  Check
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'appointments'
  | 'doctors'
  | 'schedules'
  | 'departments'
  | 'hospital-info'
  | 'inquiries'
  | 'security';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    showToast,
    refreshHospitalData,
    departments: globalDepts,
    hospitalInfo: globalHospitalInfo
  } = useHospital();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [aptStatusFilter, setAptStatusFilter] = useState('all');
  const [aptSearch, setAptSearch] = useState('');
  const [receiptApt, setReceiptApt] = useState<Appointment | null>(null);

  // Doctors state
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docName, setDocName] = useState('');
  const [docQual, setDocQual] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docDeptId, setDocDeptId] = useState<number>(1);
  const [docExp, setDocExp] = useState<number>(5);
  const [docFee, setDocFee] = useState<number>(600);
  const [docRoom, setDocRoom] = useState('Room 201');
  const [docGender, setDocGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [docBio, setDocBio] = useState('');
  const [docPhoto, setDocPhoto] = useState('');

  // Schedules state
  const [schedulesList, setSchedulesList] = useState<any[]>([]);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schDoctorId, setSchDoctorId] = useState<number>(1);
  const [schDay, setSchDay] = useState<string>('Saturday');
  const [schStartTime, setSchStartTime] = useState('05:00 PM');
  const [schEndTime, setSchEndTime] = useState('08:30 PM');
  const [schDuration, setSchDuration] = useState(20);
  const [schMax, setSchMax] = useState(25);

  // Departments state
  const [deptList, setDeptList] = useState<Department[]>([]);
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  // Inquiries state
  const [inquiriesList, setInquiriesList] = useState<ContactMessage[]>([]);

  // Admin Credentials Update State
  const [adminName, setAdminName] = useState(user?.name || 'Hospital Administrator');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@madanpurhospital.com');
  const [adminCurrentPassword, setAdminCurrentPassword] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [credentialsSuccessMsg, setCredentialsSuccessMsg] = useState<string | null>(null);

  // Hospital Info Editor
  const [hName, setHName] = useState('');
  const [hAddress, setHAddress] = useState('');
  const [hPhone, setHPhone] = useState('');
  const [hEmail, setHEmail] = useState('');
  const [hEmergency, setHEmergency] = useState('');
  const [hAmbulance, setHAmbulance] = useState('');
  const [hOpd, setHOpd] = useState('');
  const [hVisiting, setHVisiting] = useState('');
  const [hMission, setHMission] = useState('');
  const [hVision, setHVision] = useState('');

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes, dRes, schRes, depRes, iRes, hRes] = await Promise.all([
        api.getAdminStats(),
        api.getAppointments(),
        api.getDoctors(),
        api.getSchedules(),
        api.getDepartments(),
        api.getContactMessages(),
        api.getHospitalInfo()
      ]);

      setStats(sRes.stats);
      setAppointments(aRes.appointments || []);
      setDoctorsList(dRes.doctors || []);
      setSchedulesList(schRes.schedules || []);
      setDeptList(depRes.departments || []);
      setInquiriesList(iRes.messages || []);

      if (hRes.hospital) {
        const h = hRes.hospital;
        setHName(h.hospital_name || '');
        setHAddress(h.address || '');
        setHPhone(h.phone || '');
        setHEmail(h.email || '');
        setHEmergency(h.emergency_phone || '');
        setHAmbulance(h.ambulance_phone || '');
        setHOpd(h.opd_hours || '');
        setHVisiting(h.visiting_hours || '');
        setHMission(h.mission || '');
        setHVision(h.vision || '');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load admin dataset', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Update Appointment Status
  const handleUpdateAppointmentStatus = async (id: number, status: string) => {
    try {
      await api.updateAppointmentStatus(id, status);
      showToast(`Appointment status updated to ${status}`, 'success');
      await loadAllAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Doctor CRUD
  const handleOpenDoctorModal = (doc?: Doctor) => {
    if (doc) {
      setEditingDoctor(doc);
      setDocName(doc.name);
      setDocQual(doc.qualification);
      setDocSpec(doc.specialization);
      setDocDeptId(doc.department_id);
      setDocExp(doc.experience);
      setDocFee(doc.consultation_fee);
      setDocRoom(doc.room_number);
      setDocGender(doc.gender);
      setDocBio(doc.biography || '');
      setDocPhoto(doc.photo || '');
    } else {
      setEditingDoctor(null);
      setDocName('');
      setDocQual('');
      setDocSpec('');
      setDocDeptId(deptList[0]?.id || 1);
      setDocExp(5);
      setDocFee(600);
      setDocRoom('Room 201');
      setDocGender('Male');
      setDocBio('');
      setDocPhoto('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80');
    }
    setDoctorModalOpen(true);
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: docName.trim(),
        qualification: docQual.trim(),
        specialization: docSpec.trim(),
        department_id: Number(docDeptId),
        experience: Number(docExp),
        consultation_fee: Number(docFee),
        room_number: docRoom.trim(),
        gender: docGender,
        biography: docBio.trim(),
        photo: docPhoto.trim()
      };

      if (editingDoctor) {
        await api.updateDoctor(editingDoctor.id, payload);
        showToast('Doctor record updated successfully', 'success');
      } else {
        await api.createDoctor(payload);
        showToast('New doctor added to hospital directory', 'success');
      }
      setDoctorModalOpen(false);
      await loadAllAdminData();
      await refreshHospitalData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save doctor', 'error');
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this doctor from the hospital system?')) return;
    try {
      await api.deleteDoctor(id);
      showToast('Doctor removed successfully', 'info');
      await loadAllAdminData();
      await refreshHospitalData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete doctor', 'error');
    }
  };

  // Schedule Save
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSchedule({
        doctor_id: Number(schDoctorId),
        day: schDay as any,
        start_time: schStartTime.trim(),
        end_time: schEndTime.trim(),
        slot_duration: Number(schDuration),
        max_patients: Number(schMax)
      });
      showToast('Schedule added successfully', 'success');
      setScheduleModalOpen(false);
      await loadAllAdminData();
      await refreshHospitalData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add schedule', 'error');
    }
  };

  // Department Save
  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDepartment({
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        description: deptDesc.trim(),
        icon: 'HeartPulse',
        status: 'active'
      });
      showToast('Department created successfully', 'success');
      setDeptModalOpen(false);
      setDeptName('');
      setDeptCode('');
      setDeptDesc('');
      await loadAllAdminData();
      await refreshHospitalData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create department', 'error');
    }
  };

  // Hospital Info Save
  const handleSaveHospitalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateHospitalInfo({
        hospital_name: hName.trim(),
        address: hAddress.trim(),
        phone: hPhone.trim(),
        email: hEmail.trim(),
        emergency_phone: hEmergency.trim(),
        ambulance_phone: hAmbulance.trim(),
        opd_hours: hOpd.trim(),
        visiting_hours: hVisiting.trim(),
        mission: hMission.trim(),
        vision: hVision.trim()
      });
      showToast('Hospital information updated successfully!', 'success');
      await refreshHospitalData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update hospital info', 'error');
    }
  };

  // Sync admin user profile data
  useEffect(() => {
    if (user) {
      if (user.name) setAdminName(user.name);
      if (user.email) setAdminEmail(user.email);
    }
  }, [user]);

  // Admin Credentials Update Handler (Email & Password simultaneously)
  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsSuccessMsg(null);

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Admin email address cannot be empty.', 'error');
      return;
    }

    if (adminNewPassword && adminNewPassword.trim().length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }

    if (adminNewPassword && adminNewPassword !== adminConfirmPassword) {
      showToast('New password and confirm password do not match.', 'error');
      return;
    }

    setSavingCredentials(true);
    try {
      const res = await api.updateAdminCredentials({
        name: adminName.trim(),
        newEmail: cleanEmail,
        currentPassword: adminCurrentPassword.trim() || undefined,
        newPassword: adminNewPassword ? adminNewPassword.trim() : undefined
      });

      if (res.token) {
        localStorage.setItem('msh_auth_token', res.token);
      }

      setCredentialsSuccessMsg(res.message || 'Admin credentials (email & password) updated successfully!');
      showToast(res.message || 'Admin credentials updated successfully!', 'success');
      setAdminCurrentPassword('');
      setAdminNewPassword('');
      setAdminConfirmPassword('');

      if (res.user) {
        setAdminName(res.user.name);
        setAdminEmail(res.user.email);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update admin credentials.', 'error');
    } finally {
      setSavingCredentials(false);
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(a => {
    if (aptStatusFilter !== 'all' && a.status !== aptStatusFilter) return false;
    if (aptSearch.trim()) {
      const q = aptSearch.toLowerCase();
      const matchToken = a.appointment_number?.toLowerCase().includes(q);
      const matchPatient = a.patient_name?.toLowerCase().includes(q);
      const matchDoc = a.doctor_name?.toLowerCase().includes(q);
      const matchPhone = a.patient_phone?.toLowerCase().includes(q);
      if (!matchToken && !matchPatient && !matchDoc && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Top Banner - Bento Grid Style */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 mb-2 border border-teal-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Madanpur Specialized Hospital &bull; Admin Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hospital Management System
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as: <strong className="text-teal-400">{user?.name}</strong> ({user?.role}) &bull; Abdul Mojid Plaza, Madanpur Bandar
          </p>
        </div>

        <button
          onClick={loadAllAdminData}
          className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-teal-300 text-xs font-bold rounded-xl border border-teal-500/30 flex items-center gap-1.5 self-start md:self-auto shadow-md transition-all cursor-pointer relative z-10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Admin Navigation Tabs - Bento Filter Bar */}
      <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {[
          { id: 'overview', label: 'Overview Analytics', icon: ShieldCheck },
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
          { id: 'doctors', label: `Doctors (${doctorsList.length})`, icon: Stethoscope },
          { id: 'schedules', label: `Schedules (${schedulesList.length})`, icon: Clock },
          { id: 'departments', label: `Departments (${deptList.length})`, icon: Building2 },
          { id: 'hospital-info', label: 'Hospital Settings', icon: FileText },
          { id: 'inquiries', label: `Inquiries (${inquiriesList.length})`, icon: MessageSquare },
          { id: 'security', label: 'Admin Security & Access', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Appointments</span>
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalAppointments}</span>
              <span className="block text-[11px] text-teal-700 font-semibold mt-1">
                {stats.todayAppointments} scheduled for today
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-amber-600">{stats.pendingAppointments}</span>
              <span className="block text-[11px] text-slate-500 mt-1">Requires admin confirmation</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Completed Consultations</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">{stats.completedAppointments || 0}</span>
              <span className="block text-[11px] text-slate-500 mt-1">
                Successfully served patients
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Consultants</span>
                <Stethoscope className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.activeDoctors}</span>
              <span className="block text-[11px] text-slate-500 mt-1">Across {stats.totalDepartments} departments</span>
            </div>
          </div>

          {/* Department Breakdown & Status Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Wise Appointments */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Department-wise Appointment Volume</span>
              </h3>
              <div className="space-y-3">
                {stats.departmentStats.map((dep, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{dep.name}</span>
                      <span>{dep.appointment_count} Bookings</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{
                          width: `${Math.min(100, (dep.appointment_count / Math.max(1, stats.totalAppointments)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment Status Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Appointment Status Distribution</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="block text-xs font-bold text-amber-800 uppercase">Pending Review</span>
                  <span className="block text-xl font-black text-amber-900 mt-1">{stats.pendingAppointments}</span>
                  <span className="block text-[11px] text-amber-700">Awaiting confirmation</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="block text-xs font-bold text-emerald-800 uppercase">Confirmed</span>
                  <span className="block text-xl font-black text-emerald-900 mt-1">{stats.confirmedAppointments}</span>
                  <span className="block text-[11px] text-emerald-700">Ready for visit</span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <span className="block text-xs font-bold text-blue-800 uppercase">Completed</span>
                  <span className="block text-xl font-black text-blue-900 mt-1">{stats.completedAppointments}</span>
                  <span className="block text-[11px] text-blue-700">Consultation done</span>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <span className="block text-xs font-bold text-rose-800 uppercase">Cancelled</span>
                  <span className="block text-xl font-black text-rose-900 mt-1">{stats.cancelledAppointments}</span>
                  <span className="block text-[11px] text-rose-700">Cancelled bookings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENT MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hospital Patient Appointments</h2>
              <p className="text-xs text-slate-500">Manage, confirm, reschedule, or cancel patient bookings</p>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by token, patient, doctor..."
                  value={aptSearch}
                  onChange={e => setAptSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-teal-500"
                />
              </div>

              <select
                value={aptStatusFilter}
                onChange={e => setAptStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-3">Token</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor & Specialty</th>
                  <th className="p-3">Schedule & Room</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-800">{apt.appointment_number}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{apt.patient_name}</div>
                      <div className="text-slate-500 text-[11px]">{apt.patient_phone} ({apt.patient_age} yrs, {apt.patient_gender})</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{apt.doctor_name}</div>
                      <div className="text-slate-500 text-[11px]">{apt.specialization}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{apt.date} &bull; <span className="text-teal-700">{apt.time}</span></div>
                      <div className="text-slate-500 text-[11px]">{apt.room_number || 'Room 201'}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => setReceiptApt(apt)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold"
                      >
                        Slip
                      </button>

                      {apt.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                      )}

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold"
                        >
                          Complete
                        </button>
                      )}

                      {apt.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateAppointmentStatus(apt.id, 'cancelled')}
                          className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[11px] font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DOCTORS MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hospital Medical Faculty</h2>
              <p className="text-xs text-slate-500">Add, edit, or adjust consulting physicians and consultation fees</p>
            </div>
            <button
              onClick={() => handleOpenDoctorModal()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctorsList.map(doc => (
              <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/50">
                <div className="flex gap-3 items-center">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                    <p className="text-xs text-teal-700 font-medium truncate">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500">{doc.department_name} &bull; {doc.room_number}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="font-bold text-emerald-700">Fee: ৳{doc.consultation_fee}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenDoctorModal(doc)}
                      className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Edit Doctor"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Delete Doctor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULES MANAGEMENT */}
      {activeTab === 'schedules' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Doctor Weekly Availability Timetable</h2>
              <p className="text-xs text-slate-500">Configure consultation days, start/end hours, and slot durations</p>
            </div>
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule Slot</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase">
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Day of Week</th>
                  <th className="p-3">Consultation Hours</th>
                  <th className="p-3">Slot Duration</th>
                  <th className="p-3">Max Patients</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedulesList.map(sch => (
                  <tr key={sch.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{sch.doctor_name || `Doctor #${sch.doctor_id}`}</td>
                    <td className="p-3 font-semibold text-teal-700">{sch.day}</td>
                    <td className="p-3 font-medium text-slate-800">{sch.start_time} – {sch.end_time}</td>
                    <td className="p-3">{sch.slot_duration} minutes</td>
                    <td className="p-3">{sch.max_patients} patients</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete this schedule slot?')) {
                            await api.deleteSchedule(sch.id);
                            showToast('Schedule slot deleted', 'info');
                            await loadAllAdminData();
                          }
                        }}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hospital Clinical Wings</h2>
              <p className="text-xs text-slate-500">Configure medical departments, codes, and descriptions</p>
            </div>
            <button
              onClick={() => setDeptModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptList.map(d => (
              <div key={d.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md font-mono">
                    {d.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                    {d.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{d.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: HOSPITAL INFO SETTINGS */}
      {activeTab === 'hospital-info' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hospital Institutional Details</h2>
            <p className="text-xs text-slate-500">Live editor for public address, hotlines, timings, mission & vision</p>
          </div>

          <form onSubmit={handleSaveHospitalInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital Name</label>
                <input
                  type="text"
                  required
                  value={hName}
                  onChange={e => setHName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Physical Address</label>
                <input
                  type="text"
                  required
                  value={hAddress}
                  onChange={e => setHAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">24/7 Emergency Hotline</label>
                <input
                  type="text"
                  value={hEmergency}
                  onChange={e => setHEmergency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cardiac Ambulance Hotline</label>
                <input
                  type="text"
                  value={hAmbulance}
                  onChange={e => setHAmbulance(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">General Reception Phone</label>
                <input
                  type="text"
                  value={hPhone}
                  onChange={e => setHPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Hospital Email</label>
                <input
                  type="email"
                  value={hEmail}
                  onChange={e => setHEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">OPD Hours</label>
                <input
                  type="text"
                  value={hOpd}
                  onChange={e => setHOpd(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Visiting Hours</label>
                <input
                  type="text"
                  value={hVisiting}
                  onChange={e => setHVisiting(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mission Statement</label>
                <textarea
                  rows={2}
                  value={hMission}
                  onChange={e => setHMission(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vision Statement</label>
                <textarea
                  rows={2}
                  value={hVision}
                  onChange={e => setHVision(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Hospital Information</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 8: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Patient Inquiries & Feedback</h2>
            <p className="text-xs text-slate-500">Messages sent via website contact form</p>
          </div>

          <div className="space-y-3">
            {inquiriesList.map(msg => (
              <div key={msg.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                    <span className="text-slate-500 text-xs">({msg.email} &bull; {msg.phone || 'No phone'})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(msg.created_at).toLocaleString()}</span>
                </div>
                {msg.subject && <div className="text-xs font-bold text-teal-800">Subject: {msg.subject}</div>}
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: ADMIN SECURITY & CREDENTIALS (CHANGE EMAIL & PASSWORD AT THE SAME TIME) */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Top Status Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Access Control & Security</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Administrator Credentials Management
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Update your administrator login email, administrative display name, and password simultaneously. Changes update database credentials immediately and keep your current active session logged in.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 self-start md:self-auto backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Current Role</div>
                <div className="text-sm font-bold text-white uppercase tracking-wider">{user?.role || 'Super Admin'}</div>
              </div>
            </div>
          </div>

          {credentialsSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2.5 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{credentialsSuccessMsg}</span>
            </div>
          )}

          {/* 2-Column Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-sky-600" />
                  <span>Change Administrator Email & Password</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You can edit your login email, change your password, or update both at the same time.
                </p>
              </div>

              <form onSubmit={handleUpdateAdminCredentials} className="space-y-4">
                {/* Admin Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Administrator Name *
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hospital Administrator"
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Admin Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Admin Login Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@madanpurhospital.com"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    This email is used to log into the Madanpur Hospital Admin Portal.
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Password Update (Optional / Set New Password)
                  </div>
                </div>

                {/* Current Password (Optional verification) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      placeholder="Enter current password if changing security"
                      value={adminCurrentPassword}
                      onChange={e => setAdminCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden font-sans"
                    />
                  </div>
                </div>

                {/* New Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        New Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                      >
                        {showAdminPassword ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Show</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        minLength={6}
                        placeholder="New password (min 6 chars)"
                        value={adminNewPassword}
                        onChange={e => setAdminNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        minLength={6}
                        placeholder="Re-type new password"
                        value={adminConfirmPassword}
                        onChange={e => setAdminConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
                  💡 <strong>Tip:</strong> Leave password fields blank if you only wish to change your admin email and name. If you provide a new password, it will be encrypted with strong bcrypt hashing immediately.
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={savingCredentials}
                    className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {savingCredentials ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Updating Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save & Update Admin Credentials</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Information & Security Card Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Admin Portal Security Overview</span>
                </h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl">
                    <div className="font-bold text-sky-950 mb-0.5">Active Admin Account</div>
                    <div className="font-mono text-[11px] text-sky-800 break-all">{user?.email}</div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                    <div className="font-bold text-slate-900">Privileges Included:</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                      <li>Manage doctor profiles, consultation fees, and room numbers</li>
                      <li>Create and modify doctor OPD weekly schedules</li>
                      <li>Approve, confirm, complete, or cancel appointments</li>
                      <li>Verify bKash / Nagad / Rocket payment transactions</li>
                      <li>Manage clinical departments and hospital contact info</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                    <strong>Security Recommendation:</strong> Always choose a strong password containing at least 8 characters with a mix of numbers and letters. Never share admin credentials with unauthorized personnel.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Modal */}
      {doctorModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-6">
            <h3 className="text-lg font-bold text-slate-900">
              {editingDoctor ? 'Edit Doctor Record' : 'Add New Consulting Doctor'}
            </h3>

            <form onSubmit={handleSaveDoctor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Md. Rafiqul Islam"
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Qualifications *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, FCPS, MD (Cardiology)"
                    value={docQual}
                    onChange={e => setDocQual(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interventional Cardiology & Heart Failure"
                    value={docSpec}
                    onChange={e => setDocSpec(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clinical Department *</label>
                  <select
                    value={docDeptId}
                    onChange={e => setDocDeptId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-teal-500"
                  >
                    {deptList.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Consultation Fee (৳) *</label>
                  <input
                    type="number"
                    required
                    value={docFee}
                    onChange={e => setDocFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={docExp}
                    onChange={e => setDocExp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room Number</label>
                  <input
                    type="text"
                    value={docRoom}
                    onChange={e => setDocRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={docPhoto}
                    onChange={e => setDocPhoto(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Biography & Experience Summary</label>
                  <textarea
                    rows={3}
                    value={docBio}
                    onChange={e => setDocBio(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDoctorModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Add Doctor Weekly Schedule</h3>

            <form onSubmit={handleSaveSchedule} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor</label>
                <select
                  value={schDoctorId}
                  onChange={e => setSchDoctorId(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {doctorsList.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Day of Week</label>
                <select
                  value={schDay}
                  onChange={e => setSchDay(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Time</label>
                  <input
                    type="text"
                    value={schStartTime}
                    onChange={e => setSchStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">End Time</label>
                  <input
                    type="text"
                    value={schEndTime}
                    onChange={e => setSchEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slot Duration (Min)</label>
                  <input
                    type="number"
                    value={schDuration}
                    onChange={e => setSchDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Patients</label>
                  <input
                    type="number"
                    value={schMax}
                    onChange={e => setSchMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Create Clinical Department</h3>

            <form onSubmit={handleSaveDepartment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nephrology & Kidney Care"
                  value={deptName}
                  onChange={e => setDeptName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEPHRO"
                  value={deptCode}
                  onChange={e => setDeptCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Facilities, dialysis, and procedures..."
                  value={deptDesc}
                  onChange={e => setDeptDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeptModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal for Token Printing */}
      {receiptApt && (
        <AppointmentReceiptModal
          appointment={receiptApt}
          onClose={() => setReceiptApt(null)}
        />
      )}
    </div>
  );
};
