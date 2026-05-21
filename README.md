# PetConnect 🐾

Türkiye'nin evcil hayvan sahiplenme ve çiftleştirme platformu. React/Vite frontend + Node.js/Express backend, PostgreSQL veritabanı.

---

## Proje Yapısı

```
petconnect/
├── src/                        # Frontend (React + Vite + Tailwind)
│   └── app/
│       ├── components/         # Yeniden kullanılabilir UI bileşenleri
│       ├── context/            # AuthContext (JWT oturumu)
│       ├── lib/
│       │   └── api.ts          # Axios istemcisi (/api proxy)
│       ├── pages/              # Sayfa bileşenleri
│       └── routes.tsx          # React Router tanımları
├── backend/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js               # PostgreSQL bağlantı havuzu
│   ├── controllers/            # İş mantığı katmanı
│   │   ├── authController.js
│   │   ├── petsController.js
│   │   ├── sheltersController.js
│   │   ├── favoritesController.js
│   │   ├── adminController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   └── auth.js             # JWT doğrulama middleware
│   ├── migrations/             # Sıralı SQL migration dosyaları
│   │   ├── 001_create_extensions.sql
│   │   ├── 002_create_users.sql
│   │   ├── 003_create_shelters.sql
│   │   ├── 004_create_pets.sql
│   │   ├── 005_create_pet_images.sql
│   │   ├── 006_create_favorites.sql
│   │   ├── 007_create_contact_submissions.sql
│   │   └── 008_create_activities.sql
│   ├── routes/                 # Express router katmanı
│   │   ├── auth.js
│   │   ├── pets.js
│   │   ├── shelters.js
│   │   ├── favorites.js
│   │   ├── admin.js
│   │   └── contact.js
│   ├── server.js               # Uygulama giriş noktası
│   ├── migrate.js              # Migration yürütücü
│   ├── seed.js                 # Demo veri yükleyici
│   └── package.json
├── start.sh                    # Backend + frontend başlatıcı
├── vite.config.ts              # Vite + /api proxy ayarları
└── package.json                # Frontend bağımlılıkları
```

---

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- PostgreSQL (Replit'te otomatik sağlanır)

### Ortam Değişkenleri

`backend/.env` dosyası oluşturun:

```env
PORT=3001
JWT_SECRET=your_secret_key_here
```

PostgreSQL bağlantı bilgileri Replit tarafından otomatik olarak sağlanır (`DATABASE_URL`, `PGHOST`, vb.).

### Bağımlılıkları Yükleyin

```bash
# Frontend bağımlılıkları
npm install

# Backend bağımlılıkları
cd backend && npm install
```

### Uygulamayı Başlatın

```bash
bash start.sh
```

Bu komut:
1. PostgreSQL bağlantısını test eder
2. Tüm migration'ları sırayla çalıştırır
3. Demo verileri yükler (ilk çalıştırmada)
4. Backend'i port 3001'de başlatır
5. Vite dev server'ı port 5000'de başlatır

---

## API Endpoint'leri

### Kimlik Doğrulama
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş, JWT döner |
| GET | `/api/auth/me` | Mevcut kullanıcı bilgisi |

### İlanlar (Pets)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/pets` | İlanları listele (filtreli) |
| GET | `/api/pets/:id` | İlan detayı |
| POST | `/api/pets` | Yeni ilan oluştur (auth) |
| PUT | `/api/pets/:id` | İlan güncelle (auth) |
| DELETE | `/api/pets/:id` | İlan sil (auth) |

### Barınaklar
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/shelters` | Barınakları listele |
| GET | `/api/shelters/:id` | Barınak detayı |
| POST | `/api/shelters` | Barınak kaydı (admin) |

### Favoriler
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/favorites` | Favori ilanlarım (auth) |
| POST | `/api/favorites/:petId` | Favoriye ekle (auth) |
| DELETE | `/api/favorites/:petId` | Favoriden çıkar (auth) |

### Admin
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/stats` | Platform istatistikleri |
| GET | `/api/admin/users` | Kullanıcı yönetimi |
| GET | `/api/admin/pets` | İlan yönetimi |
| PUT | `/api/admin/pets/:id/approve` | İlan onayla |

### İletişim
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/contact` | İletişim formu gönder |

---

## Demo Hesapları

Seed verileri aşağıdaki hesapları oluşturur:

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | admin@petconnect.com | Admin123! |
| Kullanıcı | ayse@example.com | User1234! |
| Barınak | info@patibarinak.com | Shelter123! |

---

## Teknoloji Yığını

### Frontend
- **React 18** — UI kütüphanesi
- **Vite 6** — Build tool ve dev server
- **TypeScript** — Tip güvenliği
- **Tailwind CSS 4** — Utility-first CSS
- **React Router 7** — Sayfa yönlendirme
- **Axios** — HTTP istemcisi
- **shadcn/ui + Radix UI** — Bileşen kütüphanesi

### Backend
- **Node.js + Express** — API sunucusu
- **PostgreSQL (pg)** — Ana veritabanı
- **JWT (jsonwebtoken)** — Kimlik doğrulama
- **bcryptjs** — Şifre hashleme
- **MVC mimarisi** — controllers / routes / config katmanları

---

## Veritabanı Şeması

```
users              — Kullanıcı hesapları (admin/user/shelter rolleri)
shelters           — Barınak profilleri
pets               — Evcil hayvan ilanları (sahiplenme/çiftleştirme)
pet_images         — İlan görselleri
favorites          — Kullanıcı favorileri
contact_submissions — İletişim formu başvuruları
activities         — Sistem aktivite günlüğü
```

Migration'lar `backend/migrations/` dizininde sıralı SQL dosyaları olarak tutulur ve uygulama her başladığında otomatik çalışır (idempotent — tekrar çalıştırılabilir).
