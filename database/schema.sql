-- ==========================================================
-- PROJECT: MADANPUR SPECIALIZED HOSPITAL
-- Database: MySQL Relational Schema
-- Address: Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh
-- CSE421 Software Engineering Project
-- ==========================================================

DROP DATABASE IF EXISTS madanpur_hospital_db;
CREATE DATABASE madanpur_hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE madanpur_hospital_db;

-- 1. Users Table (Patients & System Users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
    age INT DEFAULT 25,
    address TEXT,
    role ENUM('patient', 'admin', 'staff') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Administrators Table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'doctor_manager', 'receptionist') DEFAULT 'superadmin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Departments Table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(30) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Activity',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Doctors Table
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    photo VARCHAR(500),
    qualification VARCHAR(255) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    department_id INT NOT NULL,
    experience INT NOT NULL DEFAULT 1, -- in years
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
    biography TEXT,
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    phone VARCHAR(30),
    email VARCHAR(150),
    room_number VARCHAR(50) DEFAULT 'Room 201',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Doctor Schedules Table
CREATE TABLE doctor_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    day ENUM('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    start_time VARCHAR(10) NOT NULL, -- e.g. "17:00" or "05:00 PM"
    end_time VARCHAR(10) NOT NULL,   -- e.g. "20:00" or "08:00 PM"
    slot_duration INT DEFAULT 20,    -- in minutes
    max_patients INT DEFAULT 20,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Appointments Table
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NULL,
    doctor_id INT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(30) NOT NULL,
    patient_email VARCHAR(150),
    patient_age INT NOT NULL,
    patient_gender ENUM('Male', 'Female', 'Other') NOT NULL,
    patient_address TEXT,
    reason TEXT NOT NULL,
    notes TEXT,
    admin_notes TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Payments Table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    user_id INT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'bkash', 'nagad', 'rocket', 'card') NOT NULL,
    transaction_id VARCHAR(100) NULL,
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by VARCHAR(100) NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    appointment_id INT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'danger') DEFAULT 'info',
    status ENUM('unread', 'read') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. Hospital Information Table
CREATE TABLE hospital_information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    emergency_phone VARCHAR(50) NOT NULL,
    ambulance_phone VARCHAR(50) NOT NULL,
    opd_hours VARCHAR(100) NOT NULL,
    visiting_hours VARCHAR(100) NOT NULL,
    about TEXT NOT NULL,
    mission TEXT,
    vision TEXT,
    facilities_json JSON,
    services_json JSON,
    emergency_services_json JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 10. Contact Messages Table
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Indexes for high-speed lookups
CREATE INDEX idx_doctor_department ON doctors(department_id);
CREATE INDEX idx_doctor_status ON doctors(status);
CREATE INDEX idx_schedule_doctor_day ON doctor_schedules(doctor_id, day);
CREATE INDEX idx_appointment_doctor_date ON appointments(doctor_id, date);
CREATE INDEX idx_appointment_user ON appointments(user_id);
CREATE INDEX idx_appointment_status ON appointments(status);
