const { pool } = require('../config/db');

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800';

async function enrichPet(pet) {
  const imgRes = await pool.query(
    'SELECT url FROM pet_images WHERE pet_id = $1 ORDER BY sort_order ASC, is_primary DESC',
    [pet.id]
  );
  pet.images = imgRes.rows.length > 0 ? imgRes.rows.map(r => r.url) : [DEFAULT_IMG];

  if (pet.owner_type === 'shelter') {
    const sr = await pool.query('SELECT id, name, phone, email FROM shelters WHERE id = $1', [pet.owner_id]);
    if (sr.rows[0]) {
      pet.ownerName = sr.rows[0].name; pet.ownerPhone = sr.rows[0].phone;
      pet.ownerEmail = sr.rows[0].email; pet.ownerId = sr.rows[0].id;
    } else { pet.ownerName = 'Barınak'; pet.ownerId = pet.owner_id; }
  } else {
    const ur = await pool.query('SELECT name, email FROM users WHERE id = $1', [pet.owner_id]);
    if (ur.rows[0]) { pet.ownerName = ur.rows[0].name; pet.ownerEmail = ur.rows[0].email; }
    else { pet.ownerName = 'Bilinmiyor'; }
    pet.ownerId = pet.owner_id;
  }
  return pet;
}

async function list(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT p.* FROM pets p
       INNER JOIN favorites f ON f.pet_id = p.id
       WHERE f.user_id = $1 AND p.status = 'active'
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    const enriched = await Promise.all(rows.map(p => enrichPet(p)));
    res.json(enriched);
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: 'Favoriler alınırken hata oluştu' });
  }
}

async function add(req, res) {
  try {
    const pet = await pool.query('SELECT id FROM pets WHERE id = $1', [req.params.petId]);
    if (!pet.rows[0]) return res.status(404).json({ error: 'İlan bulunamadı' });

    await pool.query(
      'INSERT INTO favorites (user_id, pet_id) VALUES ($1,$2) ON CONFLICT (user_id, pet_id) DO NOTHING',
      [req.user.id, req.params.petId]
    );
    res.json({ favorited: true });
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ error: 'Favorilere eklenirken hata oluştu' });
  }
}

async function remove(req, res) {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND pet_id = $2',
      [req.user.id, req.params.petId]
    );
    res.json({ favorited: false });
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ error: 'Favorilerden çıkarılırken hata oluştu' });
  }
}

async function check(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND pet_id = $2',
      [req.user.id, req.params.petId]
    );
    res.json({ favorited: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: 'Hata oluştu' });
  }
}

module.exports = { list, add, remove, check };
