CREATE TABLE IF NOT EXISTS users (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  role         VARCHAR(20)  NOT NULL DEFAULT 'user',      -- 'user' | 'shelter' | 'admin'
  phone        VARCHAR(30),
  city         VARCHAR(100),
  avatar_url   TEXT,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active   ON users(is_active);
