const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const db = getDb();
    const {
      email, password, name, userType,
      shelterName, shelterPhone, shelterAddress, shelterCity,
      shelterDistrict, shelterDescription, shelterCapacity, taxNumber
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Tüm zorunlu alanlar doldurulmalıdır' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Şifre en az 8 karakter olmalıdır' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Bu e-posta adresi zaten kayıtlı' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const role = userType === 'shelter' ? 'shelter' : 'user';

    db.prepare(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, name, email, passwordHash, role);

    if (userType === 'shelter') {
      const shelterId = uuidv4();
      db.prepare(`
        INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, description, capacity, tax_number, status, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0)
      `).run(
        shelterId, userId,
        shelterName || name,
        shelterCity || '',
        shelterDistrict || '',
        shelterAddress || '',
        shelterPhone || '',
        email,
        shelterDescription || '',
        shelterCapacity ? parseInt(shelterCapacity) : null,
        taxNumber || ''
      );

      db.prepare(`INSERT INTO activities (type, action, entity_name, user_id) VALUES ('shelter', 'Barınak başvurusu yapıldı', ?, ?)`).run(shelterName || name, userId);
    }

    db.prepare(`INSERT INTO activities (type, action, entity_name, user_id) VALUES ('user', 'Yeni kullanıcı kaydı', ?, ?)`).run(name, userId);

    const token = jwt.sign({ id: userId, email, name, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: userId, name, email, role }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const db = getDb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre gerekli' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Hesabınız askıya alınmış' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
  }
});

router.get('/me', authenticate, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

  let shelter = null;
  if (user.role === 'shelter') {
    shelter = db.prepare('SELECT * FROM shelters WHERE user_id = ?').get(user.id);
  }

  res.json({ user, shelter });
});

module.exports = router;
