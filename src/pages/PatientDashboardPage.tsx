import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHospital } from '../context/HospitalContext';
import { api } from '../services/api';
import { Appointment, NotificationItem } from '../types';
import { AppointmentReceiptModal } from '../components/AppointmentReceiptModal';
import {
  User,
  Calendar,
  Clock,
  Building2,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Edit3,
  CreditCard,
  Phone,
  Printer,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const PatientDashboardPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const {
    showToast,
    notifications,
    refreshNotifications,
    setIsAuthModalOpen,
    setAuthModalMode,
    doctors
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'appointments' | 'profile' | 'notifications'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected appointment for printing/receipt
  const [receiptAppointment, setReceiptAppointment] = useState<Appointment | null>(null);

  // Reschedule Modal
  const [rescheduleItem, setRescheduleItem] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState<number | ''>(user?.age || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(user?.gender || 'Male');
  const [address, setAddress] = useState(user?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const loadMyAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.getAppointments();
      setAppointments(res.appointments || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMyAppointments();
      setName(user.name || '');
      setPhone(user.phone || '');
      setAge(user.age || '');
      setGender(user.gender || 'Male');
      setAddress(user.address || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
        <User className="w-12 h-12 text-teal-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign in to Access Patient Portal</h2>
        <p className="text-xs text-slate-500">
          Please log in with your email and password to view and manage your booked appointments.
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  // Cancel Appointment
  const handleCancelAppointment = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this hospital appointment?')) return;
    try {
      await api.cancelAppointment(id);
      showToast('Appointment cancelled successfully', 'info');
      await loadMyAppointments();
      await refreshNotifications();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel appointment', 'error');
    }
  };

  // Submit Reschedule
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleItem || !newDate || !newTime) return;

    setRescheduling(true);
    try {
      await api.rescheduleAppointment(rescheduleItem.id, newDate, newTime);
      showToast('Appointment rescheduled successfully!', 'success');
      setRescheduleItem(null);
      await loadMyAppointments();
      await refreshNotifications();
    } catch (err: any) {
      showToast(err.message || 'Failed to reschedule appointment', 'error');
    } finally {
      setRescheduling(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        age: age ? Number(age) : null,
        gender,
        address: address.trim()
      });
      updateUser(res.user);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">Confirmed ✓</span>;
      case 'completed':
        return <span className="bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-full text-xs">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-xs">Pending Approval</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-teal-400/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 mb-1">
              <User className="w-3 h-3" />
              <span>Registered Patient Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
            <p className="text-xs text-slate-300">{user.email} &bull; {user.phone || 'No phone registered'}</p>
          </div>
        </div>

        <div className="flex gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'appointments' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'notifications' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'profile' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Consultation Appointments</h2>
            <button
              onClick={loadMyAppointments}
              className="text-xs text-teal-600 font-bold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs">Loading your appointment records...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-3 shadow-xs">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Appointments Booked Yet</h3>
              <p className="text-xs text-slate-500">
                You haven't scheduled any doctor appointments yet. Find your specialist and book a consultation slot now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {appointments.map(apt => (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">Token Number</span>
                      <span className="text-base font-black font-mono text-slate-900">{apt.appointment_number}</span>
                    </div>
                    <div>{getStatusBadge(apt.status)}</div>
                  </div>

                  <div className="flex gap-3.5 items-center">
                    <img
                      src={apt.doctor_photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                      alt={apt.doctor_name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{apt.doctor_name}</h4>
                      <p className="text-xs text-teal-700 font-medium truncate">{apt.specialization}</p>
                      <p className="text-[11px] text-slate-500">{apt.room_number || 'Room 201'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{apt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Consultation Room: <strong>{apt.room_number || '201'}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setReceiptAppointment(apt)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Token Slip</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => {
                              setRescheduleItem(apt);
                              setNewDate(apt.date);
                              setNewTime(apt.time);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Your Activity & Appointment Alerts</h3>
            <button
              onClick={async () => {
                await api.markAllNotificationsRead();
                await refreshNotifications();
                showToast('All notifications marked as read', 'success');
              }}
              className="text-xs text-teal-600 font-bold hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No notifications at the moment.</p>
          ) : (
            <div className="space-y-2.5">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    n.status === 'unread' ? 'bg-teal-50/50 border-teal-200 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block">{new Date(n.created_at).toLocaleString()}</span>
                  </div>

                  {n.status === 'unread' && (
                    <button
                      onClick={async () => {
                        await api.markNotificationRead(n.id);
                        await refreshNotifications();
                      }}
                      className="text-[11px] text-teal-700 font-bold underline shrink-0"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-2xl space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit Patient Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your personal details used for fast hospital appointment registration.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Reschedule Consultation</h3>
            <p className="text-xs text-slate-500">
              Pick a new date and time for Dr. {rescheduleItem.doctor_name}
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Time Slot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 05:40 PM"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rescheduling}
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  {rescheduling ? 'Updating...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptAppointment && (
        <AppointmentReceiptModal
          appointment={receiptAppointment}
          onClose={() => setReceiptAppointment(null)}
        />
      )}
    </div>
  );
};
