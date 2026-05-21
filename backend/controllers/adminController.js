const { pool } = require('../config/db');

async function stats(req, res) {
  try {
    const [
      totalUsersRes, activeUsersRes,
      totalSheltersRes, pendingSheltersRes,
      totalListingsRes, activeListingsRes, totalAdoptionsRes,
      activitiesRes
    ] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role != 'admin'"),
      pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role != 'admin' AND is_active = TRUE"),
      pool.query("SELECT COUNT(*)::int AS count FROM shelters"),
      pool.query("SELECT COUNT(*)::int AS count FROM shelters WHERE status = 'pending'"),
      pool.query("SELECT COUNT(*)::int AS count FROM pets"),
      pool.query("SELECT COUNT(*)::int AS count FROM pets WHERE status = 'active'"),
      pool.query("SELECT COUNT(*)::int AS count FROM pets WHERE status = 'adopted'"),
      pool.query("SELECT * FROM activities ORDER BY created_at DESC LIMIT 20"),
    ]);

    res.json({
      totalUsers:      totalUsersRes.rows[0].count,
      activeUsers:     activeUsersRes.rows[0].count,
      totalShelters:   totalSheltersRes.rows[0].count,
      pendingShelters: pendingSheltersRes.rows[0].count,
      totalListings:   totalListingsRes.rows[0].count,
      activeListings:  activeListingsRes.rows[0].count,
      totalAdoptions:  totalAdoptionsRes.rows[0].count,
      activities:      activitiesRes.rows,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'İstatistikler alınırken hata oluştu' });
  }
}

async function users(req, res) {
  try {
    const { search, role } = req.query;
    const conditions = ['1=1'];
    const params     = [];
    let   idx        = 1;

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }
    if (role) { conditions.push(`role = $${idx++}`); params.push(role); }

    const { rows } = await pool.query(
      `SELECT id, name, email, role, is_active, phone, city, created_at FROM users
       WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Kullanıcılar alınırken hata oluştu' });
  }
}

async function updateUser(req, res) {
  try {
    const { is_active, role } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    if (is_active !== undefined) {
      await pool.query('UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2', [!!is_active, req.params.id]);
    }
    if (role) {
      await pool.query('UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2', [role, req.params.id]);
    }

    const updated = await pool.query(
      'SELECT id, name, email, role, is_active, phone, city, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ error: 'Kullanıcı güncellenirken hata oluştu' });
  }
}

async function shelters(req, res) {
  try {
    const { status, search } = req.query;
    const conditions = ['1=1'];
    const params     = [];
    let   idx        = 1;

    if (status) { conditions.push(`s.status = $${idx++}`); params.push(status); }
    if (search) { conditions.push(`s.name ILIKE $${idx++}`); params.push(`%${search}%`); }

    const { rows } = await pool.query(
      `SELECT s.*, u.name AS applicant_name, u.email AS applicant_email
       FROM shelters s LEFT JOIN users u ON u.id = s.user_id
       WHERE ${conditions.join(' AND ')} ORDER BY s.joined_date DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('Admin shelters error:', err);
    res.status(500).json({ error: 'Barınaklar alınırken hata oluştu' });
  }
}

async function approveShelter(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM shelters WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Barınak bulunamadı' });
    const shelter = rows[0];

    await pool.query("UPDATE shelters SET status = 'approved', verified = TRUE, updated_at = NOW() WHERE id = $1", [req.params.id]);
    await pool.query("UPDATE users SET role = 'shelter', updated_at = NOW() WHERE id = $1", [shelter.user_id]);
    await pool.query(
      "INSERT INTO activities (type, action, entity_name) VALUES ('shelter','Barınak onaylandı',$1)",
      [shelter.name]
    );
    res.json({ success: true, message: 'Barınak onaylandı' });
  } catch (err) {
    console.error('Approve shelter error:', err);
    res.status(500).json({ error: 'Barınak onaylanırken hata oluştu' });
  }
}

async function rejectShelter(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM shelters WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Barınak bulunamadı' });

    await pool.query("UPDATE shelters SET status = 'rejected', updated_at = NOW() WHERE id = $1", [req.params.id]);
    await pool.query(
      "INSERT INTO activities (type, action, entity_name) VALUES ('shelter','Barınak reddedildi',$1)",
      [rows[0].name]
    );
    res.json({ success: true, message: 'Barınak reddedildi' });
  } catch (err) {
    console.error('Reject shelter error:', err);
    res.status(500).json({ error: 'Barınak reddedilirken hata oluştu' });
  }
}

async function listings(req, res) {
  try {
    const { status, type, search } = req.query;
    const conditions = ['1=1'];
    const params     = [];
    let   idx        = 1;

    if (status) { conditions.push(`p.status = $${idx++}`); params.push(status); }
    if (type)   { conditions.push(`p.type = $${idx++}`);   params.push(type); }
    if (search) {
      conditions.push(`(p.name ILIKE $${idx} OR p.breed ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }

    const { rows } = await pool.query(
      `SELECT p.*, ARRAY_AGG(pi.url ORDER BY pi.sort_order) FILTER (WHERE pi.url IS NOT NULL) AS images
       FROM pets p
       LEFT JOIN pet_images pi ON pi.pet_id = p.id
       WHERE ${conditions.join(' AND ')}
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      params
    );

    const enriched = rows.map(p => ({
      ...p,
      images: p.images && p.images.length > 0
        ? p.images
        : ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'],
    }));
    res.json(enriched);
  } catch (err) {
    console.error('Admin listings error:', err);
    res.status(500).json({ error: 'İlanlar alınırken hata oluştu' });
  }
}

async function updateListing(req, res) {
  try {
    const { status, featured } = req.body;
    const { rows } = await pool.query('SELECT id FROM pets WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'İlan bulunamadı' });

    if (status    !== undefined) await pool.query('UPDATE pets SET status   = $1, updated_at = NOW() WHERE id = $2', [status,     req.params.id]);
    if (featured  !== undefined) await pool.query('UPDATE pets SET featured = $1, updated_at = NOW() WHERE id = $2', [!!featured, req.params.id]);

    const updated = await pool.query('SELECT * FROM pets WHERE id = $1', [req.params.id]);
    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Admin update listing error:', err);
    res.status(500).json({ error: 'İlan güncellenirken hata oluştu' });
  }
}

async function deleteListing(req, res) {
  try {
    await pool.query('DELETE FROM pets WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete listing error:', err);
    res.status(500).json({ error: 'İlan silinirken hata oluştu' });
  }
}

module.exports = { stats, users, updateUser, shelters, approveShelter, rejectShelter, listings, updateListing, deleteListing };
