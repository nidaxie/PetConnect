const { pool } = require('../config/db');

async function options(_req, res) {
  try {
    const [citiesRes, breedsRes] = await Promise.all([
      pool.query('SELECT name FROM cities WHERE is_active = TRUE ORDER BY sort_order ASC, name ASC'),
      pool.query('SELECT type, name FROM pet_breeds WHERE is_active = TRUE ORDER BY type ASC, sort_order ASC, name ASC'),
    ]);

    res.json({
      cities: citiesRes.rows.map(row => row.name),
      breeds: breedsRes.rows.reduce((acc, row) => {
        acc[row.type] = acc[row.type] || [];
        acc[row.type].push(row.name);
        return acc;
      }, { dog: [], cat: [] }),
    });
  } catch (err) {
    console.error('Meta options error:', err);
    res.status(500).json({ error: 'Seçenekler alınırken hata oluştu' });
  }
}

async function stats(_req, res) {
  try {
    const [
      adoptedRes,
      activeListingsRes,
      sheltersRes,
      usersRes,
    ] = await Promise.all([
      pool.query(`
        SELECT (
          (SELECT COUNT(*)::int FROM pets WHERE status = 'adopted') +
          (SELECT COALESCE(SUM(adopted_count), 0)::int FROM shelters WHERE status = 'approved')
        ) AS count
      `),
      pool.query("SELECT COUNT(*)::int AS count FROM pets WHERE status = 'active'"),
      pool.query("SELECT COUNT(*)::int AS count FROM shelters WHERE status = 'approved'"),
      pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role != 'admin' AND is_active = TRUE"),
    ]);

    res.json({
      totalAdoptions: adoptedRes.rows[0].count,
      activeListings: activeListingsRes.rows[0].count,
      approvedShelters: sheltersRes.rows[0].count,
      activeUsers: usersRes.rows[0].count,
    });
  } catch (err) {
    console.error('Meta stats error:', err);
    res.status(500).json({ error: 'İstatistikler alınırken hata oluştu' });
  }
}

module.exports = { options, stats };
