import React from 'react';
import { useHospital, ActivePage } from '../context/HospitalContext';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  HeartPulse,
  Ambulance,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { hospitalInfo, setActivePage, departments, setIsAuthModalOpen, setAuthModalMode } = useHospital();

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Hospital Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  MADANPUR <span className="text-teal-400">SPECIALIZED</span>
                </h3>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Hospital &bull; Narayanganj
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Premier multi-disciplinary healthcare and surgical institution delivering compassionate, tertiary-level medical care, emergency trauma care, and state-of-the-art diagnostic facilities in Narayanganj.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{hospitalInfo?.phone || '+880 1712-345678'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{hospitalInfo?.email || 'info@madanpurhospital.com'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-teal-400" />
              <span>Quick Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  About Madanpur Hospital
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('doctors')}
                  className="hover:text-teal-300 transition-colors text-left font-medium text-teal-400"
                >
                  Find Doctors & Specialists
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('departments')}
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  Clinical Departments & ICU
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-teal-300 transition-colors text-left"
                >
                  Emergency & Contact Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAuthModalMode('admin');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-semibold pt-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Management Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical Departments */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-teal-400" />
              <span>Clinical Services</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {departments.slice(0, 7).map(dept => (
                <li key={dept.id} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>{dept.name}</span>
                </li>
              ))}
              <li className="text-teal-400 font-medium">
                <button onClick={() => handleNav('departments')} className="hover:underline">
                  + View all 10+ Departments
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency & Service Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-rose-400" />
              <span>24/7 Emergency Care</span>
            </h4>

            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700 space-y-2.5">
              <div>
                <p className="text-xs text-slate-400">Emergency & Trauma Hotline</p>
                <p className="text-sm font-bold text-amber-300">{hospitalInfo?.emergency_phone || '+880 1711-001122'}</p>
              </div>
              <div className="border-t border-slate-700/60 pt-2">
                <p className="text-xs text-slate-400">24-Hour Cardiac Ambulance</p>
                <p className="text-sm font-bold text-rose-300">{hospitalInfo?.ambulance_phone || '+880 1711-998877'}</p>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span><strong>OPD Timings:</strong> 8:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span><strong>Visiting Hours:</strong> 4:00 PM – 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} MADANPUR SPECIALIZED HOSPITAL. All Rights Reserved. Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>CSE421 Software Engineering Project</span>
            <span>&bull;</span>
            <span className="text-teal-400 font-medium">Full-Stack Hospital System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
