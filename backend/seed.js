require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('./config/db');

async function seed() {
  const existing = await pool.query("SELECT id FROM users WHERE email = 'admin@petconnect.com'");
  if (existing.rows.length > 0) return;

  console.log('Seeding database...');

  const adminId  = uuidv4();
  const user1Id  = uuidv4();
  const user2Id  = uuidv4();
  const s1UserId = uuidv4();
  const s2UserId = uuidv4();
  const s3UserId = uuidv4();

  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [adminId, 'Admin', 'admin@petconnect.com', await bcrypt.hash('Admin123!', 10), 'admin', '+90 212 000 0000', 'İstanbul']
  );
  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [user1Id, 'Ayşe Yılmaz', 'ayse@example.com', await bcrypt.hash('User1234!', 10), 'user', '+90 532 111 2233', 'Ankara']
  );
  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [user2Id, 'Mehmet Demir', 'mehmet@example.com', await bcrypt.hash('User1234!', 10), 'user', '+90 533 444 5566', 'İzmir']
  );
  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [s1UserId, 'İstanbul Pati Barınağı Yönetimi', 'info@patibarinak.com', await bcrypt.hash('Shelter123!', 10), 'shelter', '+90 212 555 0101', 'İstanbul']
  );
  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [s2UserId, 'Ankara Minik Patiler Yönetimi', 'info@minikpatiler.org', await bcrypt.hash('Shelter123!', 10), 'shelter', '+90 312 555 0202', 'Ankara']
  );
  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [s3UserId, 'İzmir Dostlar Barınağı Yönetimi', 'info@dostlar.com', await bcrypt.hash('Shelter123!', 10), 'shelter', '+90 232 555 0303', 'İzmir']
  );

  const shelter1Id = uuidv4();
  const shelter2Id = uuidv4();
  const shelter3Id = uuidv4();

  await pool.query(
    `INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, website, description,
      cover_image, social_instagram, working_hours, founded_year, total_pets, adopted_count, capacity, status, verified, joined_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
    [shelter1Id, s1UserId, 'İstanbul Pati Barınağı', 'İstanbul', 'Sarıyer',
      'Sarıyer Mahallesi, Pati Sokak No:5, 34460 Sarıyer/İstanbul',
      '+90 212 555 0101', 'info@patibarinak.com', 'https://patibarinak.com',
      '2015 yılından beri faaliyet gösteren, 200+ hayvana ev sahipliği yapan modern barınak tesisi. Profesyonel veteriner kadromuz ve gönüllü ekibimizle her hayvanın özel ilgi görmesini sağlıyoruz.',
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
      '@patibarinak', '09:00-18:00', 2015, 45, 120, 200, 'approved', true, '2015-06-15']
  );
  await pool.query(
    `INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, description,
      cover_image, social_instagram, working_hours, founded_year, total_pets, adopted_count, capacity, status, verified, joined_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
    [shelter2Id, s2UserId, 'Ankara Minik Patiler', 'Ankara', 'Çankaya',
      'Çankaya Mahallesi, Sevgi Caddesi No:12, 06690 Çankaya/Ankara',
      '+90 312 555 0202', 'info@minikpatiler.org',
      'Özellikle kedilere odaklanan, gönüllü destekli bir barınak. Her kediyi bireysel olarak değerlendiriyor, en uygun yuvayla buluşturuyoruz.',
      'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800',
      '@minikpatiler', '10:00-17:00', 2018, 32, 85, 100, 'approved', true, '2018-03-20']
  );
  await pool.query(
    `INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, description,
      cover_image, working_hours, founded_year, total_pets, adopted_count, capacity, status, verified, joined_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [shelter3Id, s3UserId, 'İzmir Dostlar Barınağı', 'İzmir', 'Bornova',
      'Bornova Mahallesi, Umut Sokak No:18, 35030 Bornova/İzmir',
      '+90 232 555 0303', 'info@dostlar.com',
      "Köpeklere özel geniş oyun alanları olan, tam donanımlı veteriner hizmeti sunan ve 2017'den beri İzmir'e hizmet veren güvenilir barınak.",
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800',
      '08:00-19:00', 2017, 38, 95, 150, 'approved', true, '2017-09-05']
  );

  const pets = [
    { name: 'Pamuk',   type: 'dog', breed: 'Golden Retriever',   age: 2,  unit: 'year',  gender: 'male',   color: 'Altın sarısı',      weight: 28,  size: 'large',  city: 'İstanbul', district: 'Sarıyer',  desc: 'Çok sevecen ve oyuncu bir Golden Retriever. Çocuklarla harika geçiniyor, eve alışkanlığı var. Tüm aşıları tam, veteriner kontrolleri yapılmış.', lt: 'adoption', health: 'Mükemmel', vac: true, neu: true,  micro: true,  ped: false, child: true,  pet: true,  phone: null,              email: null,                  ownerId: shelter1Id, ot: 'shelter', featured: true,  img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800' },
    { name: 'Minnoş',  type: 'cat', breed: 'Scottish Fold',      age: 10, unit: 'month', gender: 'female', color: 'Gri-beyaz',          weight: 3.2, size: 'small',  city: 'Ankara',   district: 'Çankaya', desc: 'Sakin ve sevimli bir Scottish Fold yavrusu. Apartman yaşamına çok uygun, sessiz yapılı. Çok iyi sosyalleştirilmiş.',                        lt: 'adoption', health: 'Sağlıklı', vac: true, neu: false, micro: false, ped: true,  child: true,  pet: false, phone: '+90 532 111 2233', email: 'ayse@example.com',    ownerId: user1Id,    ot: 'user',    featured: true,  img: 'https://images.unsplash.com/photo-1573865526739-10c1dd69c13a?w=800' },
    { name: 'Karabaş', type: 'dog', breed: 'Kangal',             age: 3,  unit: 'year',  gender: 'male',   color: 'Sarı-siyah',         weight: 55,  size: 'xlarge', city: 'İzmir',    district: 'Bornova', desc: 'Bahçeli ev için mükemmel, güçlü koruma içgüdüsüne sahip Kangal. Terbiyeli, ailesiyle çok iyi geçiniyor. Çiftleştirme amacıyla ilan verilmiştir.', lt: 'mating', health: 'Mükemmel', vac: true, neu: false, micro: true,  ped: true,  child: false, pet: false, phone: '+90 533 444 5566', email: 'mehmet@example.com',  ownerId: user2Id,    ot: 'user',    featured: false, img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800' },
    { name: 'Luna',    type: 'cat', breed: 'British Shorthair',  age: 2,  unit: 'year',  gender: 'female', color: 'Mavi-gri',           weight: 4.1, size: 'medium', city: 'Ankara',   district: 'Çankaya', desc: 'Uysal ve sevgi dolu British Shorthair. İdeal bir aile kedisi arıyorsak Luna tam da bu. Kısırlaştırılmış, tüm aşıları tamam.',               lt: 'adoption', health: 'Sağlıklı', vac: true, neu: true,  micro: true,  ped: false, child: true,  pet: true,  phone: null,              email: null,                  ownerId: shelter2Id, ot: 'shelter', featured: true,  img: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800' },
    { name: 'Max',     type: 'dog', breed: 'Labrador Retriever', age: 4,  unit: 'year',  gender: 'male',   color: 'Siyah',              weight: 32,  size: 'large',  city: 'İstanbul', district: 'Beşiktaş',desc: 'Aktif ve enerjik siyah Labrador. Günlük uzun yürüyüşler gerektirir, koşmayı ve suyu sever. Çiftleştirme için uygundur.',                  lt: 'mating', health: 'Mükemmel', vac: true, neu: false, micro: true,  ped: true,  child: true,  pet: true,  phone: '+90 532 111 2233', email: 'ayse@example.com',    ownerId: user1Id,    ot: 'user',    featured: false, img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800' },
    { name: 'Boncuk',  type: 'cat', breed: 'Van Kedisi',         age: 8,  unit: 'month', gender: 'female', color: 'Beyaz',              weight: 2.8, size: 'small',  city: 'İzmir',    district: 'Konak',   desc: 'Beyaz tüylü, farklı renk gözlü Van Kedisi yavrusu. Çok özel bir karakter, suyu sever ve çok aktif. Barınaktan sahiplendirilecek.',        lt: 'adoption', health: 'Sağlıklı', vac: true, neu: true,  micro: false, ped: false, child: true,  pet: true,  phone: null,              email: null,                  ownerId: shelter3Id, ot: 'shelter', featured: false, img: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800' },
    { name: 'Şila',    type: 'dog', breed: 'Husky',              age: 2,  unit: 'year',  gender: 'female', color: 'Siyah-beyaz',        weight: 22,  size: 'large',  city: 'İstanbul', district: 'Sarıyer', desc: 'Mavi gözlü, hareketli ve zeki bir Husky. Aktif bir aile ya da sporcu biri için mükemmel. Geniş alan ve düzenli egzersiz şart.',            lt: 'adoption', health: 'Mükemmel', vac: true, neu: true,  micro: true,  ped: false, child: false, pet: true,  phone: null,              email: null,                  ownerId: shelter1Id, ot: 'shelter', featured: false, img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800' },
    { name: 'Çıtır',   type: 'cat', breed: 'Tekir',              age: 6,  unit: 'month', gender: 'male',   color: 'Gri-turuncu tekir',  weight: 2.2, size: 'small',  city: 'İzmir',    district: 'Bornova', desc: 'Sokaktan kurtarıldı, rehabilite edildi. Şimdi sıcak ve sevgi dolu bir yuva arıyor. Çok oyuncu ve sevecen bir karakter.',                 lt: 'adoption', health: 'Sağlıklı', vac: true, neu: true,  micro: false, ped: false, child: true,  pet: true,  phone: '+90 533 444 5566', email: 'mehmet@example.com',  ownerId: user2Id,    ot: 'user',    featured: false, img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800' },
  ];

  for (const p of pets) {
    const petId = uuidv4();
    await pool.query(
      `INSERT INTO pets (id, name, type, breed, age, age_unit, gender, color, weight, size,
        city, district, description, listing_type, health_status,
        vaccinated, neutered, microchipped, pedigree, child_friendly, pet_friendly,
        contact_phone, contact_email, owner_id, owner_type, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,
      [petId, p.name, p.type, p.breed, p.age, p.unit, p.gender, p.color, p.weight, p.size,
       p.city, p.district, p.desc, p.lt, p.health,
       p.vac, p.neu, p.micro, p.ped, p.child, p.pet,
       p.phone, p.email, p.ownerId, p.ot, p.featured]
    );
    await pool.query(
      'INSERT INTO pet_images (pet_id, url, is_primary, sort_order) VALUES ($1,$2,$3,$4)',
      [petId, p.img, true, 0]
    );
  }

  await pool.query(
    "INSERT INTO activities (type, action, entity_name) VALUES ($1,$2,$3)",
    ['user', 'Sistem kuruldu, seed data yüklendi', 'PetConnect']
  );

  console.log('Database seeded!');
  console.log('  Admin:   admin@petconnect.com / Admin123!');
  console.log('  User:    ayse@example.com / User1234!');
  console.log('  Shelter: info@patibarinak.com / Shelter123!');
}

module.exports = seed;

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
