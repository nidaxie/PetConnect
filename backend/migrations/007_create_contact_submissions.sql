CREATE TABLE IF NOT EXISTS contact_submissions (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(30),
  subject    VARCHAR(255),
  message    TEXT         NOT NULL,
  status     VARCHAR(20)  NOT NULL DEFAULT 'unread',   -- 'unread' | 'read' | 'replied'
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
