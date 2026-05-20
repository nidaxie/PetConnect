const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', authenticate, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;

    const conversations = db.prepare(`
      SELECT c.*,
        p.name as pet_name, p.id as pet_id,
        u_req.name as requester_name,
        u_own.name as owner_name,
        (SELECT text FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
        (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != ? AND m.read_at IS NULL) as unread_count
      FROM conversations c
      JOIN pets p ON p.id = c.pet_id
      JOIN users u_req ON u_req.id = c.requester_id
      JOIN users u_own ON u_own.id = c.owner_id
      WHERE c.requester_id = ? OR c.owner_id = ?
      ORDER BY c.updated_at DESC
    `).all(userId, userId, userId);

    const enriched = conversations.map(conv => {
      const otherUserId = conv.requester_id === userId ? conv.owner_id : conv.requester_id;
      const otherUser = db.prepare('SELECT id, name FROM users WHERE id = ?').get(otherUserId);
      return {
        id: conv.id,
        petName: conv.pet_name,
        petId: conv.pet_id,
        otherUserId,
        otherUserName: otherUser ? otherUser.name : 'Bilinmiyor',
        otherUserAvatar: otherUser ? otherUser.name.substring(0, 2).toUpperCase() : '??',
        lastMessage: conv.last_message || '',
        lastMessageTime: conv.last_message_time,
        unreadCount: conv.unread_count || 0,
        updatedAt: conv.updated_at
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Konuşmalar alınırken hata oluştu' });
  }
});

router.get('/conversations/:id', authenticate, (req, res) => {
  try {
    const db = getDb();
    const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Konuşma bulunamadı' });

    if (conv.requester_id !== req.user.id && conv.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Bu konuşmaya erişim yetkiniz yok' });
    }

    db.prepare("UPDATE messages SET read_at = datetime('now') WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL").run(req.params.id, req.user.id);

    const messages = db.prepare(`
      SELECT m.*, u.name as sender_name FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `).all(req.params.id);

    const enriched = messages.map(m => ({
      id: m.id,
      text: m.text,
      sender: m.sender_id === req.user.id ? 'me' : 'other',
      senderName: m.sender_name,
      timestamp: m.created_at,
      readAt: m.read_at
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Mesajlar alınırken hata oluştu' });
  }
});

router.post('/conversations', authenticate, (req, res) => {
  try {
    const db = getDb();
    const { petId } = req.body;

    if (!petId) return res.status(400).json({ error: 'Pet ID gerekli' });

    const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(petId);
    if (!pet) return res.status(404).json({ error: 'İlan bulunamadı' });

    let ownerId = pet.owner_id;
    if (pet.owner_type === 'shelter') {
      const shelter = db.prepare('SELECT user_id FROM shelters WHERE id = ?').get(pet.owner_id);
      if (shelter) ownerId = shelter.user_id;
    }

    if (ownerId === req.user.id) {
      return res.status(400).json({ error: 'Kendi ilanınıza mesaj gönderemezsiniz' });
    }

    const existing = db.prepare('SELECT * FROM conversations WHERE pet_id = ? AND requester_id = ?').get(petId, req.user.id);
    if (existing) {
      return res.json(existing);
    }

    const convId = uuidv4();
    db.prepare('INSERT INTO conversations (id, pet_id, requester_id, owner_id) VALUES (?, ?, ?, ?)').run(convId, petId, req.user.id, ownerId);

    const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(convId);
    res.status(201).json(conv);
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ error: 'Konuşma oluşturulurken hata oluştu' });
  }
});

router.post('/conversations/:id/messages', authenticate, (req, res) => {
  try {
    const db = getDb();
    const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id);
    if (!conv) return res.status(404).json({ error: 'Konuşma bulunamadı' });

    if (conv.requester_id !== req.user.id && conv.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Bu konuşmaya erişim yetkiniz yok' });
    }

    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Mesaj boş olamaz' });

    const msgId = uuidv4();
    db.prepare('INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (?, ?, ?, ?)').run(msgId, req.params.id, req.user.id, text.trim());

    db.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").run(req.params.id);

    const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(msgId);
    res.status(201).json({
      id: msg.id,
      text: msg.text,
      sender: 'me',
      timestamp: msg.created_at
    });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Mesaj gönderilirken hata oluştu' });
  }
});

module.exports = router;
