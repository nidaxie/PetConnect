require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { getDb } = require('./src/db');
const authRoutes = require('./src/routes/auth');
const petsRoutes = require('./src/routes/pets');
const sheltersRoutes = require('./src/routes/shelters');
const favoritesRoutes = require('./src/routes/favorites');
const adminRoutes = require('./src/routes/admin');
const contactRoutes = require('./src/routes/contact');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/shelters', sheltersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Sunucu hatası' });
});

getDb();
const seedData = require('./src/seed');
seedData();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PetConnect API running on port ${PORT}`);
});
