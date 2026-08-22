import React, { useState, useMemo } from 'react';
import { useHospital } from '../context/HospitalContext';
import { DoctorCard } from '../components/DoctorCard';
import {
  Search,
  Filter,
  Stethoscope,
  RotateCcw,
  Calendar,
  DollarSign,
  Briefcase,
  UserCheck
} from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  const { doctors, departments } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(2000);
  const [selectedDay, setSelectedDay] = useState('all');

  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesSpec = doc.specialization.toLowerCase().includes(query);
        const matchesQual = doc.qualification.toLowerCase().includes(query);
        const matchesDept = doc.department_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesSpec && !matchesQual && !matchesDept) return false;
      }

      // Department
      if (selectedDept !== 'all' && doc.department_id !== Number(selectedDept)) {
        return false;
      }

      // Gender
      if (selectedGender !== 'all' && doc.gender !== selectedGender) {
        return false;
      }

      // Min Experience
      if (doc.experience < minExperience) {
        return false;
      }

      // Max Fee
      if (doc.consultation_fee > maxFee) {
        return false;
      }

      // Day
      if (selectedDay !== 'all') {
        const hasDay = doc.schedules?.some(s => s.day.toLowerCase() === selectedDay.toLowerCase());
        if (!hasDay) return false;
      }

      return true;
    });
  }, [doctors, searchTerm, selectedDept, selectedGender, minExperience, maxFee, selectedDay]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('all');
    setSelectedGender('all');
    setMinExperience(0);
    setMaxFee(2000);
    setSelectedDay('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Page Header - Bento Style */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-teal-500/20 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Hospital Consultant Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Find Your Specialist Doctor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Search and filter expert consultants across all clinical departments at Madanpur Specialized Hospital. Select your doctor and reserve your appointment slot online.
          </p>
        </div>
      </div>

      {/* Search and Filters Bento Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty (e.g. Heart, Knee, Pediatric), or qualification..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden font-medium"
          />
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Department */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Available Day */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Consultation Day
            </label>
            <select
              value={selectedDay}
              onChange={e => setSelectedDay(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="all">Any Day</option>
              {daysOfWeek.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Doctor Gender
            </label>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male Doctor</option>
              <option value="Female">Female Doctor</option>
            </select>
          </div>

          {/* Minimum Experience */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Experience: {minExperience}+ Yrs
            </label>
            <input
              type="range"
              min="0"
              max="25"
              step="2"
              value={minExperience}
              onChange={e => setMinExperience(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer mt-1"
            />
          </div>

          {/* Max Consultation Fee */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Max Fee: ৳{maxFee}
            </label>
            <input
              type="range"
              min="400"
              max="2000"
              step="100"
              value={maxFee}
              onChange={e => setMaxFee(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer mt-1"
            />
          </div>
        </div>

        {/* Filter Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-600">
            Showing <strong className="text-teal-700 font-bold">{filteredDoctors.length}</strong> verified specialists
          </span>

          <button
            onClick={handleResetFilters}
            className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doc => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Doctors Found</h3>
          <p className="text-xs text-slate-500">
            No doctors matched your filter criteria. Try adjusting your filters or search keywords.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
