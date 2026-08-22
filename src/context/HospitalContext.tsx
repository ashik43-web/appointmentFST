import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HospitalInfo, Department, Doctor, NotificationItem } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

export type ActivePage =
  | 'home'
  | 'doctors'
  | 'departments'
  | 'about'
  | 'contact'
  | 'patient-dashboard'
  | 'admin-dashboard';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface HospitalContextType {
  hospitalInfo: HospitalInfo | null;
  departments: Department[];
  doctors: Doctor[];
  loading: boolean;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  bookingDoctor: Doctor | null;
  setBookingDoctor: (doctor: Doctor | null) => void;
  selectedDoctorDetail: Doctor | null;
  setSelectedDoctorDetail: (doctor: Doctor | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'admin';
  setAuthModalMode: (mode: 'login' | 'register' | 'admin') => void;
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  refreshHospitalData: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  navigateToDoctorBooking: (doctor: Doctor) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState<Doctor | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin'>('login');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshHospitalData = useCallback(async () => {
    try {
      const [hRes, dRes, docRes] = await Promise.all([
        api.getHospitalInfo(),
        api.getDepartments('active'),
        api.getDoctors({ status: 'active' })
      ]);
      setHospitalInfo(hRes.hospital);
      setDepartments(dRes.departments);
      setDoctors(docRes.doctors);
    } catch (err) {
      console.error('Error refreshing hospital data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadNotifsCount(0);
      return;
    }
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
      setUnreadNotifsCount(res.unreadCount);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    refreshHospitalData();
  }, [refreshHospitalData]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const navigateToDoctorBooking = (doctor: Doctor) => {
    setBookingDoctor(doctor);
  };

  return (
    <HospitalContext.Provider
      value={{
        hospitalInfo,
        departments,
        doctors,
        loading,
        activePage,
        setActivePage,
        bookingDoctor,
        setBookingDoctor,
        selectedDoctorDetail,
        setSelectedDoctorDetail,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        notifications,
        unreadNotifsCount,
        refreshHospitalData,
        refreshNotifications,
        toasts,
        showToast,
        removeToast,
        navigateToDoctorBooking
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}
