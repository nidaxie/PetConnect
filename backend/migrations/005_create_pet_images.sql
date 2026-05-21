CREATE TABLE IF NOT EXISTS pet_images (
  id         SERIAL      PRIMARY KEY,
  pet_id     UUID        NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  url        TEXT        NOT NULL,
  is_primary BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order SMALLINT    NOT NULL DEFAULT 0,
  created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pet_images_pet_id ON pet_images(pet_id);
