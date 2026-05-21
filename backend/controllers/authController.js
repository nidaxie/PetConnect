const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

async function register(req, res) {
  try {
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

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Bu e-posta adresi zaten kayıtlı' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const role   = userType === 'shelter' ? 'shelter' : 'user';

    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1,$2,$3,$4,$5)',
      [userId, name, email, passwordHash, role]
    );

    if (userType === 'shelter') {
      const shelterId = uuidv4();
      await pool.query(
        `INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, description, capacity, tax_number, status, verified)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending',false)`,
        [shelterId, userId, shelterName || name, shelterCity || '', shelterDistrict || '',
         shelterAddress || '', shelterPhone || '', email, shelterDescription || '',
         shelterCapacity ? parseInt(shelterCapacity) : null, taxNumber || '']
      );
      await pool.query(
        "INSERT INTO activities (type, action, entity_name, user_id) VALUES ('shelter','Barınak başvurusu yapıldı',$1,$2)",
        [shelterName || name, userId]
      );
    }

    await pool.query(
      "INSERT INTO activities (type, action, entity_name, user_id) VALUES ('user','Yeni kullanıcı kaydı',$1,$2)",
      [name, userId]
    );

    const token = jwt.sign({ id: userId, email, name, role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, name, email, role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta ve şifre gerekli' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user   = result.rows[0];
    if (!user) return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
    if (!user.is_active) return res.status(403).json({ error: 'Hesabınız askıya alınmış' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'E-posta veya şifre hatalı' });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
  }
}

async function me(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, phone, city, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    let shelter = null;
    if (rows[0].role === 'shelter') {
      const sr = await pool.query('SELECT * FROM shelters WHERE user_id = $1', [req.user.id]);
      shelter = sr.rows[0] || null;
    }
    res.json({ user: rows[0], shelter });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Kullanıcı bilgileri alınamadı' });
  }
}

module.exports = { register, login, me };
