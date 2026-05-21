require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const fs   = require('fs');
const path = require('path');
const { pool } = require('./config/db');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      await pool.query(sql);
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
      throw err;
    }
  }
  console.log('Migrations complete.');
}

module.exports = { runMigrations };

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
