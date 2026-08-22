import React, { useState } from 'react';
import { useHospital, ActivePage } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  PhoneCall,
  User,
  ShieldCheck,
  Calendar,
  Bell,
  Menu,
  X,
  LogOut,
  Stethoscope,
  Clock,
  MapPin,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    hospitalInfo,
    activePage,
    setActivePage,
    setIsAuthModalOpen,
    setAuthModalMode,
    unreadNotifsCount,
    setBookingDoctor,
    doctors
  } = useHospital();

  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { label: string; page: ActivePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About Hospital', page: 'about' },
    { label: 'Doctors', page: 'doctors' },
    { label: 'Departments & Services', page: 'departments' },
    { label: 'Contact Us', page: 'contact' }
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickBook = () => {
    if (doctors.length > 0) {
      setBookingDoctor(doctors[0]);
    } else {
      setActivePage('doctors');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner for Emergency, Location & OPD Timings */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>OPD Consultation: 8:00 AM – 10:00 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-medium text-amber-300">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>24/7 Emergency: {hospitalInfo?.emergency_phone || '+880 1711-001122'}</span>
            </div>
            <div className="h-3 w-px bg-slate-700"></div>
            <button
              onClick={() => {
                setAuthModalMode('admin');
                setIsAuthModalOpen(true);
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Hospital Logo & Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:bg-teal-700 transition-colors">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="block text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                MADANPUR <span className="text-teal-600">SPECIALIZED</span>
              </span>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                HOSPITAL &bull; NARAYANGANJ
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activePage === item.page
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Book Appointment CTA */}
            <button
              onClick={handleQuickBook}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-md shadow-teal-600/25 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden md:block">
                    <span className="block text-xs font-semibold leading-tight text-slate-900 truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-teal-600 capitalize">
                      {user.role}
                    </span>
                  </div>
                  {unreadNotifsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isAdmin ? (
                      <button
                        onClick={() => handleNavClick('admin-dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2.5 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNavClick('patient-dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2.5 font-medium"
                      >
                        <User className="w-4 h-4 text-teal-600" />
                        <span>Patient Portal</span>
                        {unreadNotifsCount > 0 && (
                          <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {unreadNotifsCount}
                          </span>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleNavClick('patient-dashboard')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>My Appointments</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-all border border-teal-200/80"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                activePage === item.page
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={handleQuickBook}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white bg-teal-600 font-semibold text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Doctor Appointment</span>
            </button>

            {user ? (
              <div className="space-y-1.5 pt-2">
                <button
                  onClick={() => handleNavClick(isAdmin ? 'admin-dashboard' : 'patient-dashboard')}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" />
                    {isAdmin ? 'Admin Dashboard' : 'My Patient Portal'}
                  </span>
                  {unreadNotifsCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 bg-slate-100 rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl"
                >
                  Register
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setAuthModalMode('admin');
                setIsAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>Admin Management Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
