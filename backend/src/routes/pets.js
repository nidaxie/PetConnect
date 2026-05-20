const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

function enrichPet(pet, db) {
  const images = db.prepare('SELECT url FROM pet_images WHERE pet_id = ? ORDER BY sort_order').all(pet.id);
  pet.images = images.map(i => i.url);
  if (pet.images.length === 0) {
    pet.images = ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'];
  }

  pet.vaccinated = pet.vaccinated === 1;
  pet.neutered = pet.neutered === 1;
  pet.featured = pet.featured === 1;

  if (pet.owner_type === 'shelter') {
    const shelter = db.prepare('SELECT name, phone, email FROM shelters WHERE id = (SELECT id FROM shelters WHERE user_id = (SELECT id FROM users WHERE id = ?))').get(pet.owner_id);
    const shelterRow = db.prepare('SELECT s.id, s.name, s.phone, s.email FROM shelters s WHERE s.user_id = ? OR s.id = ?').get(pet.owner_id, pet.owner_id);
    if (shelterRow) {
      pet.ownerName = shelterRow.name;
      pet.ownerPhone = shelterRow.phone;
      pet.ownerEmail = shelterRow.email;
      pet.ownerId = shelterRow.id;
    } else {
      const user = db.prepare('SELECT name FROM users WHERE id = ?').get(pet.owner_id);
      pet.ownerName = user ? user.name : 'Bilinmiyor';
      pet.ownerId = pet.owner_id;
    }
  } else {
    const user = db.prepare('SELECT name, email FROM users WHERE id = ?').get(pet.owner_id);
    if (user) {
      pet.ownerName = user.name;
      pet.ownerEmail = user.email;
    } else {
      pet.ownerName = 'Bilinmiyor';
    }
    pet.ownerId = pet.owner_id;
  }

  return pet;
}

router.get('/', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const { type, breed, city, gender, listingType, minAge, maxAge, featured, search } = req.query;

    let query = "SELECT * FROM pets WHERE status = 'active'";
    const params = [];

    if (type) { query += ' AND type = ?'; params.push(type); }
    if (breed) { query += ' AND breed = ?'; params.push(breed); }
    if (city) { query += ' AND city = ?'; params.push(city); }
    if (gender) { query += ' AND gender = ?'; params.push(gender); }
    if (listingType) { query += ' AND listing_type = ?'; params.push(listingType); }
    if (minAge) { query += ' AND age >= ?'; params.push(parseInt(minAge)); }
    if (maxAge) { query += ' AND age <= ?'; params.push(parseInt(maxAge)); }
    if (featured === 'true') { query += ' AND featured = 1'; }
    if (search) { query += ' AND (name LIKE ? OR breed LIKE ? OR description LIKE ?)'; const s = `%${search}%`; params.push(s, s, s); }

    query += ' ORDER BY featured DESC, created_at DESC';

    const pets = db.prepare(query).all(...params);
    const enriched = pets.map(p => enrichPet(p, db));

    res.json(enriched);
  } catch (err) {
    console.error('Get pets error:', err);
    res.status(500).json({ error: 'İlanlar alınırken hata oluştu' });
  }
});

router.get('/:id', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
    if (!pet) return res.status(404).json({ error: 'İlan bulunamadı' });

    db.prepare('UPDATE pets SET view_count = view_count + 1 WHERE id = ?').run(req.params.id);
    pet.view_count = (pet.view_count || 0) + 1;

    const enriched = enrichPet(pet, db);

    let isFavorited = false;
    if (req.user) {
      const fav = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND pet_id = ?').get(req.user.id, pet.id);
      isFavorited = !!fav;
    }
    enriched.isFavorited = isFavorited;

    res.json(enriched);
  } catch (err) {
    console.error('Get pet error:', err);
    res.status(500).json({ error: 'İlan alınırken hata oluştu' });
  }
});

router.post('/', authenticate, (req, res) => {
  try {
    const db = getDb();
    const { name, type, breed, age, gender, city, description, listingType, healthStatus, vaccinated, neutered, images } = req.body;

    if (!name || !type || !breed || !age || !gender || !city || !description || !listingType) {
      return res.status(400).json({ error: 'Tüm zorunlu alanlar doldurulmalıdır' });
    }

    const petId = uuidv4();
    let ownerType = 'user';
    let ownerId = req.user.id;

    if (req.user.role === 'shelter') {
      const shelter = db.prepare('SELECT id FROM shelters WHERE user_id = ?').get(req.user.id);
      if (shelter) {
        ownerType = 'shelter';
        ownerId = shelter.id;
      }
    }

    db.prepare(`
      INSERT INTO pets (id, name, type, breed, age, gender, city, description, listing_type, health_status, vaccinated, neutered, owner_id, owner_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(petId, name, type, breed, parseInt(age), gender, city, description, listingType, healthStatus || '', vaccinated ? 1 : 0, neutered ? 1 : 0, ownerId, ownerType);

    if (images && images.length > 0) {
      const insertImg = db.prepare('INSERT INTO pet_images (pet_id, url, sort_order) VALUES (?, ?, ?)');
      images.forEach((url, i) => insertImg.run(petId, url, i));
    }

    db.prepare(`INSERT INTO activities (type, action, entity_name, user_id) VALUES ('listing', 'Yeni ilan eklendi', ?, ?)`).run(name, req.user.id);

    const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(petId);
    res.status(201).json(enrichPet(pet, db));
  } catch (err) {
    console.error('Create pet error:', err);
    res.status(500).json({ error: 'İlan oluşturulurken hata oluştu' });
  }
});

router.put('/:id', authenticate, (req, res) => {
  try {
    const db = getDb();
    const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
    if (!pet) return res.status(404).json({ error: 'İlan bulunamadı' });

    const isOwner = pet.owner_id === req.user.id || (req.user.role === 'shelter' && (() => {
      const s = db.prepare('SELECT id FROM shelters WHERE user_id = ?').get(req.user.id);
      return s && s.id === pet.owner_id;
    })());

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    const { name, type, breed, age, gender, city, description, listingType, healthStatus, vaccinated, neutered, status, images } = req.body;

    db.prepare(`
      UPDATE pets SET name=?, type=?, breed=?, age=?, gender=?, city=?, description=?, listing_type=?, health_status=?, vaccinated=?, neutered=?, status=?
      WHERE id=?
    `).run(
      name || pet.name, type || pet.type, breed || pet.breed, age ? parseInt(age) : pet.age,
      gender || pet.gender, city || pet.city, description || pet.description,
      listingType || pet.listing_type, healthStatus !== undefined ? healthStatus : pet.health_status,
      vaccinated !== undefined ? (vaccinated ? 1 : 0) : pet.vaccinated,
      neutered !== undefined ? (neutered ? 1 : 0) : pet.neutered,
      status || pet.status, req.params.id
    );

    if (images) {
      db.prepare('DELETE FROM pet_images WHERE pet_id = ?').run(req.params.id);
      const insertImg = db.prepare('INSERT INTO pet_images (pet_id, url, sort_order) VALUES (?, ?, ?)');
      images.forEach((url, i) => insertImg.run(req.params.id, url, i));
    }

    const updated = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
    res.json(enrichPet(updated, db));
  } catch (err) {
    console.error('Update pet error:', err);
    res.status(500).json({ error: 'İlan güncellenirken hata oluştu' });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    const db = getDb();
    const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id);
    if (!pet) return res.status(404).json({ error: 'İlan bulunamadı' });

    const isOwner = pet.owner_id === req.user.id || (req.user.role === 'shelter' && (() => {
      const s = db.prepare('SELECT id FROM shelters WHERE user_id = ?').get(req.user.id);
      return s && s.id === pet.owner_id;
    })());

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    db.prepare('DELETE FROM pets WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete pet error:', err);
    res.status(500).json({ error: 'İlan silinirken hata oluştu' });
  }
});

router.get('/user/my-listings', authenticate, (req, res) => {
  try {
    const db = getDb();
    let ownerId = req.user.id;

    if (req.user.role === 'shelter') {
      const shelter = db.prepare('SELECT id FROM shelters WHERE user_id = ?').get(req.user.id);
      if (shelter) ownerId = shelter.id;
    }

    const pets = db.prepare("SELECT * FROM pets WHERE owner_id = ? ORDER BY created_at DESC").all(ownerId);
    const enriched = pets.map(p => enrichPet(p, db));

    res.json(enriched);
  } catch (err) {
    console.error('My listings error:', err);
    res.status(500).json({ error: 'İlanlar alınırken hata oluştu' });
  }
});

module.exports = router;
