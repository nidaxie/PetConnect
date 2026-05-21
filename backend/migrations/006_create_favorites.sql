CREATE TABLE IF NOT EXISTS favorites (
  id         SERIAL    PRIMARY KEY,
  user_id    UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id     UUID      NOT NULL REFERENCES pets(id)  ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_pet  ON favorites(pet_id);
