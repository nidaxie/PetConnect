const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const db = getDb();
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Ad, e-posta ve mesaj zorunludur' });
    }

    db.prepare('INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject || '', message);
    res.json({ success: true, message: 'Mesajınız iletildi. En kısa sürede dönüş yapacağız.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Mesaj gönderilirken hata oluştu' });
  }
});

module.exports = router;
