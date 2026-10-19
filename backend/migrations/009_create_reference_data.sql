CREATE TABLE IF NOT EXISTS cities (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(100) UNIQUE NOT NULL,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order SMALLINT     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pet_breeds (
  id         SERIAL       PRIMARY KEY,
  type       VARCHAR(10)  NOT NULL,
  name       VARCHAR(100) NOT NULL,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order SMALLINT     NOT NULL DEFAULT 0,
  UNIQUE (type, name)
);

ALTER TABLE cities ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE cities ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS sort_order SMALLINT DEFAULT 0;

ALTER TABLE pet_breeds ADD COLUMN IF NOT EXISTS type VARCHAR(10);
ALTER TABLE pet_breeds ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE pet_breeds ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE pet_breeds ADD COLUMN IF NOT EXISTS sort_order SMALLINT DEFAULT 0;

INSERT INTO cities (name, sort_order) VALUES
('Adana', 1),
('Adıyaman', 2),
('Afyonkarahisar', 3),
('Ağrı', 4),
('Amasya', 5),
('Ankara', 6),
('Antalya', 7),
('Artvin', 8),
('Aydın', 9),
('Balıkesir', 10),
('Bilecik', 11),
('Bingöl', 12),
('Bitlis', 13),
('Bolu', 14),
('Burdur', 15),
('Bursa', 16),
('Çanakkale', 17),
('Çankırı', 18),
('Çorum', 19),
('Denizli', 20),
('Diyarbakır', 21),
('Edirne', 22),
('Elazığ', 23),
('Erzincan', 24),
('Erzurum', 25),
('Eskişehir', 26),
('Gaziantep', 27),
('Giresun', 28),
('Gümüşhane', 29),
('Hakkari', 30),
('Hatay', 31),
('Isparta', 32),
('Mersin', 33),
('İstanbul', 34),
('İzmir', 35),
('Kars', 36),
('Kastamonu', 37),
('Kayseri', 38),
('Kırklareli', 39),
('Kırşehir', 40),
('Kocaeli', 41),
('Konya', 42),
('Kütahya', 43),
('Malatya', 44),
('Manisa', 45),
('Kahramanmaraş', 46),
('Mardin', 47),
('Muğla', 48),
('Muş', 49),
('Nevşehir', 50),
('Niğde', 51),
('Ordu', 52),
('Rize', 53),
('Sakarya', 54),
('Samsun', 55),
('Siirt', 56),
('Sinop', 57),
('Sivas', 58),
('Tekirdağ', 59),
('Tokat', 60),
('Trabzon', 61),
('Tunceli', 62),
('Şanlıurfa', 63),
('Uşak', 64),
('Van', 65),
('Yozgat', 66),
('Zonguldak', 67),
('Aksaray', 68),
('Bayburt', 69),
('Karaman', 70),
('Kırıkkale', 71),
('Batman', 72),
('Şırnak', 73),
('Bartın', 74),
('Ardahan', 75),
('Iğdır', 76),
('Yalova', 77),
('Karabük', 78),
('Kilis', 79),
('Osmaniye', 80),
('Düzce', 81)
ON CONFLICT (name) DO NOTHING;

INSERT INTO pet_breeds (type, name, sort_order) VALUES
  ('dog', 'Golden Retriever', 1),
  ('dog', 'Labrador Retriever', 2),
  ('dog', 'Kangal', 3),
  ('dog', 'Husky', 4),
  ('dog', 'German Shepherd', 5),
  ('dog', 'Poodle', 6),
  ('dog', 'Beagle', 7),
  ('dog', 'Bulldog', 8),
  ('dog', 'Melez', 9),
  ('cat', 'Scottish Fold', 1),
  ('cat', 'British Shorthair', 2),
  ('cat', 'Van Kedisi', 3),
  ('cat', 'Persian', 4),
  ('cat', 'Tekir', 5),
  ('cat', 'Siyam', 6),
  ('cat', 'Maine Coon', 7),
  ('cat', 'Melez', 8)
ON CONFLICT (type, name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_cities_active ON cities(is_active);
CREATE INDEX IF NOT EXISTS idx_pet_breeds_type_active ON pet_breeds(type, is_active);
