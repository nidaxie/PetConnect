const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('./db');

async function seed() {
  const db = getDb();

  const existingAdmin = db.prepare("SELECT id FROM users WHERE email = 'admin@petconnect.com'").get();
  if (existingAdmin) return;

  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const adminId = uuidv4();
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(adminId, 'Admin', 'admin@petconnect.com', adminPassword, 'admin');

  const user1Id = uuidv4();
  const user1Password = await bcrypt.hash('User1234!', 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(user1Id, 'Ayşe Yılmaz', 'ayse@example.com', user1Password, 'user');

  const user2Id = uuidv4();
  const user2Password = await bcrypt.hash('User1234!', 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(user2Id, 'Mehmet Demir', 'mehmet@example.com', user2Password, 'user');

  const shelter1UserId = uuidv4();
  const shelter1Password = await bcrypt.hash('Shelter123!', 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(shelter1UserId, 'İstanbul Pati Barınağı Yönetimi', 'info@patibarinak.com', shelter1Password, 'shelter');

  const shelter2UserId = uuidv4();
  const shelter2Password = await bcrypt.hash('Shelter123!', 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(shelter2UserId, 'Ankara Minik Patiler Yönetimi', 'info@minikpatiler.org', shelter2Password, 'shelter');

  const shelter3UserId = uuidv4();
  const shelter3Password = await bcrypt.hash('Shelter123!', 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(shelter3UserId, 'Van Kedisi Koruma Merkezi Yönetimi', 'info@vankedi.org', shelter3Password, 'shelter');

  const shelter4UserId = uuidv4();
  const shelter4Password = await bcrypt.hash('Shelter123!', 10);
  db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)').run(shelter4UserId, 'İzmir Dostlar Barınağı Yönetimi', 'info@dostlar.com', shelter4Password, 'shelter');

  const shelter1Id = uuidv4();
  db.prepare(`INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, description, cover_image, total_pets, adopted_count, capacity, status, verified, joined_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 1, ?)`).run(
    shelter1Id, shelter1UserId, 'İstanbul Pati Barınağı', 'İstanbul', 'Sarıyer',
    'Sarıyer Mahallesi, Pati Sokak No:5', '+90 212 555 0101', 'info@patibarinak.com',
    '2015 yılından beri faaliyet gösteren, 200+ hayvana ev sahipliği yapan modern barınak tesisi.',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    45, 120, 200, '2015-06-15'
  );

  const shelter2Id = uuidv4();
  db.prepare(`INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, description, cover_image, total_pets, adopted_count, capacity, status, verified, joined_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 1, ?)`).run(
    shelter2Id, shelter2UserId, 'Ankara Minik Patiler', 'Ankara', 'Çankaya',
    'Çankaya Mahallesi, Sevgi Caddesi No:12', '+90 312 555 0202', 'info@minikpatiler.org',
    'Özellikle kedilere odaklanan, gönüllü destekli bir barınak.',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800',
    32, 85, 100, '2018-03-20'
  );

  const shelter3Id = uuidv4();
  db.prepare(`INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, description, cover_image, total_pets, adopted_count, capacity, status, verified, joined_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 1, ?)`).run(
    shelter3Id, shelter3UserId, 'Van Kedisi Koruma Merkezi', 'Van', 'İpekyolu',
    'İpekyolu Mahallesi, Van Gölü Caddesi No:8', '+90 432 555 0303', 'info@vankedi.org',
    'Van kedilerinin korunması ve çoğaltılmasına odaklı özel barınak.',
    'https://images.unsplash.com/photo-1503777119540-ce54b422baff?w=800',
    28, 52, 80, '2020-01-10'
  );

  const shelter4Id = uuidv4();
  db.prepare(`INSERT INTO shelters (id, user_id, name, city, district, address, phone, email, description, cover_image, total_pets, adopted_count, capacity, status, verified, joined_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 1, ?)`).run(
    shelter4Id, shelter4UserId, 'İzmir Dostlar Barınağı', 'İzmir', 'Bornova',
    'Bornova Mahallesi, Umut Sokak No:18', '+90 232 555 0404', 'info@dostlar.com',
    'Köpeklere özel geniş oyun alanları olan, veteriner hizmeti sunan barınak.',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800',
    38, 95, 150, '2017-09-05'
  );

  const pets = [
    { name: 'Pamuk', type: 'dog', breed: 'Golden Retriever', age: 2, gender: 'male', city: 'İstanbul', desc: 'Çok sevecen ve oyuncu bir arkadaş. Çocuklarla harika geçiniyor.', listingType: 'adoption', health: 'Sağlıklı', vaccinated: 1, neutered: 1, ownerId: shelter1Id, ownerType: 'shelter', featured: 1, img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800' },
    { name: 'Minnoş', type: 'cat', breed: 'Scottish Fold', age: 1, gender: 'female', city: 'Ankara', desc: 'Sakin ve sevimli bir kedi. Apartman yaşamına uygun.', listingType: 'adoption', health: 'Sağlıklı', vaccinated: 1, neutered: 0, ownerId: user1Id, ownerType: 'user', featured: 1, img: 'https://images.unsplash.com/photo-1573865526739-10c1dd69c13a?w=800' },
    { name: 'Karabaş', type: 'dog', breed: 'Kangal', age: 3, gender: 'male', city: 'İzmir', desc: 'Bahçeli ev için uygun, koruma içgüdüsü güçlü.', listingType: 'mating', health: 'Sağlıklı', vaccinated: 1, neutered: 0, ownerId: user2Id, ownerType: 'user', featured: 0, img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800' },
    { name: 'Luna', type: 'cat', breed: 'British Shorthair', age: 2, gender: 'female', city: 'Ankara', desc: 'Çok tatlı ve uysal bir kedi. İdeal bir yuva arıyoruz.', listingType: 'adoption', health: 'Sağlıklı', vaccinated: 1, neutered: 1, ownerId: shelter2Id, ownerType: 'shelter', featured: 1, img: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800' },
    { name: 'Max', type: 'dog', breed: 'Labrador', age: 4, gender: 'male', city: 'İstanbul', desc: 'Aktif ve enerjik, günlük uzun yürüyüşler gerektirir.', listingType: 'mating', health: 'Sağlıklı', vaccinated: 1, neutered: 0, ownerId: user1Id, ownerType: 'user', featured: 0, img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800' },
    { name: 'Boncuk', type: 'cat', breed: 'Van Kedisi', age: 1, gender: 'female', city: 'Van', desc: 'Beyaz tüylü, farklı renk gözlü, çok özel bir arkadaş.', listingType: 'adoption', health: 'Sağlıklı', vaccinated: 1, neutered: 1, ownerId: shelter3Id, ownerType: 'shelter', featured: 0, img: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800' },
    { name: 'Şila', type: 'dog', breed: 'Husky', age: 2, gender: 'female', city: 'İzmir', desc: 'Mavi gözlü güzellik, aktif bir aile arıyoruz.', listingType: 'adoption', health: 'Sağlıklı', vaccinated: 1, neutered: 1, ownerId: shelter1Id, ownerType: 'shelter', featured: 0, img: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800' },
    { name: 'Çıtır', type: 'cat', breed: 'Tekir', age: 1, gender: 'male', city: 'Bursa', desc: 'Sokaktan kurtarıldı, şimdi sıcak bir yuva arıyor.', listingType: 'adoption', health: 'Sağlıklı', vaccinated: 1, neutered: 1, ownerId: user2Id, ownerType: 'user', featured: 0, img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800' },
  ];

  const insertPet = db.prepare('INSERT INTO pets (id, name, type, breed, age, gender, city, description, listing_type, health_status, vaccinated, neutered, owner_id, owner_type, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertImg = db.prepare('INSERT INTO pet_images (pet_id, url, sort_order) VALUES (?, ?, ?)');

  for (const pet of pets) {
    const petId = uuidv4();
    insertPet.run(petId, pet.name, pet.type, pet.breed, pet.age, pet.gender, pet.city, pet.desc, pet.listingType, pet.health, pet.vaccinated, pet.neutered, pet.ownerId, pet.ownerType, pet.featured);
    insertImg.run(petId, pet.img, 0);
  }

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@petconnect.com / Admin123!');
  console.log('User login: ayse@example.com / User1234!');
  console.log('Shelter login: info@patibarinak.com / Shelter123!');
}

module.exports = seed;
