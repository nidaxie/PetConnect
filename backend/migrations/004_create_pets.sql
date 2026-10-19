CREATE TABLE IF NOT EXISTS pets (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(100) NOT NULL,
  type           VARCHAR(10)  NOT NULL,                  -- 'dog' | 'cat'
  breed          VARCHAR(100) NOT NULL,
  age            SMALLINT    NOT NULL,
  age_unit       VARCHAR(10)  NOT NULL DEFAULT 'year',   -- 'month' | 'year'
  gender         VARCHAR(10)  NOT NULL,                  -- 'male' | 'female'
  color          VARCHAR(80),
  weight         DECIMAL(5,2),                           -- kg
  size           VARCHAR(10),                            -- 'small' | 'medium' | 'large' | 'xlarge'
  city           VARCHAR(100) NOT NULL,
  district       VARCHAR(100),
  description    TEXT        NOT NULL,
  listing_type   VARCHAR(15)  NOT NULL,                  -- 'adoption' | 'mating'
  health_status  VARCHAR(100),
  vaccinated     BOOLEAN     NOT NULL DEFAULT FALSE,
  neutered       BOOLEAN     NOT NULL DEFAULT FALSE,
  microchipped   BOOLEAN     NOT NULL DEFAULT FALSE,
  pedigree       BOOLEAN     NOT NULL DEFAULT FALSE,
  child_friendly BOOLEAN     NOT NULL DEFAULT FALSE,
  pet_friendly   BOOLEAN     NOT NULL DEFAULT FALSE,
  contact_phone  VARCHAR(30),
  contact_email  VARCHAR(255),
  owner_id       UUID        NOT NULL,                   -- users.id or shelters.id
  owner_type     VARCHAR(10)  NOT NULL,                  -- 'user' | 'shelter'
  status         VARCHAR(15)  NOT NULL DEFAULT 'active', -- 'active' | 'inactive' | 'adopted' | 'deleted'
  featured       BOOLEAN     NOT NULL DEFAULT FALSE,
  view_count     INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP   NOT NULL DEFAULT NOW()
);

ALTER TABLE pets ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS type VARCHAR(10);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS breed VARCHAR(100);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS age SMALLINT;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS age_unit VARCHAR(10) DEFAULT 'year';
ALTER TABLE pets ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS color VARCHAR(80);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS size VARCHAR(10);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS listing_type VARCHAR(15);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS health_status VARCHAR(100);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS vaccinated BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS neutered BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS microchipped BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS pedigree BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS child_friendly BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(30);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS owner_id UUID;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS owner_type VARCHAR(10);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS status VARCHAR(15) DEFAULT 'active';
ALTER TABLE pets ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE pets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_pets_owner        ON pets(owner_id, owner_type);
CREATE INDEX IF NOT EXISTS idx_pets_type_status  ON pets(type, status);
CREATE INDEX IF NOT EXISTS idx_pets_city         ON pets(city);
CREATE INDEX IF NOT EXISTS idx_pets_listing_type ON pets(listing_type);
CREATE INDEX IF NOT EXISTS idx_pets_featured     ON pets(featured) WHERE featured = TRUE;
