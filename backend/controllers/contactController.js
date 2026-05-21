const { pool } = require('../config/db');

async function submit(req, res) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Ad, e-posta ve mesaj zorunludur' });
    }
    await pool.query(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES ($1,$2,$3,$4)',
      [name, email, subject || '', message]
    );
    res.json({ success: true, message: 'Mesajınız iletildi. En kısa sürede dönüş yapacağız.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Mesaj gönderilirken hata oluştu' });
  }
}

module.exports = { submit };
