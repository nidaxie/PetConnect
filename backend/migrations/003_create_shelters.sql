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

CREATE INDEX IF NOT EXISTS idx_shelters_user_id ON shelters(user_id);
CREATE INDEX IF NOT EXISTS idx_shelters_city    ON shelters(city);
CREATE INDEX IF NOT EXISTS idx_shelters_status  ON shelters(status);
