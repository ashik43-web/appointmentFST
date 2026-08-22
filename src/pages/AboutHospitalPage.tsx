import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Building2,
  MapPin,
  Clock,
  PhoneCall,
  ShieldCheck,
  Award,
  CheckCircle2,
  Activity,
  HeartPulse,
  Users,
  Ambulance,
  Calendar
} from 'lucide-react';

export const AboutHospitalPage: React.FC = () => {
  const { hospitalInfo, setActivePage, doctors } = useHospital();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Hero Bento Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-500/20 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Profile & Infrastructure</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            About Madanpur Specialized Hospital
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Established to deliver international-standard specialized healthcare, rapid trauma management, and compassionate clinical services to the residents of Narayanganj and surrounding regional hubs.
          </p>

          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold pt-2">
            <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh</span>
          </div>
        </div>
      </div>

      {/* Mission & Vision Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-teal-400 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Our Hospital Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {hospitalInfo?.mission || 'To provide high-quality, comprehensive, and compassionate specialized healthcare with state-of-the-art diagnostic and surgical technology at affordable costs to our community.'}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-sky-400 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Our Healthcare Vision</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {hospitalInfo?.vision || 'To become the benchmark tertiary hospital in Narayanganj, renowned for medical clinical excellence, patient-centric ethics, advanced critical care, and community wellness.'}
          </p>
        </div>
      </div>

      {/* Key Infrastructure & Facilities Bento Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
            Clinical Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Medical Facilities & Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered to provide immediate resuscitation, accurate digital diagnostics, and comfortable patient recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-teal-400 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>24/7 Intensive Care Unit (ICU & CCU)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-parameter invasive hemodynamic monitoring, advanced mechanical ventilators, and dedicated intensivist physicians on-duty 24/7.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-teal-400 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>128-Slice Volumetric CT Scan</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-resolution digital whole-body computed tomography, CT angiograms, and rapid trauma stroke scanning.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-teal-400 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>Modular Laminar Flow Operation Theaters</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Positive-pressure sterile surgical suites equipped for orthopedic joint replacements, laparoscopy, and neurosurgery.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-teal-400 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>Digital Radiology & 4D USG</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Low-dose digital radiography, Color Doppler, 4D obstetric ultrasound, and computer-guided fine-needle aspirations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-teal-400 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>24/7 Automated Pathology Lab & Blood Bank</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fully automated biochemistry, hematology, immunology analyzers, and screened blood cross-matching services.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-teal-400 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>24/7 ICU Ambulance Fleet</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mobile resuscitation ambulances with oxygen, emergency defibrillators, and trained paramedical emergency responders.
            </p>
          </div>
        </div>
      </div>

      {/* Hospital Location & Operational Hours Bento Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
              Location Address
            </span>
            <p className="text-sm font-bold text-white">
              Abdul Mojid Plaza, Fulhor
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              Madanpur Bandar, Narayanganj, Bangladesh
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              (Directly accessible from Dhaka-Chittagong Highway at Madanpur intersection)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
              Outpatient Consultation Hours
            </span>
            <p className="text-sm font-bold text-white">
              Daily: 8:00 AM – 10:00 PM
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              Emergency & Trauma: 24 Hours Open (365 Days)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
              Inpatient Visiting Hours
            </span>
            <p className="text-sm font-bold text-white">
              Evening: 4:00 PM – 7:00 PM
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              Maximum 2 visitors per patient to maintain sterility.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            Emergency Desk: <strong className="text-amber-400 font-bold">{hospitalInfo?.emergency_phone || '+880 1711-001122'}</strong>
          </div>

          <button
            onClick={() => setActivePage('doctors')}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-teal-500/20 cursor-pointer"
          >
            Find Doctor & Schedule Visit
          </button>
        </div>
      </div>
    </div>
  );
};
