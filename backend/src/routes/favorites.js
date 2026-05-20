const express = require('express');
const { getDb } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

function enrichPet(pet, db) {
  const images = db.prepare('SELECT url FROM pet_images WHERE pet_id = ? ORDER BY sort_order').all(pet.id);
  pet.images = images.map(i => i.url);
  if (pet.images.length === 0) pet.images = ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'];
  pet.vaccinated = pet.vaccinated === 1;
  pet.neutered = pet.neutered === 1;
  pet.featured = pet.featured === 1;

  if (pet.owner_type === 'shelter') {
    const s = db.prepare('SELECT s.id, s.name, s.phone, s.email FROM shelters s WHERE s.user_id = ? OR s.id = ?').get(pet.owner_id, pet.owner_id);
    if (s) { pet.ownerName = s.name; pet.ownerPhone = s.phone; pet.ownerEmail = s.email; pet.ownerId = s.id; }
    else { pet.ownerName = 'Barınak'; pet.ownerId = pet.owner_id; }
  } else {
    const u = db.prepare('SELECT name, email FROM users WHERE id = ?').get(pet.owner_id);
    if (u) { pet.ownerName = u.name; pet.ownerEmail = u.email; }
    else { pet.ownerName = 'Bilinmiyor'; }
    pet.ownerId = pet.owner_id;
  }
  return pet;
}

router.get('/', authenticate, (req, res) => {
  try {
    const db = getDb();
    const favorites = db.prepare(`
      SELECT p.* FROM pets p
      INNER JOIN favorites f ON f.pet_id = p.id
      WHERE f.user_id = ? AND p.status = 'active'
      ORDER BY f.created_at DESC
    `).all(req.user.id);

    res.json(favorites.map(p => enrichPet(p, db)));
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: 'Favoriler alınırken hata oluştu' });
  }
});

router.post('/:petId', authenticate, (req, res) => {
  try {
    const db = getDb();
    const pet = db.prepare('SELECT id FROM pets WHERE id = ?').get(req.params.petId);
    if (!pet) return res.status(404).json({ error: 'İlan bulunamadı' });

    try {
      db.prepare('INSERT INTO favorites (user_id, pet_id) VALUES (?, ?)').run(req.user.id, req.params.petId);
      res.json({ favorited: true });
    } catch (e) {
      if (e.message.includes('UNIQUE')) {
        res.json({ favorited: true, message: 'Zaten favorilerde' });
      } else throw e;
    }
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ error: 'Favorilere eklenirken hata oluştu' });
  }
});

router.delete('/:petId', authenticate, (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND pet_id = ?').run(req.user.id, req.params.petId);
    res.json({ favorited: false });
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ error: 'Favorilerden çıkarılırken hata oluştu' });
  }
});

router.get('/check/:petId', authenticate, (req, res) => {
  try {
    const db = getDb();
    const fav = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND pet_id = ?').get(req.user.id, req.params.petId);
    res.json({ favorited: !!fav });
  } catch (err) {
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

module.exports = router;
