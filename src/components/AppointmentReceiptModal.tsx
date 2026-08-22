import React, { useRef } from 'react';
import { Appointment } from '../types';
import { useHospital } from '../context/HospitalContext';
import {
  CheckCircle2,
  Building2,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Printer,
  Download,
  X,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppointmentReceiptModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const AppointmentReceiptModal: React.FC<AppointmentReceiptModalProps> = ({
  appointment,
  onClose
}) => {
  const { hospitalInfo, setActivePage } = useHospital();
  const receiptRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (appointment) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [appointment]);

  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs uppercase">Confirmed ✓</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs uppercase">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full text-xs uppercase">Cancelled</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs uppercase">Pending Confirmation</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-xl font-black tracking-tight">
            Appointment Successfully Booked!
          </h2>
          <p className="text-xs text-teal-100 mt-1">
            Your appointment has been registered at Madanpur Specialized Hospital.
          </p>
        </div>

        {/* Printable Receipt Body */}
        <div ref={receiptRef} className="p-6 space-y-6 print:p-0 print:m-0">
          {/* Header Info */}
          <div className="text-center border-b border-slate-200 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              MADANPUR SPECIALIZED HOSPITAL
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Emergency: {hospitalInfo?.emergency_phone || '+880 1711-001122'} &bull; Phone: {hospitalInfo?.phone || '+880 1712-345678'}
            </p>
          </div>

          {/* Appointment ID & Status */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Appointment Token ID
              </span>
              <span className="text-lg font-black text-slate-900 tracking-wide font-mono">
                {appointment.appointment_number}
              </span>
            </div>
            <div>
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
              <span className="text-teal-700 font-semibold block mb-1">Consulting Doctor</span>
              <p className="font-bold text-slate-900 text-sm">{appointment.doctor_name}</p>
              <p className="text-slate-600">{appointment.specialization}</p>
              <p className="text-teal-800 font-medium mt-1">{appointment.room_number || 'Room 201'}</p>
            </div>

            <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
              <span className="text-teal-700 font-semibold block mb-1">Schedule & Timing</span>
              <p className="font-bold text-slate-900 text-sm">{appointment.date}</p>
              <p className="text-slate-600 font-medium">{appointment.time}</p>
              <p className="text-emerald-700 font-semibold mt-1">Confirmed Room: {appointment.room_number || '201'}</p>
            </div>

            <div className="col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-800">{appointment.patient_name} ({appointment.patient_age} yrs, {appointment.patient_gender})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Number:</span>
                <span className="font-medium text-slate-800">{appointment.patient_phone}</span>
              </div>
              {appointment.patient_email && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-800">{appointment.patient_email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Reason / Complaint:</span>
                <span className="font-medium text-slate-800 max-w-[280px] text-right truncate">{appointment.reason}</span>
              </div>
            </div>
          </div>

          {/* Important Patient Instructions */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              Patient Instructions:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
              <li>Please arrive at the hospital reception 15 minutes before your scheduled appointment time.</li>
              <li>Bring your previous diagnostic reports, prescriptions, and this appointment token ID.</li>
              <li>For any cancellation or queries, call our 24/7 hotline at {hospitalInfo?.phone || '+880 1712-345678'}.</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Token Slip</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setActivePage('patient-dashboard');
              }}
              className="px-4 py-2 rounded-xl border border-teal-300 text-xs font-bold text-teal-700 hover:bg-teal-50 transition-colors"
            >
              View in My Dashboard
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
