const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'petconnect.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    -- ============================================================
    -- USERS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS users (
      id           TEXT    PRIMARY KEY,
      name         TEXT    NOT NULL,
      email        TEXT    UNIQUE NOT NULL,
      password_hash TEXT   NOT NULL,
      role         TEXT    NOT NULL DEFAULT 'user',   -- 'user' | 'shelter' | 'admin'
      phone        TEXT,
      city         TEXT,
      avatar_url   TEXT,
      is_active    INTEGER NOT NULL DEFAULT 1,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ============================================================
    -- SHELTERS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS shelters (
      id               TEXT    PRIMARY KEY,
      user_id          TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name             TEXT    NOT NULL,
      city             TEXT    NOT NULL,
      district         TEXT,
      address          TEXT    NOT NULL,
      phone            TEXT    NOT NULL,
      email            TEXT    NOT NULL,
      website          TEXT,
      description      TEXT,
      cover_image      TEXT,
      logo_url         TEXT,
      social_facebook  TEXT,
      social_instagram TEXT,
      social_twitter   TEXT,
      working_hours    TEXT,                          -- e.g. "09:00-18:00"
      founded_year     INTEGER,
      total_pets       INTEGER NOT NULL DEFAULT 0,
      adopted_count    INTEGER NOT NULL DEFAULT 0,
      capacity         INTEGER,
      tax_number       TEXT,
      status           TEXT    NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
      verified         INTEGER NOT NULL DEFAULT 0,
      joined_date      TEXT    NOT NULL DEFAULT (date('now')),
      updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ============================================================
    -- PETS  (listings)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS pets (
      id             TEXT    PRIMARY KEY,
      name           TEXT    NOT NULL,
      type           TEXT    NOT NULL,               -- 'dog' | 'cat'
      breed          TEXT    NOT NULL,
      age            INTEGER NOT NULL,
      age_unit       TEXT    NOT NULL DEFAULT 'year', -- 'month' | 'year'
      gender         TEXT    NOT NULL,               -- 'male' | 'female'
      color          TEXT,
      weight         REAL,                           -- kg
      size           TEXT,                           -- 'small' | 'medium' | 'large' | 'xlarge'
      city           TEXT    NOT NULL,
      district       TEXT,
      description    TEXT    NOT NULL,
      listing_type   TEXT    NOT NULL,               -- 'adoption' | 'mating'
      health_status  TEXT,
      vaccinated     INTEGER NOT NULL DEFAULT 0,
      neutered       INTEGER NOT NULL DEFAULT 0,
      microchipped   INTEGER NOT NULL DEFAULT 0,
      pedigree       INTEGER NOT NULL DEFAULT 0,
      child_friendly INTEGER NOT NULL DEFAULT 0,
      pet_friendly   INTEGER NOT NULL DEFAULT 0,
      contact_phone  TEXT,                           -- direct contact (for user listings)
      contact_email  TEXT,
      owner_id       TEXT    NOT NULL,               -- user.id or shelter.id
      owner_type     TEXT    NOT NULL,               -- 'user' | 'shelter'
      status         TEXT    NOT NULL DEFAULT 'active', -- 'active' | 'inactive' | 'adopted' | 'deleted'
      featured       INTEGER NOT NULL DEFAULT 0,
      view_count     INTEGER NOT NULL DEFAULT 0,
      created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ============================================================
    -- PET IMAGES
    -- ============================================================
    CREATE TABLE IF NOT EXISTS pet_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id     TEXT    NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      url        TEXT    NOT NULL,
      is_primary INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ============================================================
    -- FAVORITES
    -- ============================================================
    CREATE TABLE IF NOT EXISTS favorites (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      pet_id     TEXT    NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      created_at TEXT    NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, pet_id)
    );

    -- ============================================================
    -- CONTACT SUBMISSIONS
    -- ============================================================
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      email      TEXT    NOT NULL,
      phone      TEXT,
      subject    TEXT,
      message    TEXT    NOT NULL,
      status     TEXT    NOT NULL DEFAULT 'unread',  -- 'unread' | 'read' | 'replied'
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- ============================================================
    -- ACTIVITY LOG
    -- ============================================================
    CREATE TABLE IF NOT EXISTS activities (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      type        TEXT    NOT NULL,                  -- 'user' | 'shelter' | 'listing' | 'adoption'
      action      TEXT    NOT NULL,
      entity_id   TEXT,
      entity_name TEXT    NOT NULL,
      user_id     TEXT    REFERENCES users(id) ON DELETE SET NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_pets_owner        ON pets(owner_id, owner_type);
    CREATE INDEX IF NOT EXISTS idx_pets_type_status  ON pets(type, status);
    CREATE INDEX IF NOT EXISTS idx_pets_city         ON pets(city);
    CREATE INDEX IF NOT EXISTS idx_pets_listing_type ON pets(listing_type);
    CREATE INDEX IF NOT EXISTS idx_favorites_user    ON favorites(user_id);
    CREATE INDEX IF NOT EXISTS idx_shelters_city     ON shelters(city);
    CREATE INDEX IF NOT EXISTS idx_shelters_status   ON shelters(status);
    CREATE INDEX IF NOT EXISTS idx_activities_date   ON activities(created_at DESC);
  `);
}

module.exports = { getDb };
