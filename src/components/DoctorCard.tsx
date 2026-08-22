import React from 'react';
import { Doctor } from '../types';
import { useHospital } from '../context/HospitalContext';
import {
  Calendar,
  Clock,
  Award,
  DollarSign,
  Briefcase,
  UserCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const { setBookingDoctor, setSelectedDoctorDetail } = useHospital();

  const formattedFee = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(doctor.consultation_fee).replace('BDT', '৳');

  // Format available days string
  const daysList = doctor.schedules && doctor.schedules.length > 0
    ? doctor.schedules.map(s => s.day).join(', ')
    : 'Sat, Mon, Wed';

  const timeRange = doctor.schedules && doctor.schedules.length > 0
    ? `${doctor.schedules[0].start_time} – ${doctor.schedules[0].end_time}`
    : '05:00 PM – 08:30 PM';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-500/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Header / Photo & Badges */}
      <div className="p-5 flex gap-4 items-start">
        <div className="relative shrink-0">
          <img
            src={doctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
            alt={doctor.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-xs group-hover:scale-105 transition-transform duration-300"
          />
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            doctor.status === 'active' ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-400'
          }`} title={doctor.status === 'active' ? 'Available for Consultation' : 'Currently Unavailable'}></span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60 truncate">
              {doctor.department_name || 'Specialist'}
            </span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg shrink-0">
              {formattedFee}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 mt-1.5 truncate group-hover:text-teal-700 transition-colors">
            {doctor.name}
          </h3>

          <p className="text-xs text-slate-500 truncate font-medium">
            {doctor.qualification}
          </p>

          <p className="text-xs text-teal-800 font-semibold mt-0.5 line-clamp-1">
            {doctor.specialization}
          </p>
        </div>
      </div>

      {/* Doctor Meta Stats Bento Subgrid */}
      <div className="mx-4 mb-2 p-3 bg-slate-50/90 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="text-[11px]"><strong>{doctor.experience}+ Years</strong> Exp.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate text-[11px]">{doctor.room_number || 'Room 201'}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 text-slate-700 pt-1 border-t border-slate-200/60">
          <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate text-[11px]"><strong>Days:</strong> {daysList}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 text-slate-700">
          <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate text-[11px]"><strong>Time:</strong> {timeRange}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 mt-auto grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setSelectedDoctorDetail(doctor)}
          className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-center cursor-pointer"
        >
          View Profile
        </button>

        <button
          onClick={() => setBookingDoctor(doctor)}
          className="w-full py-2.5 px-3 rounded-xl bg-teal-600 text-xs font-bold text-white hover:bg-teal-700 active:bg-teal-800 transition-all flex items-center justify-center gap-1 shadow-md shadow-teal-600/20 cursor-pointer"
        >
          <span>Book Now</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
