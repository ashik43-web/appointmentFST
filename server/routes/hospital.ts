import { Router } from 'express';
import { queryOne, run } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../auth.js';

const router = Router();

// GET Hospital Information (Public)
router.get('/', async (req, res) => {
  try {
    const info = await queryOne('SELECT * FROM hospital_information WHERE id = 1');
    if (!info) {
      return res.status(404).json({ error: 'Hospital information not found' });
    }

    // Parse JSON fields
    let facilities = [];
    let services = [];
    let emergency_services = [];
    try {
      facilities = typeof info.facilities_json === 'string' ? JSON.parse(info.facilities_json) : (info.facilities_json || []);
      services = typeof info.services_json === 'string' ? JSON.parse(info.services_json) : (info.services_json || []);
      emergency_services = typeof info.emergency_services_json === 'string' ? JSON.parse(info.emergency_services_json) : (info.emergency_services_json || []);
    } catch (e) {
      console.warn('JSON parsing error in hospital info:', e);
    }

    res.json({
      hospital: {
        ...info,
        facilities,
        services,
        emergency_services
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update Hospital Information (Admin only)
router.put('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      hospital_name,
      address,
      phone,
      email,
      emergency_phone,
      ambulance_phone,
      opd_hours,
      visiting_hours,
      about,
      mission,
      vision,
      facilities,
      services,
      emergency_services
    } = req.body;

    const facilities_json = Array.isArray(facilities) ? JSON.stringify(facilities) : facilities;
    const services_json = Array.isArray(services) ? JSON.stringify(services) : services;
    const emergency_services_json = Array.isArray(emergency_services) ? JSON.stringify(emergency_services) : emergency_services;

    await run(
      `UPDATE hospital_information SET
        hospital_name = ?, address = ?, phone = ?, email = ?, emergency_phone = ?,
        ambulance_phone = ?, opd_hours = ?, visiting_hours = ?, about = ?,
        mission = ?, vision = ?, facilities_json = ?, services_json = ?, emergency_services_json = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [
        hospital_name,
        address,
        phone,
        email,
        emergency_phone,
        ambulance_phone,
        opd_hours,
        visiting_hours,
        about,
        mission,
        vision,
        facilities_json,
        services_json,
        emergency_services_json
      ]
    );

    const updated = await queryOne('SELECT * FROM hospital_information WHERE id = 1');
    res.json({ message: 'Hospital information updated successfully', hospital: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
