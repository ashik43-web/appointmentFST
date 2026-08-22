import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { DoctorCard } from '../components/DoctorCard';
import {
  Search,
  Calendar,
  PhoneCall,
  Clock,
  HeartPulse,
  Activity,
  ShieldCheck,
  Award,
  Users,
  Building,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Ambulance,
  MapPin,
  Flame,
  ArrowUpRight,
  BedDouble,
  Microscope
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    hospitalInfo,
    doctors,
    departments,
    setActivePage,
    setBookingDoctor
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage('doctors');
  };

  const topDoctors = doctors.slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Bento Grid Hero Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Bento Tile 1: Main Brand & Search (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-950 via-teal-950/90 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-teal-500/20 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            {/* Subtle background mesh glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/25 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-400/30 text-xs font-semibold backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Narayanganj Premier Specialized Hospital</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>24/7 Emergency & ICU</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                MADANPUR <span className="text-teal-400">SPECIALIZED</span> HOSPITAL
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Excellence in diagnostic, surgical, and critical healthcare. Consult renowned professors and specialists, book doctor appointments online, and access 24-hour emergency trauma care.
              </p>

              {/* Quick Search Bar Bento Module */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 border border-white/20"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search doctor by name, specialty, or condition..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-slate-800 text-xs sm:text-sm focus:outline-hidden font-medium placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-teal-700/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Doctor</span>
                </button>
              </form>
            </div>

            {/* Bottom Badges */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => setActivePage('doctors')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-200 border border-teal-400/30 hover:bg-teal-500/30 transition-all font-semibold cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>Browse All Specialists</span>
              </button>
              <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> 10+ Departments
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Instant Token
                </span>
              </div>
            </div>
          </div>

          {/* Bento Tile 2: 24/7 Emergency & Quick Booking (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            
            {/* 24/7 Emergency Card */}
            <div className="bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-rose-500/30 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                    Emergency & Trauma Desk
                  </span>
                  <h3 className="text-lg font-bold text-white">24-Hour Rapid Medical Care</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-rose-600/30 text-rose-400 flex items-center justify-center border border-rose-500/40 shrink-0">
                  <Ambulance className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3 my-4">
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Emergency Hotline</p>
                    <p className="text-sm sm:text-base font-bold text-amber-300">
                      {hospitalInfo?.emergency_phone || '+880 1711-001122'}
                    </p>
                  </div>
                  <a
                    href={`tel:${hospitalInfo?.emergency_phone || '+8801711001122'}`}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
                  >
                    Call Now
                  </a>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Hospital General Desk</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      {hospitalInfo?.phone || '+880 1712-345678'}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                    OPD 8am-10pm
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (doctors.length > 0) setBookingDoctor(doctors[0]);
                  else setActivePage('doctors');
                }}
                className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Specialist Consultation</span>
              </button>
            </div>

            {/* Quick Metrics Bento Tile */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-xl font-black text-teal-700">10+</span>
                <span className="text-[11px] text-slate-500 font-medium">Departments</span>
              </div>
              <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-xl font-black text-teal-700">24/7</span>
                <span className="text-[11px] text-slate-500 font-medium">ICU & CCU</span>
              </div>
              <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-xl font-black text-teal-700">99%</span>
                <span className="text-[11px] text-slate-500 font-medium">Satisfaction</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hospital Key Clinical Pillars - Bento Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
            Clinical Standards
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Specialized Hospital Infrastructure
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Bento Block 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">24/7 ICU & CCU Care</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Invasive mechanical ventilators, central cardiac telemetry, and round-the-clock intensivist doctors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-700">
              <span>Critical Care Unit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Block 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white transition-all">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">128-Slice CT Diagnostics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ultra-fast volumetric computed tomography, 4D echocardiography, digital X-ray, and USG imaging.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-700">
              <span>Digital Radiology</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Block 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Specialist Consultation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Distinguished professors, associate professors, and consultants across cardiology, surgery, pediatrics, and more.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
              <span>OPD Specialists</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bento Block 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Modular Operating Theaters</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                HEPA-filtered laminar airflow surgical suites for complex orthopedic, laparoscopic, and neurosurgical procedures.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
              <span>Surgical Suites</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Specialists Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Medical Faculty & Specialists</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Consulting Doctors
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Browse our esteemed roster of specialized physicians and schedule your consultation slot online.
            </p>
          </div>

          <button
            onClick={() => setActivePage('doctors')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span>View All Doctors & Schedule</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topDoctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>

      {/* Clinical Departments Bento Section */}
      <section className="bg-slate-900 text-white py-16 border-t border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
              Clinical Specializations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hospital Departments & Wings
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Comprehensive medical departments equipped with advanced diagnostic equipment and compassionate nursing staff.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => setActivePage('departments')}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-teal-400 hover:bg-slate-800 transition-all text-center flex flex-col items-center group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all border border-teal-500/20">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-teal-400 transition-colors line-clamp-1">
                  {dept.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {dept.description}
                </p>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setActivePage('departments')}
              className="px-6 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              Explore Full Departments & Diagnostic Facilities
            </button>
          </div>
        </div>
      </section>

      {/* Hospital Metrics & Location Bento Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-teal-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>Narayanganj Regional Center of Healthcare</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Trusted Medical Care When You Need It Most
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Located conveniently at Abdul Mojid Plaza in Madanpur Bandar, Narayanganj, we serve thousands of patients every month with modern emergency facilities, outpatient clinics, and advanced surgical care.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                <div>
                  <span className="block text-2xl font-black text-teal-400">10+</span>
                  <span className="text-[11px] text-slate-400 font-medium">Clinical Wings</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-teal-400">24/7</span>
                  <span className="text-[11px] text-slate-400 font-medium">Trauma & ICU</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-teal-400">99%</span>
                  <span className="text-[11px] text-slate-400 font-medium">Patient Trust</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-white/20 space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Visit Madanpur Specialized Hospital
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>OPD Consultation: Daily 8:00 AM – 10:00 PM</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-300 font-bold">24/7 Hotline: {hospitalInfo?.emergency_phone || '+880 1711-001122'}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setActivePage('contact')}
                  className="flex-1 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors text-center cursor-pointer"
                >
                  Contact Desk
                </button>
                <button
                  onClick={() => setActivePage('doctors')}
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors text-center cursor-pointer"
                >
                  Find Doctors
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

