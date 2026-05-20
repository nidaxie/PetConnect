const express = require('express');
const { getDb } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/stats', (req, res) => {
  try {
    const db = getDb();

    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role != 'admin'").get().count;
    const activeUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role != 'admin' AND is_active = 1").get().count;
    const totalShelters = db.prepare("SELECT COUNT(*) as count FROM shelters").get().count;
    const pendingShelters = db.prepare("SELECT COUNT(*) as count FROM shelters WHERE status = 'pending'").get().count;
    const totalListings = db.prepare("SELECT COUNT(*) as count FROM pets").get().count;
    const activeListings = db.prepare("SELECT COUNT(*) as count FROM pets WHERE status = 'active'").get().count;
    const totalAdoptions = db.prepare("SELECT COUNT(*) as count FROM pets WHERE status = 'adopted'").get().count;

    const activities = db.prepare('SELECT * FROM activities ORDER BY created_at DESC LIMIT 20').all();

    res.json({ totalUsers, activeUsers, totalShelters, pendingShelters, totalListings, activeListings, totalAdoptions, activities });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'İstatistikler alınırken hata oluştu' });
  }
});

router.get('/users', (req, res) => {
  try {
    const db = getDb();
    const { search, role } = req.query;
    let query = "SELECT id, name, email, role, is_active, created_at FROM users WHERE 1=1";
    const params = [];

    if (search) { query += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (role) { query += ' AND role = ?'; params.push(role); }

    query += ' ORDER BY created_at DESC';

    const users = db.prepare(query).all(...params);
    res.json(users);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Kullanıcılar alınırken hata oluştu' });
  }
});

router.put('/users/:id', (req, res) => {
  try {
    const db = getDb();
    const { is_active, role } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    if (is_active !== undefined) db.prepare('UPDATE users SET is_active = ? WHERE id = ?').run(is_active ? 1 : 0, req.params.id);
    if (role) db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);

    const updated = db.prepare('SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ error: 'Kullanıcı güncellenirken hata oluştu' });
  }
});

router.get('/shelters', (req, res) => {
  try {
    const db = getDb();
    const { status, search } = req.query;
    let query = 'SELECT s.*, u.name as applicant_name, u.email as applicant_email FROM shelters s LEFT JOIN users u ON u.id = s.user_id WHERE 1=1';
    const params = [];

    if (status) { query += ' AND s.status = ?'; params.push(status); }
    if (search) { query += ' AND s.name LIKE ?'; params.push(`%${search}%`); }

    query += ' ORDER BY s.joined_date DESC';

    const shelters = db.prepare(query).all(...params);
    res.json(shelters);
  } catch (err) {
    console.error('Admin shelters error:', err);
    res.status(500).json({ error: 'Barınaklar alınırken hata oluştu' });
  }
});

router.put('/shelters/:id/approve', (req, res) => {
  try {
    const db = getDb();
    const shelter = db.prepare('SELECT * FROM shelters WHERE id = ?').get(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'Barınak bulunamadı' });

    db.prepare("UPDATE shelters SET status = 'approved', verified = 1 WHERE id = ?").run(req.params.id);
    db.prepare("UPDATE users SET role = 'shelter' WHERE id = ?").run(shelter.user_id);
    db.prepare(`INSERT INTO activities (type, action, entity_name) VALUES ('shelter', 'Barınak onaylandı', ?)`).run(shelter.name);

    res.json({ success: true, message: 'Barınak onaylandı' });
  } catch (err) {
    console.error('Approve shelter error:', err);
    res.status(500).json({ error: 'Barınak onaylanırken hata oluştu' });
  }
});

router.put('/shelters/:id/reject', (req, res) => {
  try {
    const db = getDb();
    const shelter = db.prepare('SELECT * FROM shelters WHERE id = ?').get(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'Barınak bulunamadı' });

    db.prepare("UPDATE shelters SET status = 'rejected' WHERE id = ?").run(req.params.id);
    db.prepare(`INSERT INTO activities (type, action, entity_name) VALUES ('shelter', 'Barınak reddedildi', ?)`).run(shelter.name);

    res.json({ success: true, message: 'Barınak reddedildi' });
  } catch (err) {
    console.error('Reject shelter error:', err);
    res.status(500).json({ error: 'Barınak reddedilirken hata oluştu' });
  }
});

router.get('/listings', (req, res) => {
  try {
    const db = getDb();
    const { status, type, search } = req.query;
    let query = "SELECT p.*, GROUP_CONCAT(pi.url) as image_urls FROM pets p LEFT JOIN pet_images pi ON pi.pet_id = p.id WHERE 1=1";
    const params = [];

    if (status) { query += ' AND p.status = ?'; params.push(status); }
    if (type) { query += ' AND p.type = ?'; params.push(type); }
    if (search) { query += ' AND (p.name LIKE ? OR p.breed LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const pets = db.prepare(query).all(...params);
    const enriched = pets.map(p => ({
      ...p,
      images: p.image_urls ? p.image_urls.split(',') : ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'],
      vaccinated: p.vaccinated === 1,
      neutered: p.neutered === 1
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Admin listings error:', err);
    res.status(500).json({ error: 'İlanlar alınırken hata oluştu' });
  }
});

router.put('/listings/:id', (req, res) => {
  try {
    const db = getDb();
    const { status, featured } = req.body;
    const pet = db.prepare('SELECT id FROM pets WHERE id = ?').get(req.params.id);
    if (!pet) return res.status(404).json({ error: 'İlan bulunamadı' });

    if (status !== undefined) db.prepare('UPDATE pets SET status = ? WHERE id = ?').run(status, req.params.id);
    if (featured !== undefined) db.prepare('UPDATE pets SET featured = ? WHERE id = ?').run(featured ? 1 : 0, req.params.id);

    const updated = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Admin update listing error:', err);
    res.status(500).json({ error: 'İlan güncellenirken hata oluştu' });
  }
});

router.delete('/listings/:id', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM pets WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete listing error:', err);
    res.status(500).json({ error: 'İlan silinirken hata oluştu' });
  }
});

module.exports = router;
