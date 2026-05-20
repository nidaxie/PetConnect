const express = require('express');
const { getDb } = require('../db');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

function enrichShelter(shelter) {
  shelter.verified = shelter.verified === 1;
  return shelter;
}

router.get('/', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const { city, search, verified } = req.query;

    let query = "SELECT * FROM shelters WHERE status = 'approved'";
    const params = [];

    if (city) { query += ' AND city = ?'; params.push(city); }
    if (search) { query += ' AND name LIKE ?'; params.push(`%${search}%`); }
    if (verified === 'true') { query += ' AND verified = 1'; }

    query += ' ORDER BY verified DESC, adopted_count DESC';

    const shelters = db.prepare(query).all(...params);
    res.json(shelters.map(enrichShelter));
  } catch (err) {
    console.error('Get shelters error:', err);
    res.status(500).json({ error: 'Barınaklar alınırken hata oluştu' });
  }
});

router.get('/:id', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const shelter = db.prepare('SELECT * FROM shelters WHERE id = ?').get(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'Barınak bulunamadı' });

    const totalPets = db.prepare("SELECT COUNT(*) as count FROM pets WHERE owner_id = ? AND owner_type = 'shelter' AND status = 'active'").get(req.params.id);
    shelter.total_pets = totalPets.count;

    res.json(enrichShelter(shelter));
  } catch (err) {
    console.error('Get shelter error:', err);
    res.status(500).json({ error: 'Barınak alınırken hata oluştu' });
  }
});

router.put('/:id', authenticate, (req, res) => {
  try {
    const db = getDb();
    const shelter = db.prepare('SELECT * FROM shelters WHERE id = ?').get(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'Barınak bulunamadı' });

    if (shelter.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    const { name, city, district, address, phone, email, description, cover_image, capacity } = req.body;

    db.prepare(`
      UPDATE shelters SET name=?, city=?, district=?, address=?, phone=?, email=?, description=?, cover_image=?, capacity=?
      WHERE id=?
    `).run(
      name || shelter.name, city || shelter.city, district || shelter.district,
      address || shelter.address, phone || shelter.phone, email || shelter.email,
      description || shelter.description, cover_image || shelter.cover_image,
      capacity ? parseInt(capacity) : shelter.capacity, req.params.id
    );

    const updated = db.prepare('SELECT * FROM shelters WHERE id = ?').get(req.params.id);
    res.json(enrichShelter(updated));
  } catch (err) {
    console.error('Update shelter error:', err);
    res.status(500).json({ error: 'Barınak güncellenirken hata oluştu' });
  }
});

module.exports = router;
