CREATE TABLE IF NOT EXISTS activities (
  id          SERIAL       PRIMARY KEY,
  type        VARCHAR(20)  NOT NULL,   -- 'user' | 'shelter' | 'listing' | 'adoption'
  action      TEXT         NOT NULL,
  entity_id   UUID,
  entity_name VARCHAR(255) NOT NULL,
  user_id     UUID         REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(created_at DESC);
