import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { api } from '../services/api';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Ambulance
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { hospitalInfo, showToast } = useHospital();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      showToast('Your message has been received by hospital reception. We will contact you soon.', 'success');
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header Bento Style */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-teal-500/20 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 Patient Support Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Contact Madanpur Specialized Hospital
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Have questions about doctor schedules, diagnostic investigations, health packages, or emergency admissions? Get in touch with our front desk team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information & Emergency Boxes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Alert Box Bento */}
          <div className="bg-rose-50 border border-rose-200/90 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/30">
                <Ambulance className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-rose-950">24/7 Emergency & ICU</h3>
                <p className="text-xs text-rose-700 font-medium">Immediate trauma & cardiac resuscitation</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3.5 bg-white rounded-2xl border border-rose-100 flex items-center justify-between shadow-xs">
                <span className="text-slate-600 font-semibold">Emergency Hotline:</span>
                <a
                  href={`tel:${hospitalInfo?.emergency_phone || '+8801711001122'}`}
                  className="font-bold text-rose-600 hover:underline"
                >
                  {hospitalInfo?.emergency_phone || '+880 1711-001122'}
                </a>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-rose-100 flex items-center justify-between shadow-xs">
                <span className="text-slate-600 font-semibold">Cardiac Ambulance:</span>
                <a
                  href={`tel:${hospitalInfo?.ambulance_phone || '+8801711998877'}`}
                  className="font-bold text-rose-600 hover:underline"
                >
                  {hospitalInfo?.ambulance_phone || '+880 1711-998877'}
                </a>
              </div>
            </div>
          </div>

          {/* Hospital General Desk Bento Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Hospital Location & Helpdesk</h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Hospital Address:</strong>
                  <span>Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <strong className="text-slate-900">General Phone: </strong>
                  <span>{hospitalInfo?.phone || '+880 1712-345678'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <strong className="text-slate-900">Email: </strong>
                  <span>{hospitalInfo?.email || 'info@madanpurhospital.com'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Consultation Hours:</strong>
                  <span>OPD Doctors: 8:00 AM – 10:00 PM</span>
                  <span className="block text-slate-500">Emergency & Pharmacy: Open 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact / Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send an Inquiry or Message</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the form below and our hospital patient relations desk will reply promptly.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message was submitted successfully. Our hospital helpdesk will get in touch with you.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamal Hossain"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. kamal@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 01712-345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Doctor schedule inquiry, CT scan fee"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Your Message or Question *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can our hospital administration assist you today?..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Hospital</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
