CREATE TABLE IF NOT EXISTS shelters (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name             VARCHAR(200) NOT NULL,
  city             VARCHAR(100) NOT NULL,
  district         VARCHAR(100),
  address          TEXT        NOT NULL,
  phone            VARCHAR(30)  NOT NULL,
  email            VARCHAR(255) NOT NULL,
  website          VARCHAR(255),
  description      TEXT,
  cover_image      TEXT,
  logo_url         TEXT,
  social_facebook  VARCHAR(255),
  social_instagram VARCHAR(255),
  social_twitter   VARCHAR(255),
  working_hours    VARCHAR(50),                           -- e.g. '09:00-18:00'
  founded_year     SMALLINT,
  total_pets       INTEGER     NOT NULL DEFAULT 0,
  adopted_count    INTEGER     NOT NULL DEFAULT 0,
  capacity         INTEGER,
  tax_number       VARCHAR(50),
  status           VARCHAR(20)  NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  verified         BOOLEAN     NOT NULL DEFAULT FALSE,
  joined_date      DATE        NOT NULL DEFAULT CURRENT_DATE,
  updated_at       TIMESTAMP   NOT NULL DEFAULT NOW()
);

ALTER TABLE shelters ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS name VARCHAR(200);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS social_facebook VARCHAR(255);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS social_instagram VARCHAR(255);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS social_twitter VARCHAR(255);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS working_hours VARCHAR(50);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS founded_year SMALLINT;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS total_pets INTEGER DEFAULT 0;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS adopted_count INTEGER DEFAULT 0;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS capacity INTEGER;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS tax_number VARCHAR(50);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS joined_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_shelters_user_id ON shelters(user_id);
CREATE INDEX IF NOT EXISTS idx_shelters_city    ON shelters(city);
CREATE INDEX IF NOT EXISTS idx_shelters_status  ON shelters(status);
