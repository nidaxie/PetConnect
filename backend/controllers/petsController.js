const { v4: uuidv4 } = require('uuid');
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
      pet.ownerName  = sr.rows[0].name;
      pet.ownerPhone = sr.rows[0].phone;
      pet.ownerEmail = sr.rows[0].email;
      pet.ownerId    = sr.rows[0].id;
    } else {
      pet.ownerName = 'Barınak'; pet.ownerId = pet.owner_id;
    }
  } else {
    const ur = await pool.query('SELECT name, email, phone FROM users WHERE id = $1', [pet.owner_id]);
    if (ur.rows[0]) {
      pet.ownerName  = ur.rows[0].name;
      pet.ownerEmail = ur.rows[0].email;
      pet.ownerPhone = ur.rows[0].phone;
    } else {
      pet.ownerName = 'Bilinmiyor';
    }
    pet.ownerId = pet.owner_id;
  }
  return pet;
}

async function list(req, res) {
  try {
    const { type, breed, city, gender, listingType, minAge, maxAge, featured, search, size, ownerId, ownerType } = req.query;

    const conditions = ["p.status = 'active'"];
    const params     = [];
    let   idx        = 1;

    if (type)        { conditions.push(`p.type = $${idx++}`);         params.push(type); }
    if (breed)       { conditions.push(`p.breed = $${idx++}`);        params.push(breed); }
    if (city)        { conditions.push(`p.city = $${idx++}`);         params.push(city); }
    if (gender)      { conditions.push(`p.gender = $${idx++}`);       params.push(gender); }
    if (listingType) { conditions.push(`p.listing_type = $${idx++}`); params.push(listingType); }
    if (size)        { conditions.push(`p.size = $${idx++}`);         params.push(size); }
    if (ownerId)     { conditions.push(`p.owner_id = $${idx++}`);     params.push(ownerId); }
    if (ownerType)   { conditions.push(`p.owner_type = $${idx++}`);   params.push(ownerType); }
    if (minAge)      { conditions.push(`p.age >= $${idx++}`);         params.push(parseInt(minAge)); }
    if (maxAge)      { conditions.push(`p.age <= $${idx++}`);         params.push(parseInt(maxAge)); }
    if (featured === 'true') { conditions.push('p.featured = TRUE'); }
    if (search) {
      conditions.push(`(p.name ILIKE $${idx} OR p.breed ILIKE $${idx} OR p.description ILIKE $${idx} OR p.city ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }

    const sql = `SELECT * FROM pets p WHERE ${conditions.join(' AND ')} ORDER BY p.featured DESC, p.created_at DESC`;
    const { rows } = await pool.query(sql, params);

    const enriched = await Promise.all(rows.map(p => enrichPet(p)));
    res.json(enriched);
  } catch (err) {
    console.error('List pets error:', err);
    res.status(500).json({ error: 'İlanlar alınırken hata oluştu' });
  }
}

async function getOne(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM pets WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'İlan bulunamadı' });

    await pool.query('UPDATE pets SET view_count = view_count + 1 WHERE id = $1', [req.params.id]);
    rows[0].view_count = (rows[0].view_count || 0) + 1;

    const pet = await enrichPet(rows[0]);

    if (req.user) {
      const fav = await pool.query('SELECT id FROM favorites WHERE user_id = $1 AND pet_id = $2', [req.user.id, pet.id]);
      pet.isFavorited = fav.rows.length > 0;
    } else {
      pet.isFavorited = false;
    }

    res.json(pet);
  } catch (err) {
    console.error('Get pet error:', err);
    res.status(500).json({ error: 'İlan alınırken hata oluştu' });
  }
}

async function myListings(req, res) {
  try {
    let ownerId = req.user.id;
    if (req.user.role === 'shelter') {
      const sr = await pool.query('SELECT id FROM shelters WHERE user_id = $1', [req.user.id]);
      if (sr.rows[0]) ownerId = sr.rows[0].id;
    }
    const { rows } = await pool.query(
      'SELECT * FROM pets WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId]
    );
    const enriched = await Promise.all(rows.map(p => enrichPet(p)));
    res.json(enriched);
  } catch (err) {
    console.error('My listings error:', err);
    res.status(500).json({ error: 'İlanlar alınırken hata oluştu' });
  }
}

async function create(req, res) {
  try {
    const {
      name, type, breed, age, age_unit, gender, color, weight, size,
      city, district, description, listingType, healthStatus,
      vaccinated, neutered, microchipped, pedigree, child_friendly, pet_friendly,
      contact_phone, contact_email, images
    } = req.body;

    if (!name || !type || !breed || !age || !gender || !city || !description || !listingType) {
      return res.status(400).json({ error: 'Tüm zorunlu alanlar doldurulmalıdır' });
    }

    let ownerType = 'user';
    let ownerId   = req.user.id;
    if (req.user.role === 'shelter') {
      const sr = await pool.query('SELECT id FROM shelters WHERE user_id = $1', [req.user.id]);
      if (sr.rows[0]) { ownerType = 'shelter'; ownerId = sr.rows[0].id; }
    }

    const petId = uuidv4();
    await pool.query(
      `INSERT INTO pets
         (id, name, type, breed, age, age_unit, gender, color, weight, size,
          city, district, description, listing_type, health_status,
          vaccinated, neutered, microchipped, pedigree, child_friendly, pet_friendly,
          contact_phone, contact_email, owner_id, owner_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)`,
      [petId, name, type, breed, parseInt(age), age_unit || 'year', gender,
       color || null, weight ? parseFloat(weight) : null, size || null,
       city, district || null, description, listingType, healthStatus || null,
       !!vaccinated, !!neutered, !!microchipped, !!pedigree, !!child_friendly, !!pet_friendly,
       contact_phone || null, contact_email || null, ownerId, ownerType]
    );

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO pet_images (pet_id, url, is_primary, sort_order) VALUES ($1,$2,$3,$4)',
          [petId, images[i], i === 0, i]
        );
      }
    }

    await pool.query(
      "INSERT INTO activities (type, action, entity_id, entity_name, user_id) VALUES ('listing','Yeni ilan eklendi',$1,$2,$3)",
      [petId, name, req.user.id]
    );

    const { rows } = await pool.query('SELECT * FROM pets WHERE id = $1', [petId]);
    res.status(201).json(await enrichPet(rows[0]));
  } catch (err) {
    console.error('Create pet error:', err);
    res.status(500).json({ error: 'İlan oluşturulurken hata oluştu' });
  }
}

async function update(req, res) {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM pets WHERE id = $1', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ error: 'İlan bulunamadı' });
    const pet = existing[0];

    let isOwner = pet.owner_id === req.user.id;
    if (!isOwner && req.user.role === 'shelter') {
      const sr = await pool.query('SELECT id FROM shelters WHERE user_id = $1', [req.user.id]);
      isOwner = sr.rows[0] && sr.rows[0].id === pet.owner_id;
    }
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    const {
      name, type, breed, age, age_unit, gender, color, weight, size,
      city, district, description, listingType, healthStatus,
      vaccinated, neutered, microchipped, pedigree, child_friendly, pet_friendly,
      contact_phone, contact_email, status, images
    } = req.body;

    await pool.query(
      `UPDATE pets SET
         name=$1, type=$2, breed=$3, age=$4, age_unit=$5, gender=$6,
         color=$7, weight=$8, size=$9, city=$10, district=$11,
         description=$12, listing_type=$13, health_status=$14,
         vaccinated=$15, neutered=$16, microchipped=$17, pedigree=$18,
         child_friendly=$19, pet_friendly=$20,
         contact_phone=$21, contact_email=$22, status=$23, updated_at=NOW()
       WHERE id=$24`,
      [name ?? pet.name, type ?? pet.type, breed ?? pet.breed,
       age ? parseInt(age) : pet.age, age_unit ?? pet.age_unit,
       gender ?? pet.gender,
       color !== undefined ? color : pet.color,
       weight !== undefined ? (weight ? parseFloat(weight) : null) : pet.weight,
       size !== undefined ? size : pet.size,
       city ?? pet.city, district !== undefined ? district : pet.district,
       description ?? pet.description, listingType ?? pet.listing_type,
       healthStatus !== undefined ? healthStatus : pet.health_status,
       vaccinated !== undefined ? !!vaccinated : pet.vaccinated,
       neutered   !== undefined ? !!neutered   : pet.neutered,
       microchipped !== undefined ? !!microchipped : pet.microchipped,
       pedigree !== undefined ? !!pedigree : pet.pedigree,
       child_friendly !== undefined ? !!child_friendly : pet.child_friendly,
       pet_friendly   !== undefined ? !!pet_friendly   : pet.pet_friendly,
       contact_phone !== undefined ? contact_phone : pet.contact_phone,
       contact_email !== undefined ? contact_email : pet.contact_email,
       status ?? pet.status,
       req.params.id]
    );

    if (images) {
      await pool.query('DELETE FROM pet_images WHERE pet_id = $1', [req.params.id]);
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO pet_images (pet_id, url, is_primary, sort_order) VALUES ($1,$2,$3,$4)',
          [req.params.id, images[i], i === 0, i]
        );
      }
    }

    const { rows } = await pool.query('SELECT * FROM pets WHERE id = $1', [req.params.id]);
    res.json(await enrichPet(rows[0]));
  } catch (err) {
    console.error('Update pet error:', err);
    res.status(500).json({ error: 'İlan güncellenirken hata oluştu' });
  }
}

async function remove(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM pets WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'İlan bulunamadı' });
    const pet = rows[0];

    let isOwner = pet.owner_id === req.user.id;
    if (!isOwner && req.user.role === 'shelter') {
      const sr = await pool.query('SELECT id FROM shelters WHERE user_id = $1', [req.user.id]);
      isOwner = sr.rows[0] && sr.rows[0].id === pet.owner_id;
    }
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    await pool.query('DELETE FROM pets WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete pet error:', err);
    res.status(500).json({ error: 'İlan silinirken hata oluştu' });
  }
}

module.exports = { list, getOne, myListings, create, update, remove };
