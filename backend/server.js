require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/db');
const { runMigrations } = require('./migrate');

const authRoutes      = require('./routes/auth');
const petsRoutes      = require('./routes/pets');
const sheltersRoutes  = require('./routes/shelters');
const favoritesRoutes = require('./routes/favorites');
const adminRoutes     = require('./routes/admin');
const contactRoutes   = require('./routes/contact');
const metaRoutes      = require('./routes/meta');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',      authRoutes);
app.use('/api/pets',      petsRoutes);
app.use('/api/shelters',  sheltersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/contact',   contactRoutes);
app.use('/api/meta',      metaRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Sunucu hatası' });
});

async function bootstrap() {
  await testConnection();
  await runMigrations();

  const seed = require('./seed');
  await seed();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PetConnect API running on port ${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
