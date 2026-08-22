import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  X,
  Calendar,
  Clock,
  Briefcase,
  UserCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DoctorModal: React.FC = () => {
  const { selectedDoctorDetail, setSelectedDoctorDetail, setBookingDoctor } = useHospital();

  if (!selectedDoctorDetail) return null;

  const doc = selectedDoctorDetail;

  const handleBookNow = () => {
    setSelectedDoctorDetail(null);
    setBookingDoctor(doc);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8 max-h-[90vh]"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 p-6 text-white flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <img
                src={doc.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                alt={doc.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-teal-100 mb-1">
                  {doc.department_name || 'Clinical Specialist'}
                </span>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {doc.name}
                </h2>
                <p className="text-sm text-teal-200 font-medium">
                  {doc.qualification}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  {doc.specialization}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDoctorDetail(null)}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
                <span className="block text-xs text-slate-500 font-medium">Experience</span>
                <span className="block text-base font-bold text-slate-900 mt-0.5">{doc.experience}+ Years</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
                <span className="block text-xs text-slate-500 font-medium">Consultation Fee</span>
                <span className="block text-base font-bold text-emerald-700 mt-0.5">৳{doc.consultation_fee}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
                <span className="block text-xs text-slate-500 font-medium">Consultation Room</span>
                <span className="block text-base font-bold text-slate-900 mt-0.5 truncate">{doc.room_number || 'Room 201'}</span>
              </div>
            </div>

            {/* Biography */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                About the Specialist
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-teal-50/40 p-4 rounded-2xl border border-teal-100">
                {doc.biography || `${doc.name} is an esteemed consultant at Madanpur Specialized Hospital, dedicated to providing high-quality diagnostic and therapeutic healthcare with exceptional patient care.`}
              </p>
            </div>

            {/* Available Schedule Timetable */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Weekly Consultation Schedule</span>
              </h3>

              {doc.schedules && doc.schedules.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {doc.schedules.map(sch => (
                    <div
                      key={sch.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="text-sm font-bold text-slate-800">{sch.day}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {sch.start_time} – {sch.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Weekly schedule available: Saturday, Monday & Wednesday (5:00 PM – 8:30 PM).
                </p>
              )}
            </div>

            {/* Hospital Location Notice */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Hospital Location: </strong>
                Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh.
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              onClick={() => setSelectedDoctorDetail(null)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleBookNow}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-600/30 transition-all flex items-center gap-2"
            >
              <span>Book Appointment with {doc.name.split(' ')[1] || doc.name}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
