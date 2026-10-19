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

ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS name VARCHAR(150);
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS subject VARCHAR(255);
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'unread';
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
