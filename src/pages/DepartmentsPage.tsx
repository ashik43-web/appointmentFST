import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { DoctorCard } from '../components/DoctorCard';
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Stethoscope,
  Building2,
  Users,
  ChevronRight
} from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const { departments, doctors, setBookingDoctor } = useHospital();
  const [selectedDeptId, setSelectedDeptId] = useState<number | 'all'>('all');

  const filteredDoctors = selectedDeptId === 'all'
    ? doctors
    : doctors.filter(d => d.department_id === selectedDeptId);

  const selectedDepartmentObj = departments.find(d => d.id === selectedDeptId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header - Bento Style */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-teal-500/20 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Center of Clinical Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Clinical Departments & Specialized Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Madanpur Specialized Hospital provides comprehensive multidisciplinary care equipped with 24/7 ICU, CCU, NICU, laminar airflow modular operating theaters, and 128-slice CT diagnostics.
          </p>
        </div>
      </div>

      {/* Departments Bento Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            Browse Hospital Clinical Wings
          </h2>
          {selectedDeptId !== 'all' && (
            <button
              onClick={() => setSelectedDeptId('all')}
              className="text-xs text-teal-700 font-bold bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              View All Departments ({departments.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map(dept => {
            const deptDocs = doctors.filter(d => d.department_id === dept.id);
            const isSelected = selectedDeptId === dept.id;

            return (
              <div
                key={dept.id}
                onClick={() => setSelectedDeptId(isSelected ? 'all' : dept.id)}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70 shadow-md ring-2 ring-teal-500/30'
                    : 'border-slate-200 bg-white hover:border-teal-400 hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-all">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 group-hover:bg-teal-100 group-hover:text-teal-800 text-slate-700 transition-colors">
                      {deptDocs.length} Specialists
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                  <span>{isSelected ? 'Viewing Doctors ↓' : 'View Specialists'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specialists in Selected Department */}
      <div className="pt-6 border-t border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {selectedDepartmentObj
                ? `Doctors in ${selectedDepartmentObj.name}`
                : 'All Available Specialists'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredDoctors.length} consultant physicians
            </p>
          </div>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doc => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 text-sm">
            No doctors currently listed for this specific department.
          </div>
        )}
      </div>
    </div>
  );
};
