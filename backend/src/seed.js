const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('./db');

async function seed() {
  const db = getDb();

  const existingAdmin = db.prepare("SELECT id FROM users WHERE email = 'admin@petconnect.com'").get();
  if (existingAdmin) return;

  console.log('Seeding database...');

  const adminId = uuidv4();
  db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    adminId, 'Admin', 'admin@petconnect.com', await bcrypt.hash('Admin123!', 10), 'admin', '+90 212 000 0000', 'İstanbul'
  );

  const user1Id = uuidv4();
  db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    user1Id, 'Ayşe Yılmaz', 'ayse@example.com', await bcrypt.hash('User1234!', 10), 'user', '+90 532 111 2233', 'Ankara'
  );

  const user2Id = uuidv4();
  db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    user2Id, 'Mehmet Demir', 'mehmet@example.com', await bcrypt.hash('User1234!', 10), 'user', '+90 533 444 5566', 'İzmir'
  );

  const s1UserId = uuidv4();
  db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    s1UserId, 'İstanbul Pati Barınağı Yönetimi', 'info@patibarinak.com', await bcrypt.hash('Shelter123!', 10), 'shelter', '+90 212 555 0101', 'İstanbul'
  );

  const s2UserId = uuidv4();
  db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    s2UserId, 'Ankara Minik Patiler Yönetimi', 'info@minikpatiler.org', await bcrypt.hash('Shelter123!', 10), 'shelter', '+90 312 555 0202', 'Ankara'
  );

  const s3UserId = uuidv4();
  db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, city) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    s3UserId, 'İzmir Dostlar Barınağı Yönetimi', 'info@dostlar.com', await bcrypt.hash('Shelter123!', 10), 'shelter', '+90 232 555 0303', 'İzmir'
  );

  const shelter1Id = uuidv4();
  db.prepare(`INSERT INTO shelters
    (id, user_id, name, city, district, address, phone, email, website, description, cover_image, logo_url,
     social_instagram, working_hours, founded_year, total_pets, adopted_count, capacity, status, verified, joined_date)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    shelter1Id, s1UserId,
    'İstanbul Pati Barınağı', 'İstanbul', 'Sarıyer',
    'Sarıyer Mahallesi, Pati Sokak No:5, 34460 Sarıyer/İstanbul',
    '+90 212 555 0101', 'info@patibarinak.com', 'https://patibarinak.com',
    '2015 yılından beri faaliyet gösteren, 200+ hayvana ev sahipliği yapan modern barınak tesisi. Profesyonel veteriner kadromuz ve gönüllü ekibimizle her hayvanın özel ilgi görmesini sağlıyoruz.',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    null, '@patibarinak', '09:00-18:00', 2015, 45, 120, 200, 'approved', 1, '2015-06-15'
  );

  const shelter2Id = uuidv4();
  db.prepare(`INSERT INTO shelters
    (id, user_id, name, city, district, address, phone, email, description, cover_image,
     social_instagram, working_hours, founded_year, total_pets, adopted_count, capacity, status, verified, joined_date)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    shelter2Id, s2UserId,
    'Ankara Minik Patiler', 'Ankara', 'Çankaya',
    'Çankaya Mahallesi, Sevgi Caddesi No:12, 06690 Çankaya/Ankara',
    '+90 312 555 0202', 'info@minikpatiler.org',
    'Özellikle kedilere odaklanan, gönüllü destekli bir barınak. Her kediyi bireysel olarak değerlendiriyor, en uygun yuvayla buluşturuyoruz.',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800',
    '@minikpatiler', '10:00-17:00', 2018, 32, 85, 100, 'approved', 1, '2018-03-20'
  );

  const shelter3Id = uuidv4();
  db.prepare(`INSERT INTO shelters
    (id, user_id, name, city, district, address, phone, email, description, cover_image,
     working_hours, founded_year, total_pets, adopted_count, capacity, status, verified, joined_date)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    shelter3Id, s3UserId,
    'İzmir Dostlar Barınağı', 'İzmir', 'Bornova',
    'Bornova Mahallesi, Umut Sokak No:18, 35030 Bornova/İzmir',
    '+90 232 555 0303', 'info@dostlar.com',
    'Köpeklere özel geniş oyun alanları olan, tam donanımlı veteriner hizmeti sunan ve 2017\'den beri İzmir\'e hizmet veren güvenilir barınak.',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800',
    '08:00-19:00', 2017, 38, 95, 150, 'approved', 1, '2017-09-05'
  );

  const insertPet = db.prepare(`INSERT INTO pets
    (id, name, type, breed, age, age_unit, gender, color, weight, size,
     city, district, description, listing_type, health_status,
     vaccinated, neutered, microchipped, pedigree, child_friendly, pet_friendly,
     contact_phone, contact_email, owner_id, owner_type, featured)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

  const insertImg = db.prepare('INSERT INTO pet_images (pet_id, url, is_primary, sort_order) VALUES (?,?,?,?)');

  const pets = [
    {
      id: uuidv4(), name: 'Pamuk', type: 'dog', breed: 'Golden Retriever', age: 2, age_unit: 'year',
      gender: 'male', color: 'Altın sarısı', weight: 28, size: 'large',
      city: 'İstanbul', district: 'Sarıyer',
      desc: 'Çok sevecen ve oyuncu bir Golden Retriever. Çocuklarla harika geçiniyor, eve alışkanlığı var. Tüm aşıları tam, veteriner kontrolleri yapılmış.',
      lt: 'adoption', health: 'Mükemmel', vac: 1, neu: 1, micro: 1, ped: 0, child: 1, pet: 1,
      phone: null, email: null,
      ownerId: shelter1Id, ownerType: 'shelter', featured: 1,
      img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800'
    },
    {
      id: uuidv4(), name: 'Minnoş', type: 'cat', breed: 'Scottish Fold', age: 10, age_unit: 'month',
      gender: 'female', color: 'Gri-beyaz', weight: 3.2, size: 'small',
      city: 'Ankara', district: 'Çankaya',
      desc: 'Sakin ve sevimli bir Scottish Fold yavrusu. Apartman yaşamına çok uygun, sessiz yapılı. Çok iyi sosyalleştirilmiş.',
      lt: 'adoption', health: 'Sağlıklı', vac: 1, neu: 0, micro: 0, ped: 1, child: 1, pet: 0,
      phone: '+90 532 111 2233', email: 'ayse@example.com',
      ownerId: user1Id, ownerType: 'user', featured: 1,
      img: 'https://images.unsplash.com/photo-1573865526739-10c1dd69c13a?w=800'
    },
    {
      id: uuidv4(), name: 'Karabaş', type: 'dog', breed: 'Kangal', age: 3, age_unit: 'year',
      gender: 'male', color: 'Sarı-siyah', weight: 55, size: 'xlarge',
      city: 'İzmir', district: 'Bornova',
      desc: 'Bahçeli ev için mükemmel, güçlü koruma içgüdüsüne sahip Kangal. Terbiyeli, ailesiyle çok iyi geçiniyor. Çiftleştirme amacıyla ilan verilmiştir.',
      lt: 'mating', health: 'Mükemmel', vac: 1, neu: 0, micro: 1, ped: 1, child: 0, pet: 0,
      phone: '+90 533 444 5566', email: 'mehmet@example.com',
      ownerId: user2Id, ownerType: 'user', featured: 0,
      img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'
    },
    {
      id: uuidv4(), name: 'Luna', type: 'cat', breed: 'British Shorthair', age: 2, age_unit: 'year',
      gender: 'female', color: 'Mavi-gri', weight: 4.1, size: 'medium',
      city: 'Ankara', district: 'Çankaya',
      desc: 'Uysal ve sevgi dolu British Shorthair. İdeal bir aile kedisi arıyorsak Luna tam da bu. Kısırlaştırılmış, tüm aşıları tamam.',
      lt: 'adoption', health: 'Sağlıklı', vac: 1, neu: 1, micro: 1, ped: 0, child: 1, pet: 1,
      phone: null, email: null,
      ownerId: shelter2Id, ownerType: 'shelter', featured: 1,
      img: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800'
    },
    {
      id: uuidv4(), name: 'Max', type: 'dog', breed: 'Labrador Retriever', age: 4, age_unit: 'year',
      gender: 'male', color: 'Siyah', weight: 32, size: 'large',
      city: 'İstanbul', district: 'Beşiktaş',
      desc: 'Aktif ve enerjik siyah Labrador. Günlük uzun yürüyüşler gerektirir, koşmayı ve suyu sever. Çiftleştirme için uygundur.',
      lt: 'mating', health: 'Mükemmel', vac: 1, neu: 0, micro: 1, ped: 1, child: 1, pet: 1,
      phone: '+90 532 111 2233', email: 'ayse@example.com',
      ownerId: user1Id, ownerType: 'user', featured: 0,
      img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'
    },
    {
      id: uuidv4(), name: 'Boncuk', type: 'cat', breed: 'Van Kedisi', age: 8, age_unit: 'month',
      gender: 'female', color: 'Beyaz', weight: 2.8, size: 'small',
      city: 'İzmir', district: 'Konak',
      desc: 'Beyaz tüylü, farklı renk gözlü Van Kedisi yavrusu. Çok özel bir karakter, suyu sever ve çok aktif. Barınaktan sahiplendirilecek.',
      lt: 'adoption', health: 'Sağlıklı', vac: 1, neu: 1, micro: 0, ped: 0, child: 1, pet: 1,
      phone: null, email: null,
      ownerId: shelter3Id, ownerType: 'shelter', featured: 0,
      img: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800'
    },
    {
      id: uuidv4(), name: 'Şila', type: 'dog', breed: 'Husky', age: 2, age_unit: 'year',
      gender: 'female', color: 'Siyah-beyaz', weight: 22, size: 'large',
      city: 'İstanbul', district: 'Sarıyer',
      desc: 'Mavi gözlü, hareketli ve zeki bir Husky. Aktif bir aile ya da sporcu biri için mükemmel. Geniş alan ve düzenli egzersiz şart.',
      lt: 'adoption', health: 'Mükemmel', vac: 1, neu: 1, micro: 1, ped: 0, child: 0, pet: 1,
      phone: null, email: null,
      ownerId: shelter1Id, ownerType: 'shelter', featured: 0,
      img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800'
    },
    {
      id: uuidv4(), name: 'Çıtır', type: 'cat', breed: 'Tekir', age: 6, age_unit: 'month',
      gender: 'male', color: 'Gri-turuncu tekir', weight: 2.2, size: 'small',
      city: 'İzmir', district: 'Bornova',
      desc: 'Sokaktan kurtarıldı, rehabilite edildi. Şimdi sıcak ve sevgi dolu bir yuva arıyor. Çok oyuncu ve sevecen bir karakter.',
      lt: 'adoption', health: 'Sağlıklı', vac: 1, neu: 1, micro: 0, ped: 0, child: 1, pet: 1,
      phone: '+90 533 444 5566', email: 'mehmet@example.com',
      ownerId: user2Id, ownerType: 'user', featured: 0,
      img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'
    },
  ];

  for (const p of pets) {
    insertPet.run(
      p.id, p.name, p.type, p.breed, p.age, p.age_unit, p.gender, p.color, p.weight, p.size,
      p.city, p.district, p.desc, p.lt, p.health,
      p.vac, p.neu, p.micro, p.ped, p.child, p.pet,
      p.phone, p.email, p.ownerId, p.ownerType, p.featured
    );
    insertImg.run(p.id, p.img, 1, 0);
  }

  db.prepare(`INSERT INTO activities (type, action, entity_name) VALUES ('user', 'Sistem kuruldu, seed data yüklendi', 'PetConnect')`).run();

  console.log('Database seeded!');
  console.log('  Admin:   admin@petconnect.com / Admin123!');
  console.log('  User:    ayse@example.com / User1234!');
  console.log('  Shelter: info@patibarinak.com / Shelter123!');
}

module.exports = seed;
