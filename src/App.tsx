import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { AboutHospitalPage } from './pages/AboutHospitalPage';
import { ContactPage } from './pages/ContactPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DoctorModal } from './components/DoctorModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { AuthModal } from './pages/AuthModal';

const MainContent: React.FC = () => {
  const { activePage } = useHospital();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'doctors' && <DoctorsPage />}
        {activePage === 'departments' && <DepartmentsPage />}
        {activePage === 'about' && <AboutHospitalPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'patient-dashboard' && <PatientDashboardPage />}
        {activePage === 'admin-dashboard' && <AdminDashboardPage />}
      </main>

      <Footer />

      {/* Global Interactive Modals */}
      <DoctorModal />
      <AppointmentBookingModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HospitalProvider>
        <MainContent />
      </HospitalProvider>
    </AuthProvider>
  );
}
