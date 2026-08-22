-- ==========================================================
-- PROJECT: MADANPUR SPECIALIZED HOSPITAL
-- Database: MySQL Seed Data (Realistic Demo Data)
-- Address: Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh
-- ==========================================================

USE madanpur_hospital_db;

-- 1. Default Admin & Demo Patient Users (Password hash for 'admin123' and 'user123')
INSERT INTO admins (id, name, email, password, role) VALUES
(1, 'Hospital Administrator', 'admin@madanpurhospital.com', '$2a$10$w09aJt1hWzE6JjD1c3mBLeIkgJ87oYnK6a60zBZZJ2R4o.NfM40s.', 'superadmin');

INSERT INTO users (id, name, email, phone, password, gender, age, address, role) VALUES
(1, 'Dr. Administrator', 'admin@madanpurhospital.com', '+8801711223344', '$2a$10$w09aJt1hWzE6JjD1c3mBLeIkgJ87oYnK6a60zBZZJ2R4o.NfM40s.', 'Male', 38, 'Madanpur, Narayanganj', 'admin'),
(2, 'Ahmed Tasrik', 'ahmedtasrik1@gmail.com', '+8801812345678', '$2a$10$7vMkW/FhZ2J95k2yK1aC/.y0Tq4M2z3R1m9P1X5l8g3v0m8aY1yS2', 'Male', 24, 'Bandar, Narayanganj, Bangladesh', 'patient'),
(3, 'Kazi Farhana', 'farhana.k@gmail.com', '+8801912345678', '$2a$10$7vMkW/FhZ2J95k2yK1aC/.y0Tq4M2z3R1m9P1X5l8g3v0m8aY1yS2', 'Female', 29, 'Chashara, Narayanganj', 'patient'),
(4, 'Md. Rafiqul Islam', 'rafiq.islam@yahoo.com', '+8801712987654', '$2a$10$7vMkW/FhZ2J95k2yK1aC/.y0Tq4M2z3R1m9P1X5l8g3v0m8aY1yS2', 'Male', 52, 'Madanpur Bus Stand, Narayanganj', 'patient');

-- 2. Hospital Information
INSERT INTO hospital_information (
    id, hospital_name, address, phone, email, emergency_phone, ambulance_phone,
    opd_hours, visiting_hours, about, mission, vision,
    facilities_json, services_json, emergency_services_json
) VALUES (
    1,
    'MADANPUR SPECIALIZED HOSPITAL',
    'Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh',
    '+880 1712-345678 / +880 1912-987654',
    'info@madanpurhospital.com',
    '+880 1711-001122 (24/7 Hotline)',
    '+880 1711-998877 (24 Hours Ambulance)',
    'Saturday – Friday: 08:00 AM – 10:00 PM (OPD Consultation)',
    'Daily: 04:00 PM – 07:00 PM',
    'Madanpur Specialized Hospital is a premier multi-disciplinary medical healthcare institution established in Narayanganj to deliver tertiary-level medical care, diagnostics, and modern surgical facilities. Situated conveniently at Abdul Mojid Plaza, Madanpur Bandar, we connect the community to renowned specialized physicians, emergency trauma care, and world-class diagnostic technologies.',
    'To provide compassionate, patient-centered healthcare with clinical excellence, modern infrastructure, and affordable services for all sections of society in Narayanganj and surrounding regions.',
    'To become the most trusted regional healthcare center of excellence in Bangladesh through modern medical technology, ethical medical practice, and continuous patient care innovation.',
    '["24/7 Intensive Care Unit (ICU & CCU)", "Modern Operation Theatres with Laminar Air Flow", "128-Slice CT Scan & 1.5 Tesla MRI", "Automated Clinical Pathology & Biochemistry Lab", "Digital 500mA X-Ray & 4D Color Doppler USG", "Hemodialysis Unit (6 Beds)", "24-Hour Pharmacy & Blood Bank", "Emergency Trauma & Resuscitation Center", "Executive Health Check-up Lounge", "Air-Conditioned Inpatient Cabins & General Wards"]',
    '["Specialist Outpatient Consultation (OPD)", "Inpatient Hospitalization & Critical Care", "Minimally Invasive & Laparoscopic Surgery", "Comprehensive Cardiac Care & ECG/Echocardiography", "Mother & Child Care Unit with NICU", "Orthopedic Fracture & Joint Replacement", "Endoscopy, Colonoscopy & Gastrology", "Pediatric Intensive Care & Immunization", "Dental Surgery & Orthodontics", "Physiotherapy & Rehabilitation Center"]',
    '["24-Hour Emergency Medical Officer on Duty", "Trauma & Accident Emergency Resuscitation", "Acute Coronary Care & Emergency Stroke Protocol", "Dedicated 24/7 Cardiac Ambulance Fleet with Ventilator Support", "Emergency Blood Transfusion Support"]'
);

-- 3. Departments
INSERT INTO departments (id, name, code, description, icon, status) VALUES
(1, 'General & Internal Medicine', 'MED', 'Comprehensive diagnosis, management of hypertension, diabetes, infectious diseases and multi-system illness.', 'Stethoscope', 'active'),
(2, 'Cardiology & Heart Care', 'CARD', 'Expert cardiac evaluation, hypertension management, ECG, Echocardiogram, and preventive heart care.', 'HeartPulse', 'active'),
(3, 'Dermatology & Venereology', 'DERM', 'Specialized treatment for skin allergies, eczema, acne, psoriasis, hair loss, and cosmetic dermatology.', 'Sparkles', 'active'),
(4, 'Orthopedics & Trauma Surgery', 'ORTH', 'Bone fractures, arthritis, joint pain, spine care, and arthroscopic surgical procedures.', 'Bone', 'active'),
(5, 'Pediatrics & Child Health', 'PED', 'Child development, pediatric infectious diseases, neonatology, and routine vaccination.', 'Baby', 'active'),
(6, 'Gynecology & Obstetrics', 'GYN', 'Antenatal checkups, safe maternity delivery, infertility management, and women health screenings.', 'UserCheck', 'active'),
(7, 'ENT & Head Neck Surgery', 'ENT', 'Ear infections, sinusitis, throat disorders, tonsil surgery, and hearing evaluations.', 'Headphones', 'active'),
(8, 'General & Laparoscopic Surgery', 'SURG', 'Appendix, gallstones, hernia, colorectal surgery, and advanced minimally invasive procedures.', 'Scissors', 'active'),
(9, 'Neurology & Brain Care', 'NEUR', 'Stroke care, migraine, epilepsy, neuropathies, Parkinson disease, and nerve disorders.', 'Brain', 'active'),
(10, 'Dental & Maxillofacial Care', 'DENT', 'Root canal therapy, dental implants, scaling, cosmetic teeth whitening, and oral surgery.', 'Smile', 'active');

-- 4. Doctors (10+ Specialized Doctors)
INSERT INTO doctors (id, name, photo, qualification, specialization, department_id, experience, gender, biography, consultation_fee, phone, email, room_number, status) VALUES
(1, 'Prof. Dr. M. A. Rahman', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80', 'MBBS, FCPS (Medicine), MACP (USA)', 'Senior Consultant, Internal Medicine', 1, 18, 'Male', 'Prof. Dr. M. A. Rahman is a renowned medicine specialist with over 18 years of clinical experience in leading tertiary hospitals. Specializes in complicated diabetes, fever of unknown origin, and rheumatology.', 900.00, '+8801711122331', 'dr.rahman@madanpurhospital.com', 'Room 201 (2nd Floor)', 'active'),

(2, 'Dr. Syeda Tahmina Akter', 'https://images.unsplash.com/photo-1594824813591-154522961d15?w=600&auto=format&fit=crop&q=80', 'MBBS, FCPS (Medicine), MD (Internal Medicine)', 'Consultant, Medicine & Diabetes', 1, 11, 'Female', 'Dr. Tahmina is an experienced physician focusing on lifestyle diseases, metabolic syndrome, thyroid disorders, and acute geriatric care with exceptional patient rapport.', 700.00, '+8801711122332', 'dr.tahmina@madanpurhospital.com', 'Room 202 (2nd Floor)', 'active'),

(3, 'Dr. Kazi Mahfuzur Alam', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80', 'MBBS, D-Card (NICVD), MD (Cardiology)', 'Consultant Cardiologist & Heart Specialist', 2, 14, 'Male', 'Specialist in non-invasive cardiology, heart failure, ischemic heart disease, and 24-hour ambulatory blood pressure monitoring.', 1000.00, '+8801711122333', 'dr.mahfuz@madanpurhospital.com', 'Room 205 (Cardiac Center)', 'active'),

(4, 'Dr. Nusrat Jahan Chowdhury', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80', 'MBBS, DDV (BSMMU), FCPS (Dermatology)', 'Skin, Allergy, Hair & Aesthetic Specialist', 3, 9, 'Female', 'Expert in chronic dermatosis, fungal infections, acne scar treatments, vitiligo, hair restoration therapy, and laser skincare.', 800.00, '+8801711122334', 'dr.nusrat@madanpurhospital.com', 'Room 301 (3rd Floor)', 'active'),

(5, 'Dr. Tariqul Hasan', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80', 'MBBS, MS (Orthopedics - NITOR), AO Spine Fellow', 'Orthopedic, Trauma & Spine Surgeon', 4, 15, 'Male', 'Highly skilled in complex trauma reconstruction, total knee/hip arthroplasty, sciatica relief, and sports ligament reconstruction.', 900.00, '+8801711122335', 'dr.tariqul@madanpurhospital.com', 'Room 305 (3rd Floor)', 'active'),

(6, 'Dr. Farhana Yasmin', 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&auto=format&fit=crop&q=80', 'MBBS, DCH (Dhaka Shishu Hospital), FCPS (Pediatrics)', 'Child Health & Neonatal Specialist', 5, 12, 'Female', 'Dedicated pediatrician specializing in newborn critical care, pediatric asthma, childhood nutrition, growth milestones, and routine immunization.', 700.00, '+8801711122336', 'dr.farhana@madanpurhospital.com', 'Room 208 (Child Health Wing)', 'active'),

(7, 'Dr. Bilkis Banu', 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=600&auto=format&fit=crop&q=80', 'MBBS, DGO, FCPS (Obs & Gynae)', 'Obstetrician, Gynecologist & Laparoscopic Surgeon', 6, 16, 'Female', 'Specializes in high-risk pregnancy management, painless normal deliveries, cesarean sections, fibroid removal, and PCOS management.', 850.00, '+8801711122337', 'dr.bilkis@madanpurhospital.com', 'Room 210 (Women Clinic)', 'active'),

(8, 'Dr. Ashraful Hoque', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&auto=format&fit=crop&q=80', 'MBBS, DLO, MS (ENT - BSMMU)', 'ENT & Head-Neck Specialist Surgeon', 7, 10, 'Male', 'Expert in micro-ear surgery, endoscopic sinus surgery (FESS), tonsillectomy, vocal cord polyp surgery, and vertigo treatment.', 750.00, '+8801711122338', 'dr.ashraf@madanpurhospital.com', 'Room 308 (3rd Floor)', 'active'),

(9, 'Dr. S. M. Tanveer Hossain', 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=600&auto=format&fit=crop&q=80', 'MBBS, FCPS (Surgery), MRCS (Edinburgh, UK)', 'General & Advanced Laparoscopic Surgeon', 8, 13, 'Male', 'Performs laparoscopic cholecystectomy (gallbladder), hernia repair, appendix removal, thyroid surgery, and colorectal procedures with fast recovery.', 900.00, '+8801711122339', 'dr.tanveer@madanpurhospital.com', 'Room 312 (Surgical Clinic)', 'active'),

(10, 'Dr. Shahreen Akhter', 'https://images.unsplash.com/photo-1594824813603-ee838882834b?w=600&auto=format&fit=crop&q=80', 'BDS (Dhaka Dental College), PGT (Oral Surgery)', 'Dental Surgeon & Cosmetic Orthodontist', 10, 8, 'Female', 'Comprehensive dental care including painless root canal treatments, porcelain crowns, composite aesthetic fillings, teeth scaling, and smile makeover.', 600.00, '+8801711122340', 'dr.shahreen@madanpurhospital.com', 'Room 105 (Dental Wing)', 'active');

-- 5. Doctor Schedules (Weekly recurring slots)
INSERT INTO doctor_schedules (id, doctor_id, day, start_time, end_time, slot_duration, max_patients, status) VALUES
-- Dr. Rahman (Medicine)
(1, 1, 'Saturday', '17:00', '20:30', 20, 15, 'active'),
(2, 1, 'Monday', '17:00', '20:30', 20, 15, 'active'),
(3, 1, 'Wednesday', '17:00', '20:30', 20, 15, 'active'),

-- Dr. Tahmina (Medicine)
(4, 2, 'Sunday', '16:00', '19:30', 20, 12, 'active'),
(5, 2, 'Tuesday', '16:00', '19:30', 20, 12, 'active'),
(6, 2, 'Thursday', '16:00', '19:30', 20, 12, 'active'),

-- Dr. Mahfuz (Cardiology)
(7, 3, 'Saturday', '18:00', '21:00', 20, 12, 'active'),
(8, 3, 'Sunday', '18:00', '21:00', 20, 12, 'active'),
(9, 3, 'Tuesday', '18:00', '21:00', 20, 12, 'active'),
(10, 3, 'Thursday', '18:00', '21:00', 20, 12, 'active'),

-- Dr. Nusrat (Dermatology)
(11, 4, 'Saturday', '16:00', '19:00', 20, 10, 'active'),
(12, 4, 'Monday', '16:00', '19:00', 20, 10, 'active'),
(13, 4, 'Wednesday', '16:00', '19:00', 20, 10, 'active'),

-- Dr. Tariqul (Orthopedics)
(14, 5, 'Sunday', '17:30', '21:00', 20, 12, 'active'),
(15, 5, 'Tuesday', '17:30', '21:00', 20, 12, 'active'),
(16, 5, 'Thursday', '17:30', '21:00', 20, 12, 'active'),

-- Dr. Farhana (Pediatrics)
(17, 6, 'Saturday', '16:30', '19:30', 20, 12, 'active'),
(18, 6, 'Monday', '16:30', '19:30', 20, 12, 'active'),
(19, 6, 'Wednesday', '16:30', '19:30', 20, 12, 'active'),
(20, 6, 'Friday', '09:30', '12:30', 20, 10, 'active'),

-- Dr. Bilkis (Gynae)
(21, 7, 'Saturday', '15:00', '18:30', 20, 14, 'active'),
(22, 7, 'Sunday', '15:00', '18:30', 20, 14, 'active'),
(23, 7, 'Tuesday', '15:00', '18:30', 20, 14, 'active'),
(24, 7, 'Thursday', '15:00', '18:30', 20, 14, 'active'),

-- Dr. Ashraf (ENT)
(25, 8, 'Monday', '17:00', '20:00', 20, 12, 'active'),
(26, 8, 'Wednesday', '17:00', '20:00', 20, 12, 'active'),
(27, 8, 'Thursday', '17:00', '20:00', 20, 12, 'active'),

-- Dr. Tanveer (Surgery)
(28, 9, 'Sunday', '18:00', '21:00', 20, 10, 'active'),
(29, 9, 'Tuesday', '18:00', '21:00', 20, 10, 'active'),
(30, 9, 'Wednesday', '18:00', '21:00', 20, 10, 'active'),

-- Dr. Shahreen (Dental)
(31, 10, 'Saturday', '16:00', '20:00', 30, 8, 'active'),
(32, 10, 'Monday', '16:00', '20:00', 30, 8, 'active'),
(33, 10, 'Wednesday', '16:00', '20:00', 30, 8, 'active');

-- 6. Sample Appointments
INSERT INTO appointments (id, appointment_number, user_id, doctor_id, date, time, patient_name, patient_phone, patient_email, patient_age, patient_gender, patient_address, reason, notes, admin_notes, status, created_at) VALUES
(1, 'MSH-2026-0001', 2, 1, '2026-08-26', '05:20 PM', 'Ahmed Tasrik', '+8801812345678', 'ahmedtasrik1@gmail.com', 24, 'Male', 'Bandar, Narayanganj', 'Frequent fever and general weakness for 5 days', 'Previous prescription attached', 'Confirmed by reception. Room 201 notified.', 'confirmed', '2026-08-21 10:30:00'),
(2, 'MSH-2026-0002', 3, 4, '2026-08-26', '04:40 PM', 'Kazi Farhana', '+8801912345678', 'farhana.k@gmail.com', 29, 'Female', 'Chashara, Narayanganj', 'Severe allergic skin rash on hands and neck', 'No previous drug allergy', 'Awaiting patient arrival. bKash verified.', 'confirmed', '2026-08-21 11:15:00'),
(3, 'MSH-2026-0003', 4, 3, '2026-08-25', '06:20 PM', 'Md. Rafiqul Islam', '+8801712987654', 'rafiq.islam@yahoo.com', 52, 'Male', 'Madanpur Bus Stand, Narayanganj', 'High blood pressure fluctuations and chest tightness during brisk walking', 'Routine cardiac review', 'Called patient to confirm fasting ECG requirements.', 'pending', '2026-08-22 09:00:00');

-- 7. Sample Payments
INSERT INTO payments (id, appointment_id, user_id, amount, payment_method, transaction_id, status, payment_date, verified_by) VALUES
(1, 1, 2, 900.00, 'bkash', 'BK98X7A621', 'paid', '2026-08-21 10:32:00', 'SuperAdmin'),
(2, 2, 3, 800.00, 'nagad', 'NG34B981C0', 'paid', '2026-08-21 11:18:00', 'SuperAdmin'),
(3, 3, 4, 1000.00, 'cash', 'CASH-PAY-AT-HOSPITAL', 'pending', '2026-08-22 09:02:00', NULL);

-- 8. Sample Notifications
INSERT INTO notifications (id, user_id, appointment_id, title, message, type, status, created_at) VALUES
(1, 2, 1, 'Appointment Confirmed', 'Your appointment (MSH-2026-0001) with Prof. Dr. M. A. Rahman on 2026-08-26 at 05:20 PM has been confirmed. Please arrive 15 minutes before time at Room 201.', 'success', 'unread', '2026-08-21 10:35:00'),
(2, 3, 2, 'bKash Payment Received', 'We received your fee payment of ৳800 for appointment MSH-2026-0002. Your slot with Dr. Nusrat Jahan is confirmed.', 'success', 'read', '2026-08-21 11:20:00'),
(3, 4, 3, 'Appointment Request Submitted', 'Your appointment request MSH-2026-0003 with Dr. Kazi Mahfuzur Alam has been received and is pending hospital confirmation.', 'info', 'unread', '2026-08-22 09:05:00');

-- 9. Contact Messages
INSERT INTO contact_messages (id, name, email, phone, subject, message, status) VALUES
(1, 'Tanvir Mahmud', 'tanvir.m@gmail.com', '+8801700112233', 'Inquiry regarding 128-Slice CT Scan availability', 'Hello, do you perform CT Angiography on Fridays at Madanpur Specialized Hospital? Please inform me of the test preparation.', 'read');
