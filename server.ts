import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { getDb } from './server/db.js';

// Route imports
import authRoutes from './server/routes/auth.js';
import departmentRoutes from './server/routes/departments.js';
import doctorRoutes from './server/routes/doctors.js';
import scheduleRoutes from './server/routes/schedules.js';
import appointmentRoutes from './server/routes/appointments.js';
import paymentRoutes from './server/routes/payments.js';
import hospitalRoutes from './server/routes/hospital.js';
import adminRoutes from './server/routes/admin.js';
import notificationRoutes from './server/routes/notifications.js';
import contactRoutes from './server/routes/contact.js';

dotenv.config();

export async function createApp() {
  // Initialize Database
  try {
    await getDb();
    console.log('✓ Relational Database initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }

  const app = express();
  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hospital: 'MADANPUR SPECIALIZED HOSPITAL',
      location: 'Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj, Bangladesh',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/doctors', doctorRoutes);
  app.use('/api/schedules', scheduleRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/hospital', hospitalRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/contact', contactRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

async function startServer() {
  const app = await createApp();
  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🏥 MADANPUR SPECIALIZED HOSPITAL MANAGEMENT SYSTEM`);
    console.log(`📍 Abdul Mojid Plaza, Fulhor, Madanpur Bandar, Narayanganj`);
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`====================================================`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
