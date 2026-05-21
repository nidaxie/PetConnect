const { pool } = require('../config/db');

async function list(req, res) {
  try {
    const { city, search, verified } = req.query;

    const conditions = ["s.status = 'approved'"];
    const params     = [];
    let   idx        = 1;

    if (city)   { conditions.push(`s.city = $${idx++}`);                                  params.push(city); }
    if (search) { conditions.push(`s.name ILIKE $${idx++}`);                              params.push(`%${search}%`); }
    if (verified === 'true') { conditions.push('s.verified = TRUE'); }

    const sql = `
      SELECT s.*,
        (SELECT COUNT(*) FROM pets p WHERE p.owner_id = s.id AND p.owner_type = 'shelter' AND p.status = 'active')::int AS live_pets
      FROM shelters s
      WHERE ${conditions.join(' AND ')}
      ORDER BY s.verified DESC, s.adopted_count DESC
    `;
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('List shelters error:', err);
    res.status(500).json({ error: 'Barınaklar alınırken hata oluştu' });
  }
}

async function getOne(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM shelters WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Barınak bulunamadı' });

    const cntRes = await pool.query(
      "SELECT COUNT(*) AS count FROM pets WHERE owner_id = $1 AND owner_type = 'shelter' AND status = 'active'",
      [req.params.id]
    );
    const shelter   = rows[0];
    shelter.total_pets = parseInt(cntRes.rows[0].count);

    res.json(shelter);
  } catch (err) {
    console.error('Get shelter error:', err);
    res.status(500).json({ error: 'Barınak alınırken hata oluştu' });
  }
}

async function update(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM shelters WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Barınak bulunamadı' });
    const shelter = rows[0];

    if (shelter.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    const { name, city, district, address, phone, email, description,
            cover_image, logo_url, website, social_instagram, working_hours, capacity } = req.body;

    await pool.query(
      `UPDATE shelters SET
         name=$1, city=$2, district=$3, address=$4, phone=$5, email=$6,
         description=$7, cover_image=$8, logo_url=$9, website=$10,
         social_instagram=$11, working_hours=$12, capacity=$13, updated_at=NOW()
       WHERE id=$14`,
      [name ?? shelter.name, city ?? shelter.city,
       district !== undefined ? district : shelter.district,
       address ?? shelter.address, phone ?? shelter.phone, email ?? shelter.email,
       description ?? shelter.description,
       cover_image !== undefined ? cover_image : shelter.cover_image,
       logo_url    !== undefined ? logo_url    : shelter.logo_url,
       website     !== undefined ? website     : shelter.website,
       social_instagram !== undefined ? social_instagram : shelter.social_instagram,
       working_hours    !== undefined ? working_hours    : shelter.working_hours,
       capacity ? parseInt(capacity) : shelter.capacity,
       req.params.id]
    );

    const updated = await pool.query('SELECT * FROM shelters WHERE id = $1', [req.params.id]);
    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Update shelter error:', err);
    res.status(500).json({ error: 'Barınak güncellenirken hata oluştu' });
  }
}

module.exports = { list, getOne, update };
