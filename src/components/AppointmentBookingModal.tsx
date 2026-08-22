import React, { useState, useEffect } from 'react';
import { Doctor, Appointment } from '../types';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AppointmentReceiptModal } from './AppointmentReceiptModal';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Search,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

export const AppointmentBookingModal: React.FC = () => {
  const {
    bookingDoctor,
    setBookingDoctor,
    doctors,
    departments,
    showToast,
    refreshNotifications
  } = useHospital();

  const { user } = useAuth();

  // Booking Flow Steps: 1: Doctor -> 2: Date -> 3: Time -> 4: Patient Info & Confirmation
  const [step, setStep] = useState<number>(1);
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');

  // Step 2: Date
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDaysNotice, setAvailableDaysNotice] = useState<string>('');

  // Step 3: Time Slots
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; isBooked: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Step 4: Patient Details
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState<number>(25);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientAddress, setPatientAddress] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Completed Appointment for Receipt
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      setPatientName(user.name || '');
      setPatientPhone(user.phone || '');
      setPatientEmail(user.email || '');
      if (user.age) setPatientAge(user.age);
      if (user.gender) setPatientGender(user.gender as any);
      if (user.address) setPatientAddress(user.address);
    }
  }, [user]);

  // Set initial selected doctor if opened with doctor
  useEffect(() => {
    if (bookingDoctor) {
      setSelectedDoc(bookingDoctor);
      setStep(2); // Jump directly to date selection
    } else {
      setStep(1);
    }
  }, [bookingDoctor]);

  // When doctor is selected, prepare available days note
  useEffect(() => {
    if (selectedDoc?.schedules && selectedDoc.schedules.length > 0) {
      const days = selectedDoc.schedules.map(s => s.day).join(', ');
      setAvailableDaysNotice(`Available on: ${days}`);
    } else {
      setAvailableDaysNotice('Consultations available daily (Sat - Thu)');
    }
  }, [selectedDoc]);

  // Fetch slots whenever selectedDate or selectedDoc changes
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDoc || !selectedDate) return;
      setSlotsLoading(true);
      setSlotsError(null);
      setSelectedTime('');
      try {
        const res = await api.getSlots(selectedDoc.id, selectedDate);
        if (!res.available) {
          setSlotsError(res.message || 'Doctor is not available on this day.');
          setAvailableSlots([]);
        } else {
          setAvailableSlots(res.slots || []);
        }
      } catch (err: any) {
        setSlotsError(err.message || 'Failed to load time slots.');
      } finally {
        setSlotsLoading(false);
      }
    }
    if (step === 3 || (selectedDoc && selectedDate)) {
      loadSlots();
    }
  }, [selectedDoc, selectedDate, step]);

  if (!bookingDoctor && step === 1 && !selectedDoc) {
    return null;
  }

  const handleClose = () => {
    setBookingDoctor(null);
    setSelectedDoc(null);
    setCreatedAppointment(null);
    setStep(1);
  };

  // Step 2 Next: Validate Date
  const handleDateNext = () => {
    if (!selectedDate) {
      showToast('Please select an appointment date', 'warning');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate < today) {
      showToast('Please select today or a future date', 'warning');
      return;
    }
    setStep(3);
  };

  // Step 3 Next: Validate Time Slot
  const handleTimeNext = () => {
    if (!selectedTime) {
      showToast('Please select an available consultation time slot', 'warning');
      return;
    }
    setStep(4);
  };

  // Final Submit
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedDoc || !selectedDate || !selectedTime) {
      showToast('Please complete doctor, date and time selections', 'error');
      return;
    }

    if (!patientName.trim() || !patientPhone.trim() || !reason.trim() || !patientAge) {
      showToast('Please fill all required patient details (Name, Phone, Age, Reason)', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        doctor_id: selectedDoc.id,
        date: selectedDate,
        time: selectedTime,
        patient_name: patientName.trim(),
        patient_phone: patientPhone.trim(),
        patient_email: patientEmail.trim(),
        patient_age: Number(patientAge),
        patient_gender: patientGender,
        patient_address: patientAddress.trim(),
        reason: reason.trim(),
        notes: notes.trim()
      };

      const res = await api.createAppointment(payload);
      showToast('Appointment successfully booked!', 'success');
      setCreatedAppointment(res.appointment);
      await refreshNotifications();
    } catch (err: any) {
      showToast(err.message || 'Failed to book appointment. Please try another slot.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered doctors for Step 1
  const filteredDoctors = doctors.filter(doc => {
    const matchesDept = selectedDeptId === 'all' || doc.department_id === Number(selectedDeptId);
    const matchesSearch = !doctorSearch.trim() ||
      doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      (doc.department_name && doc.department_name.toLowerCase().includes(doctorSearch.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <>
      {createdAppointment ? (
        <AppointmentReceiptModal
          appointment={createdAppointment}
          onClose={handleClose}
        />
      ) : (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-6 max-h-[92vh]">
            {/* Modal Header & Step Indicator */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" />
                <span>Madanpur Specialized Hospital &bull; Narayanganj</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Book Doctor Consultation
              </h2>

              {/* Progress Steps Header */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { num: 1, label: '1. Select Doctor' },
                  { num: 2, label: '2. Choose Date' },
                  { num: 3, label: '3. Time Slot' },
                  { num: 4, label: '4. Patient Info' }
                ].map(s => {
                  const isActive = step === s.num;
                  const isDone = step > s.num;
                  return (
                    <div
                      key={s.num}
                      className={`py-1.5 px-1.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-teal-600 text-white font-bold shadow-xs'
                          : isDone
                          ? 'text-teal-400 bg-teal-950/40 font-semibold'
                          : 'text-slate-500 bg-slate-800/40'
                      }`}
                    >
                      <span className="truncate block">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* STEP 1: SELECT DOCTOR */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search doctor by name or specialization..."
                        value={doctorSearch}
                        onChange={e => setDoctorSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <select
                      value={selectedDeptId}
                      onChange={e => setSelectedDeptId(e.target.value)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 font-medium focus:border-teal-500"
                    >
                      <option value="all">All Departments</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {filteredDoctors.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoc(doc);
                          setStep(2);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                          selectedDoc?.id === doc.id
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                            : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs'
                        }`}
                      >
                        <img
                          src={doc.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                          <p className="text-xs text-teal-700 font-semibold truncate">{doc.specialization}</p>
                          <p className="text-[11px] text-slate-500 truncate">{doc.qualification}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 font-medium">
                            <span>Room: {doc.room_number || '201'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: CHOOSE DATE */}
              {step === 2 && selectedDoc && (
                <div className="space-y-4">
                  {/* Selected Doctor Summary */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedDoc.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                        alt={selectedDoc.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{selectedDoc.name}</h4>
                        <p className="text-xs text-teal-700 font-medium">{selectedDoc.specialization} &bull; Room {selectedDoc.room_number || '201'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-teal-600 font-bold hover:underline"
                    >
                      Change Doctor
                    </button>
                  </div>

                  <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-teal-950">Doctor's Schedule</p>
                      <p className="text-xs text-teal-800">{availableDaysNotice}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Preferred Consultation Date *
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm font-medium focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: TIME SLOTS */}
              {step === 3 && selectedDoc && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">Doctor & Date</span>
                      <span className="font-bold text-slate-900">{selectedDoc.name} &bull; {selectedDate}</span>
                    </div>
                    <button onClick={() => setStep(2)} className="text-teal-600 font-bold hover:underline">
                      Change Date
                    </button>
                  </div>

                  {slotsLoading ? (
                    <div className="py-12 text-center text-slate-500">
                      <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs">Checking doctor slot availability...</p>
                    </div>
                  ) : slotsError ? (
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                      <h4 className="text-sm font-bold text-amber-900">{slotsError}</h4>
                      <p className="text-xs text-amber-700">Please choose another consultation date when the doctor is available.</p>
                      <button
                        onClick={() => setStep(2)}
                        className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700 mt-2"
                      >
                        Pick Another Date
                      </button>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700">No available slots for this date.</p>
                      <button onClick={() => setStep(2)} className="text-xs text-teal-600 font-bold hover:underline">
                        Choose a different date
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                      {availableSlots.map(slot => {
                        const isSelected = selectedTime === slot.time;
                        if (slot.isBooked) {
                          return (
                            <div
                              key={slot.time}
                              className="p-3 rounded-xl border border-slate-100 bg-slate-100 text-slate-400 text-center cursor-not-allowed opacity-60"
                            >
                              <span className="block text-xs font-medium">{slot.time}</span>
                              <span className="block text-[10px] mt-0.5 text-rose-500 font-bold">Booked</span>
                            </div>
                          );
                        }
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-3 rounded-xl border transition-all text-center ${
                              isSelected
                                ? 'border-teal-600 bg-teal-600 text-white font-bold shadow-md'
                                : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/50 text-slate-800 font-semibold'
                            }`}
                          >
                            <span className="block text-xs">{slot.time}</span>
                            <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-teal-100' : 'text-emerald-600 font-medium'}`}>
                              Available
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: PATIENT DETAILS & DIRECT CONFIRMATION */}
              {step === 4 && selectedDoc && (
                <form onSubmit={handleFinalSubmit} className="space-y-5">
                  {/* Summary Card */}
                  <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl shadow-md space-y-2">
                    <div className="flex items-center justify-between text-xs text-teal-300">
                      <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        Consultation Summary
                      </span>
                      <span>Room {selectedDoc.room_number || '201'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-black text-white">{selectedDoc.name}</h4>
                        <p className="text-xs text-teal-200">{selectedDoc.specialization}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-bold text-white">{selectedDate}</p>
                        <p className="text-teal-300 font-mono font-bold">{selectedTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ahmed Tasrik"
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 01812345678"
                        value={patientPhone}
                        onChange={e => setPatientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. patient@gmail.com"
                        value={patientEmail}
                        onChange={e => setPatientEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          required
                          value={patientAge}
                          onChange={e => setPatientAge(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Gender *
                        </label>
                        <select
                          value={patientGender}
                          onChange={e => setPatientGender(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-teal-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Address / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Madanpur, Bandar, Narayanganj"
                        value={patientAddress}
                        onChange={e => setPatientAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Reason for Visit / Symptoms *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Briefly describe your symptoms or medical concern..."
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              )}

              {step === 1 && (
                <button
                  type="button"
                  disabled={!selectedDoc}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-1.5 hover:bg-teal-700 transition-colors"
                >
                  <span>Continue to Date</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleDateNext}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-1.5 hover:bg-teal-700 transition-colors"
                >
                  <span>Select Time Slot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handleTimeNext}
                  disabled={!selectedTime}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-1.5 hover:bg-teal-700 transition-colors"
                >
                  <span>Patient Info</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  onClick={() => handleFinalSubmit()}
                  disabled={isSubmitting}
                  className="px-7 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-teal-600/30 flex items-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Booking Appointment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Appointment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
